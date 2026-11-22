# WDR Converter: Konvertierung in eine Excel-Vorlage (.xlsx-Template)

> **Status (2026-11-22): pausiert.** Der User erstellt zuerst selbst eine Excel-Vorlage. Wenn sie vorliegt:
> 1. Vorlage ansehen. Prüfen, wo Daten und Kopfwerte hin sollen und ob es ein Blatt `Data` gibt.
> 2. Die Regeln unten (Datenblatt, Platzhalter) an die echte Vorlage anpassen.
> 3. Dann umsetzen. Bisher gibt es nur ein Platzhalter-Panel „2. Excel template – Coming soon“ (deaktivierter Button, `.template-panel`) im WDR-Template; die Funktion fehlt noch.
> Stand des Repos beim Pausieren: `main` = `8bdb46d` (Version 3.0 mit Startseite, WDR-Farbschema).

## Context
Der WDR Converter in `Schedule_editor/Lib_Schedule_Editor_v3_0.html` (`<template id="app-wdr">`) schreibt heute jede CSV 1:1 in ein neues Blatt „Data“ (`convertCsvToXlsx`, SheetJS `aoa_to_sheet`).

Der User möchte im Converter eine eigene .xlsx als Vorlage laden. Die Vorlage enthält Layout, Formeln und Diagramme. Beim Konvertieren entsteht pro CSV eine Kopie dieser Vorlage, gefüllt mit den Messdaten.

Antwort an den User: **Ja, das ist möglich.**

## Wichtige Designentscheidung: Vorlage direkt als ZIP bearbeiten, nicht über SheetJS
- Die eingebundene SheetJS-Community-Version verliert beim Lesen und erneuten Schreiben Zellformatierungen, Diagramme, bedingte Formatierung und Bilder. Für eine Vorlage taugt sie deshalb nicht.
- Eine .xlsx ist ein ZIP. Mit dem bereits geladenen JSZip wird nur das XML des Datenblatts ersetzt (`xl/worksheets/sheetN.xml`).
- Alles andere bleibt Byte für Byte erhalten: Formate, Formeln, Diagramme, weitere Blätter, Druckeinstellungen.
- Diagramme und Formeln, die auf das Datenblatt verweisen, zeigen nach dem Öffnen automatisch die neuen Daten.

## Regeln für die Vorlage (feste Vorgaben, im UI kurz erklärt)
1. **Datenblatt:** Das Blatt mit dem Namen `Data`, sonst das erste Blatt. Die CSV wird wie heute ab `A1` hineingeschrieben (Kopfblock, LIMITS, DATA_TAGS, Einheiten, Messwerte). Zellbezüge in Formeln und Diagrammen der Vorlage bleiben dadurch gleich wie bei der bisherigen Ausgabe.
   - Zahlen werden als echte Zahlen geschrieben (bestehendes `toCellValue`), Text als Inline-String.
   - Vorhandene Zellen im Datenblatt werden ersetzt. Spaltenbreiten und Formate des Blatts (`<cols>`, `<sheetFormatPr>`, Fenster fixieren) bleiben erhalten, nur `<sheetData>` und `<dimension>` werden neu geschrieben.
2. **Platzhalter (optional), auf allen anderen Blättern:**
   - Text wie `{{SCHEDULE}}`, `{{WELD HEAD}}`, `{{POWER SUPPLY}}`, `{{TRACK DIAMETER}}`, `{{DATE}}`, `{{START TIME}}`, `{{USER}}` und `{{FILE}}` (CSV-Name) wird durch die Werte aus dem CSV-Kopf ersetzt.
   - Ersetzt wird in `xl/sharedStrings.xml` und bei Inline-Strings.
3. **Neuberechnung:** In `xl/workbook.xml` wird `<calcPr fullCalcOnLoad="1">` gesetzt und `xl/calcChain.xml` samt Verweisen entfernt. Excel rechnet dann alle Formeln beim Öffnen neu.

## Umsetzung (nur `<template id="app-wdr">` in `Lib_Schedule_Editor_v3_0.html`)
- **UI – neues Panel „2. Excel template (optional)“** zwischen Dateiauswahl und Ausgabeformat:
  - Ablagefeld bzw. Button „Load template (.xlsx)…“.
  - Anzeige von Name, Datenblatt und gefundenen Platzhaltern.
  - Button „Remove template“.
  - Hinweis „Without a template the data is written to a new workbook as before.“
- **Laden der Vorlage:**
  - Mit JSZip prüfen, ob die Datei eine gültige xlsx ist.
  - Datenblatt über `xl/workbook.xml` und `xl/_rels/workbook.xml.rels` ermitteln.
  - Fehler im Panel anzeigen, z. B. bei .xls, beschädigter Datei oder Passwortschutz.
- **Merken:** Die Vorlage wird als Base64 im `localStorage` gespeichert (`wdrTemplate`: Name und Daten) und bleibt so nach dem Neuladen geladen. Ist sie zu groß für den Speicher, gilt sie nur für die Sitzung, mit Hinweis.
- **Konvertieren:**
  - `convertCsvToXlsx(csvText)` bekommt eine Vorlagen-Variante `fillTemplate(templateBytes, matrix, headerValues, fileName)`.
  - Pro CSV wird die Vorlage frisch geladen (`JSZip.loadAsync`), das Blatt-XML mit Array-Join erzeugt (auch für sehr große CSVs mit rund 200.000 Zeilen) und das Ergebnis als `uint8array` mit DEFLATE erzeugt.
  - Der übrige Ablauf bleibt unverändert: Zielordner bzw. ZIP-Teile, Fortschritt, Fehlerliste.
- **Kopfwerte:** Aus den ersten Zeilen bis `LIMITS_TAGS` (`SCHEDULE,0404-Fill-OUT` usw.) wird eine Map gebaut. Bei `DATE` und `START TIME` wird das letzte Feld genommen.
- **Doku:** Den WDR-Abschnitt in README_v3_0.md um Vorlage, Regeln und Platzhalter ergänzen.

## Verifikation (Playwright, Chromium)
- Testvorlage per Script erzeugen, nicht mit SheetJS, damit Formatierung vorhanden ist. Am einfachsten eine minimal gebaute xlsx mit einem Blatt `Data`, einem Blatt `Summary` mit `{{SCHEDULE}}`, einer Formel `=MAX(Data!C14:C5000)` und einer fett formatierten Zelle.
- Vorlage laden, kleine CSV (Ausschnitt der Beispiel-CSV) konvertieren und das ZIP herunterladen. Danach prüfen:
  - `Summary` enthält `0404-Fill-OUT`, die Formel ist erhalten und `fullCalcOnLoad` ist gesetzt.
  - Die Stil-Datei `xl/styles.xml` ist unverändert.
  - `Data!A1` ist `LIBURDI DATA LOG` und die Messwerte sind Zahlen.
- Mit SheetJS gegenlesen, ob die Datei gültig ist und die Werte stimmen.
- Prüfen, dass ohne Vorlage die Ausgabe wie bisher entsteht.
- Prüfen, dass die Vorlage nach dem Neuladen noch geladen ist und „Remove template“ sie entfernt.
- Gegenprobe mit der echten 13-MB-CSV auf Laufzeit und Speicher.
- Arbeit auf einem neuen Branch; Commit erst nach Freigabe, Merge und Push nur auf Anfrage.
