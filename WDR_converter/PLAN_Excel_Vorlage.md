# WDR Converter: Excel-Vorlage → Heat-Input-Auswertung im Converter

> **Status (2026-11-23): umgesetzt** auf Branch `wdr-heat-input`.
>
> Der Converter erzeugt die Auswertung der Vorlage `template_metric_Short.xlsx` jetzt selbst: je CSV eine Excel-Datei und dazu eine Sammeltabelle. Die Bedienung beschreibt `Schedule_editor/README_v3_0.md`, Abschnitt „WDR Converter: Heat-Input-Auswertung“.
>
> Der frühere Plan, eine beliebige .xlsx-Vorlage per ZIP zu befüllen (Platzhalter `{{SCHEDULE}}` usw.), ist damit überholt. Grund: Die echte Vorlage rechnet mit über 120.000 Formelzeilen und hat die unten genannten Fehler. Ein bloßes Befüllen hätte diese Fehler übernommen.

## Geprüfte Dateien
- `template_metric_Short.xlsx` (60 MB) ist die Auswertung einer Raupe, hier 0408 Cap, Bead L21_B42. Sie enthält:
  - ein Rohdatenblatt (Power Query),
  - das Blatt **Data** mit den Formeln,
  - das Blatt **Factors and limits**,
  - das Blatt **5 to 10** mit 5 Diagrammen.
- `WPQ_O01-EXT_PK_Heat-input.xlsx` ist die Sammeltabelle aller Raupen.
- Beide Dateien liegen nicht im Repository.

## Befunde zur Vorlage
1. **Die Zeitachse ist doppelt so lang.**
   - Die Vorlage rechnet `K = (J + J_nächste Zeile)/60` statt `J/60`.
   - Beispiel: Zeile 121000 zeigt 51,7 min statt 25,8 min.
2. **Die Diagramm-Achsen sind um 999 Zeilen verschoben.**
   - Die Kategorien stehen in `K4:K1048576`, die Werte in `L1003:L121000`.
3. **Der Process factor ist 1, die Sammeltabelle rechnet aber mit 0,6.**
   - Faktor 1 ergibt Lichtbogenenergie, Faktor 0,6 Heat Input.
   - Wer die Vorlage unverändert nutzt, bekommt um 67 % zu hohe Werte.
   - Maschine und Schedule Editor rechnen mit 0,6.
4. **Spaltenüberschriften sind falsch:**
   - Y ist das Mittel der Einzelwerte, nicht „per period“.
   - Z, AA und AB gehören zu Methode C, nicht zu „per peak“ bzw. Methode A.
5. **Logs, die kürzer als 121000 Zeilen sind, erzeugen `#DIV/0!` und `#VALUE!` im Kennwertbereich.**
   - Ursache: Die Blöcke SEGMENT_AVERAGE und SETPOINT am Logende werden wie Messwerte gelesen.
6. **Der Datenbeginn ist fest auf Rohzeile 14.**
   - Logs der Version 3 haben zusätzliche Kopfzeilen und sind imperial (IPM, J/in).
7. **Zahlen stehen als Text mit Dezimalkomma.** Das funktioniert nur in deutschem Excel.
8. **Power Query verweist auf eine andere Datei.**
   - Die Abfrage zeigt auf 0402, die Rohdaten stammen aus 0408.
   - Ein „Aktualisieren“ lädt deshalb falsche Daten oder Pfade vom Rechner des Erstellers.
9. **Die Fenster der gleitenden Mittel sind in Zeilen festgelegt (104/996), nicht in Zeit.**
   - Die Abtastung ist unregelmäßig, im Mittel 12,8 ms. 104 Zeilen sind damit etwa 1,3 s.
   - Die Pendelperiode hängt vom Programm ab: bei 0408 etwa 1,0 s, bei 0404 1,6 s.
10. **Gespeicherte Werte sind veraltet.**
    - In der Vorlage steht per period MIN T4 = 0,9993; die Formeln ergeben 1,1198.
    - In der Sammeltabelle steht für L21_B42 in Spalte G 0,5996; korrekt ist 0,6719.
    - Bei L21_B41 steht in allen Spalten derselbe Wert 0,69287, vermutlich ein Eingabefehler.
11. **Die Datei hat 60 MB je Raupe.**
    - Ursache: gespeicherte Diagrammdaten und eine calcChain von 49 MB.
    - Die Heat-Input-Grenzen je Lage im Blatt „Factors and limits“ werden nicht verwendet.

## Umsetzung (in `<template id="app-wdr">` der Suite)
- Der Parser erkennt Kopf und Blöcke über ihre Namen. Er unterstützt:
  - Log-Version 2 und 3,
  - metrische und imperiale Einheiten,
  - `,` oder `;` als Trennzeichen mit Dezimalkomma.
- Die Berechnung entspricht dem Blatt „Data“, mit folgenden Korrekturen:
  - Die Zeit wird korrekt berechnet (K = J/60).
  - Process factor ist einstellbar, Standard 0,6.
  - Der Auswertebereich endet vor dem Downslope. Optional wird er automatisch aus den Sollwerten bestimmt.
  - Die Fenster sind optional zeitbasiert über die Pendelperiode (In-Dwell + Out-Dwell + 2 × Excursion).
  - Zusätzliche Kennwerte: Energie/Weg sowie die Segment-Mittel der Maschine.
- **Ausgabe:**
  - Die Kennwerte stehen als Formeln über den tatsächlichen Bereich.
  - Die Diagramme sind Streudiagramme über ausgedünnte Daten.
  - Eine Datei ist etwa 11 MB groß bei 138.000 Messzeilen.
  - Die Sammeltabelle prüft gegen die Heat-Input-Zielbereiche des Schedule Editors.
- **Abgleich** (`Schedule_editor/tests/wdr-evaluation.test.js`, läuft nur, wenn die Vorlage lokal vorhanden ist):
  - Mit Faktor 1 stimmen die Werte mit Zeile 4 der Vorlage überein, außer dem veralteten T4.
  - Mit Faktor 0,6 stimmen sie mit der Zeile L21_B42 der Sammeltabelle überein.

## Offen / Ideen
- Vorwärmtemperatur (Spalte „Preheat“ der Sammeltabelle) wird nicht geloggt und bleibt leer.
- Heat-Input-Formel im Schedule Editor (`calculateSegmentHeatInput`):
  - Sie rechnet die Pendelperiode als In-Dwell + Excursion + Out-Dwell, also mit nur einer Excursion.
  - Die Maschinendaten (0404) passen zu zwei Excursions: Der Editor ergibt 1,2366 kJ/mm, die Maschine 1,1848 kJ/mm, die Formel mit 2 × Excursion 1,1844 kJ/mm.
  - Das ist noch nicht geändert.
