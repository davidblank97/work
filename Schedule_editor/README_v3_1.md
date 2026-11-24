# Liburdi Schedule Suite v3.1

Die Suite fasst den **Schedule Editor**, den **WDR Converter** (Welddata Converter) und den **Pendant Layout Editor** in einer Datei zusammen: `Lib_Schedule_Editor_v3_1.html`.

## Neu in Version 3.1

- **Heat Input & WPS** (ein Werkzeug mit zwei Reitern, siehe „WPS-Import und -Pruefung“):
  - WPS als digitale PDF einlesen, auch Formulare mit den Lagen als Spalten. Uebernommen werden nur mechanisierte Prozesse (m-141); mehrere WPS in einer PDF sind waehlbar.
  - Die Heat-Input-Bereiche der WPS werden zu Target Ranges.
  - Pruefung aller Schedules gegen die WPS, mit Tabelle je Lage: Puls und Grund getrennt, Status OK / Override / Outside.
  - **Fit Overrides:** groesstmoeglicher Override-Bereich bis 10 %, ohne dass die WPS verletzt werden kann, auch beim Heat Input.
  - **Fit Values** (mit Sicherheitsabfrage): Werte auf die WPS-Grenze setzen. Die Schweissgeschwindigkeit wird nie veraendert.
- **Anzeige:**
  - Alle Zahlen mit hoechstens 2 Nachkommastellen; die Datei behaelt ihre Genauigkeit.
  - Der Drahtvorschub in der WPS-Pruefung wird in cm/min angezeigt.
  - Staerkere Rahmen der Eingabefelder (Kontrast mindestens 3:1).
- **Programmuebersicht (PDF):**
  - Ein Dialog fragt nach dem Nahtnamen (wird zur Ueberschrift) und nach „Prepared by“.
  - WPS-Bereiche und WPS-Pruefung stehen am Ende.
  - Segmentwerte gruppiert, Overrides in %.
  - Saubere Seitenumbrueche ohne zerschnittene Tabellen.
- **WDR Converter:**
  - Heat-Input-Auswertung je CSV und Sammeltabelle aller Raupen, mit Schweisszeit und Drahtverbrauch (kg).
- **Intern:**
  - Die Datei wird aus Modulen in `src/` gebaut (siehe „Entwicklung“).
  - Die Arbeitsordner sind aufgeraeumt: Daten in `data/`, Notizen in `docs/`, Altes in `/_archiv`.

## Start

`Lib_Schedule_Editor_v3_1.html` in einem aktuellen Browser oeffnen. Es erscheint eine **Startseite** mit zwei Karten:

- **Schedule Editor:** Liburdi-Schedule-XML-Dateien bearbeiten, vergleichen und speichern (Beschreibung ab „Aufbau der Oberflaeche“).
- **WDR Converter:** Schweissdaten-Aufzeichnungen (Liburdi Data Logs, CSV) auswerten: je CSV eine Heat-Input-Auswertung als Excel-Datei plus eine Sammeltabelle aller Raupen (siehe „WDR Converter: Heat-Input-Auswertung“), oder wie bisher nur die Rohdaten als .xlsx. Chrome/Edge fragen beim Start nach einem Zielordner und schreiben die Dateien direkt dorthin; andere Browser laden ein ZIP herunter. XML-Dateien werden unveraendert kopiert.

- **Pendant Layout:** Tastenbelegung des Handbediengeraets (Pendant) bearbeiten und als `key_layout_<Suffix>.xml` oder PDF-Vorschau ausgeben (siehe „Pendant Layout“ unten).

Nach der Auswahl wird die Anwendung geoeffnet. Oben erscheint eine schmale Leiste:

- `⌂ Start` fuehrt zur Startseite zurueck.
- `Schedule Editor` / `WDR Converter` / `Pendant Layout` wechseln direkt zwischen den Anwendungen.

Einmal geoeffnete Anwendungen laufen weiter: Geladene XML-Dateien, Undo-Verlauf und Auswahl bleiben beim Wechsel erhalten, auf der Startseite sind sie mit `Open` markiert. Erst beim Schliessen oder Neuladen des Browser-Tabs gehen sie verloren (der Editor warnt bei ungespeicherten Aenderungen). Die Adresse merkt sich die gewaehlte Anwendung (`…v3_1.html#editor` bzw. `#wdr`); solche Links und die Zurueck-Taste des Browsers funktionieren.

Beide Anwendungen sind eigenstaendig und brauchen **kein Internet**: Der Schedule Editor enthaelt CSS, JavaScript und JSZip, der WDR Converter enthaelt SheetJS 0.18.5 und JSZip 3.10.1.

Empfohlen wird der Start ueber einen lokalen Webserver, damit `segments_sorting.json` geladen wird und der XML Viewer auf die Schemas der Schedule Database zugreifen kann:

```bash
cd /workspaces/work
python3 -m http.server 8000
```

Danach `http://localhost:8000/Schedule_editor/Lib_Schedule_Editor_v3_1.html` oeffnen.

Die Oberflaeche ist englisch; diese Anleitung ist deutsch.

**Aufbau der Datei:** Startseite und Umschaltung stehen am Anfang und Ende der Datei. Die beiden Anwendungen liegen unveraendert in `<template id="app-editor">` bzw. `<template id="app-wdr">` und werden beim Oeffnen jeweils als eigenes Dokument (iframe) gestartet, damit sich CSS und JavaScript nicht gegenseitig stoeren. Aenderungen am Editor oder Converter werden direkt im jeweiligen Template vorgenommen. Einstellungen im `localStorage` (ausgeblendete/gesperrte Parameter, Reihenfolge usw.) sind dieselben wie bei der Einzeldatei, solange sie ueber dieselbe Adresse geoeffnet wird.

## WPS-Import und -Pruefung (Tools › Heat Input & WPS, Reiter „WPS Import / Check“)

Heat Input und WPS sind ein Werkzeug mit zwei Reitern: **Heat Input** (Diagramm, Tabelle, Target Ranges) und **WPS Import / Check**.

Liest die Parametertabelle einer **WPS als digitale PDF** ein (Text markierbar; eingescannte Dokumente enthalten keinen Text, dann die Werte von Hand eintragen). Alles laeuft offline im Browser (pdf.js eingebettet).

1. **Load WPS (PDF)…** (oder PDF auf das Feld ziehen):
   - Die Tabelle mit Lage/Raupe, Strom, Spannung, Schweissgeschwindigkeit, Drahtvorschub und Waermeeinbringung wird erkannt (deutsche und englische Bezeichnungen).
   - Bereiche wie `120 – 150`, `0,5 – 0,9`, `max. 1,2` oder `9 ± 2` werden gelesen.
   - Die Einheiten werden umgerechnet (Strom A, Spannung V, Vorschub mm/min, Draht cm/min, Heat Input kJ/mm).
   - Zwei Tabellenformen werden erkannt: eine Zeile je Lage, oder Formulare mit den **Lagen als Spalten** und je einer `min.`/`max.`-Zeile pro Parameter (Bilfinger-Vordruck, z. B. Seite 24 im WDP-3).
   - Bei Formularen werden nur **mechanisierte Prozesse (m-141)** uebernommen; Spalten mit Handschweissen (141, z. B. Wurzel-/Stuetzlage) werden mit Hinweis uebersprungen.
   - Enthaelt die PDF mehrere WPS (z. B. HIC-O01-1P auf Seite 24 und HIC-O01-2P auf Seite 27), kann die WPS ausgewaehlt werden; die WPS-Nummer wird aus dem Kopf gelesen.
2. **Pruefen und korrigieren:**
   - Die erkannten Werte stehen in einer Tabelle zum Bearbeiten. Der gelesene Text ist zum Vergleich aufklappbar.
   - Je Lage werden die Schedules ueber die 4-stellige Nummer zugeordnet. Die Vorbelegung kommt aus den geladenen Dateien nach Lagentyp: Root, Hot pass, Fill (Comp ohne eigene Zeile), Cap.
   - **Bitte immer mit dem Dokument vergleichen.**
3. **Apply:**
   - Speichert die Bereiche im Browser.
   - Uebernimmt den Heat-Input-Bereich jeder Lage als **Target Range** (Reiter „Heat Input“). Ein erneuter Import ersetzt nur diese WPS-Bereiche; eigene Bereiche bleiben.
4. **Pruefung** der geladenen Schedules je Segment:
   - Strom (pri/bkg_amp), Spannung (pri/bkg_ahc), Vorschub und Draht (umgerechnet aus in/min) sowie Heat Input.
   - **Rot:** Wert ausserhalb der WPS.
   - **Gelb:** Wert innerhalb, aber der Override-Bereich (pri/bkg_amp_max, avc_override_max, travel_max, wire_max bzw. Heat-Input min/max) reicht hinaus.
   - Waehlbar: Puls- und Grundwert einzeln (Standard) oder zeitgewichteter Mittelwert (Dwell/Excursion).
   - Tabelle: je WPS-Lage eine Zeile mit den Bereichen („WPS range“), darunter je Schedule eine Zeile. Puls (P) und Grund (B) stehen in eigenen Spalten, rechts die Spalte **Status** (OK / Override / Outside).
   - Ein Klick oeffnet das Segment; beim Ueberfahren eines Werts stehen die Details im Tooltip.
5. **An die WPS anpassen** (fuer die markierten Dateien mit WPS-Zeile; Rueckgaengig mit Strg+Z, jede Aenderung steht im Change Log und darunter in einer Liste):
   - **Fit Overrides** (Ziel: dem Schweisser einen moeglichst grossen Bereich lassen, ohne dass er die WPS verletzen kann):
     - Die Heat-Input-relevanten Overrides (`pri_amp_max`, `bkg_amp_max`, `avc_override_max`, `dwell_max`, `excursion_max`) werden auf den **groesstmoeglichen Bereich bis 10 %** gesetzt, also auch vergroessert.
     - Jeder Wert ± Override muss in der WPS liegen. Nahe der Grenze wird der Override kleiner (z. B. 10,9 V bei max. 11,77 V → 7,9 %). Abgerundet wird auf 0,1 %.
     - Der Heat Input muss auch im ungunstigsten Fall (alle Overrides gleichzeitig) in der WPS bleiben. Sonst werden diese Overrides gemeinsam so wenig wie noetig reduziert (z. B. Decklage mit 0,47–0,70 kJ/mm → alle 3,9 %).
     - `wire_max` nach derselben Logik: groesstmoeglich bis 10 %, sodass Draht ± Override in der WPS bleibt (kein Einfluss auf den Heat Input). `travel_max` bleibt unveraendert.
     - **Die Werte selbst werden nie geaendert.** Liegt ein Wert schon ausserhalb, wird er als „Not solved“ gemeldet (dann Fit Values).
   - **Fit Values:**
     - Da hier die Programmwerte selbst geaendert werden, erscheint vorher eine **Sicherheitsabfrage** mit den betroffenen Programmen („Cancel“ ist vorausgewaehlt).
     - Strom, Spannung und Draht ausserhalb der WPS werden auf die naechste WPS-Grenze gesetzt (nach innen gerundet, mit den Nachkommastellen der Datei).
     - Liegt der Heat Input danach noch ausserhalb, wird der Strom (Puls- und Grundstrom mit demselben Faktor) angepasst, soweit der WPS-Strombereich es erlaubt.
     - Ein Wert auf der Grenze laesst den Override gelb; dann zusaetzlich **Fit Overrides**.
   - Werte genau auf der WPS-Grenze gelten als innerhalb und werden nicht veraendert.
   - **Die Schweissgeschwindigkeit (`pri_travel`, `bkg_travel`, `travel_max`) wird nie veraendert.** Liegt sie ausserhalb der WPS, wird das nur gemeldet.
6. **Batch Save** warnt, wenn Werte ausserhalb der WPS liegen.

## WDR Converter: Heat-Input-Auswertung

Ersetzt die Excel-Vorlage `template_metric_Short.xlsx` (gleiche Kennwerte, aber ohne deren Fehler; Befunde in `docs/PLAN_Excel_Vorlage.md`). Ausgabeformat „Heat input evaluation“ (Standard):

- **Je CSV `<Name>_heat-input.xlsx`:**
  - `Data`: Spalten A–P wie in der Vorlage, **immer metrisch** (cm/min, mm/min, kJ/mm; imperiale Logs werden umgerechnet) und mit zwei Nachkommastellen angezeigt (gerechnet wird mit voller Genauigkeit). A–G sind die Logwerte, H ist Methode C (Maschine), I der Vorschub in mm/min, J/K die Zeit in s/min (K = J/60, die Vorlage rechnete die Zeit doppelt), L Methode A je Messpunkt (U·I/v·0,06·k), M/N nach Grund-/Pulsstrom getrennt, O/P gleitende Mittel „per period“ bzw. „per 10 periods“.
  - Zeile 4 enthaelt die Kennwerte Q–AB (Min/Max/Mittel) als **Formeln ueber den tatsaechlichen Bereich**. Dazu kommen AC (Verhaeltnis A/C), AD (Energie/Weg k·ΣU·I·Δt / Σv·Δt), AE (Segment-Mittel der Maschine) und AF (Heat Input laut Log). Die Ueberschriften sind korrigiert.
  - `Charts`: 5 Diagramme mit der Zeit in Minuten auf der x-Achse. Sie verweisen auf das ausgeduennte Blatt `Chart data` (Minimum und Maximum je Abschnitt). Bei bekanntem Zielbereich sind Grenzlinien eingezeichnet.
  - `Factors and limits`: verwendete Einstellungen, Log-Kopf, Zielbereich mit Ergebnis, Maschinengrenzen (LIMITS).
  - `Machine averages`: Segment-Mittelwerte und Sollwerte aus dem Log, metrisch umgerechnet.
  - Optional `Raw data` mit allen Logspalten (etwa doppelte Dateigroesse).
- **`Heat_input_summary_<Datum>.xlsx`:** je Raupe eine Zeile, Spalten wie die WPQ-Sammeltabelle.
  - Die Lage (Root/Hot pass/Fill/Cap) kommt aus dem Schedule-Namen, die Raupe aus dem Dateinamen (`L21_B42` oder `Layer 7 Bead 12`).
  - Dazu kommen Zielbereich und Status sowie je Lage MIN/MAX/AVERAGE als Formeln.
  - **Schweisszeit** (Dauer des Logs, h:mm:ss) und **Drahtverbrauch** (Laenge in m und Masse in kg, Drahtvorschub ueber die ganze Schweissung aufsummiert) je Raupe, mit Summenzeile und Summen je Lage. Drahtdurchmesser (Standard 0,8 mm) und Dichte (Standard Stahl 7,85 g/cm³) sind im Panel einstellbar.
- **Einstellungen** (Panel 2, im Browser gespeichert):
  - **Process factor k:** Standard 0,6 wie Maschine und Editor; 1 = Lichtbogenenergie.
  - **Auswertebereich:** immer der Dauerbetrieb laut Sollwerten des Logs (ohne Up- und Downslope); ohne Sollwerte das ganze Log. Die festen Zeilen 1000–121000 der Vorlage gibt es nicht mehr.
  - **Fenster der gleitenden Mittel:** immer die Pendelperiode aus dem Log (In-Dwell + Out-Dwell + 2 × Excursion) bzw. das Zehnfache; enthaelt das Log keine Pendelzeiten (Version 2), gilt der eingestellte Wert (Standard 1,0 s). Die festen 104/996 Zeilen der Vorlage gibt es nicht mehr.
  - **Pruefung:** gegen die Heat-Input-Zielbereiche des Schedule Editors, zugeordnet ueber die 4-stellige Schedule-Nummer. Geprueft wird per period MIN/MAX; Abweichungen erscheinen rot und in der Abschlussmeldung.
- Log-Versionen 2 (metrisch) und 3 (imperial: IPM, J/in) werden erkannt und umgerechnet, ebenso `;` als Trennzeichen mit Dezimalkomma. CSVs, die keine Liburdi-Logs sind, werden als Rohdaten geschrieben.

## Pendant Layout

Bearbeitet die Tastenbelegung des Pendants (Datei `key_layout_*.xml`). Urspruengliche Quelle: `_archiv/Pendant_layout_original/Pendant_Layout_Generator_Simplified_v2_offline.html`; in der Suite im Farbschema des Editors.

- **Dateiformat:**
  - Root `<termkeys>` (neu) oder `<infinitykeys>` (alt, wird beim Laden akzeptiert).
  - Darunter `metadata` (u. a. Autor, Datum) und neun Modi `<mode index name>`: NUMPAD, JOG, AUXJOG, MENU, INPUT, VIEW, EDIT, WELD, WELD2.
  - Jeder Modus hat 7 Zeilen × 4 Tasten (`<row index>` / `<key index>`); der Tasteninhalt ist der Funktionsname (z. B. `trav_fwd`), leer bedeutet unbelegt.
  - Beispiel: `data/samples/key_layout.xml`.
- **Bearbeiten:**
  - Datei laden (`Choose File`) oder mit den Werkseinstellungen beginnen; Autor und Dateinamen-Suffix eintragen.
  - Die Modi **JOG, WELD, WELD2** in Tabs bearbeiten: je Taste eine Auswahlliste, `--- CUSTOM ---` fuer freie Namen.
  - `Copy page` / `Paste page` kopiert eine Seite, `Fill page with blank_black` leert sie.
- **Ausgabe:**
  - `Generate XML` laedt `key_layout_<Suffix>.xml` herunter, immer mit Root `<termkeys>` und allen neun Modi. Die nicht bearbeitbaren Modi stammen aus der geladenen Datei oder den Werkseinstellungen.
  - `Preview PDF` oeffnet eine helle Druckansicht (A4) zum Drucken bzw. Speichern als PDF.
- **Hinweis:** Beim Laden wird das Suffix aus dem Dateinamen nach `key_layout_` uebernommen. Heisst die Datei nur `key_layout.xml`, lautet der Vorschlag `key_layout_modified`; das Suffix laesst sich vor dem Erzeugen frei aendern.

## Aufbau der Oberflaeche

- **Kopfzeile links:** `Open XML…`, Zurueck (↩), Wiederholen (↪), Hilfe (?)
- **Kopfzeile Mitte:** Suche mit Trefferzahl
- **Kopfzeile rechts:** Anzeige ungespeicherter bzw. noch nicht heruntergeladener Dateien, `Revert`, `Save`, `Batch Save`
- **Sidebar:** Dateiliste mit `Select all` / `Clear` / `Invert`, Bereiche (`Description` … `Segments`) und Tools

## Tastenkuerzel

| Kuerzel | Funktion |
|---|---|
| Strg+S | Aktive Datei speichern |
| Strg+Z | Zurueck |
| Strg+Y / Strg+Umschalt+Z | Wiederholen |
| Strg+F oder `/` | Suche fokussieren |
| Esc | Dialog schliessen bzw. Suche leeren |
| Enter | Im Dialog bestaetigen; in der Sidebar Eintrag oeffnen |

Steht der Cursor in einem Eingabefeld, gilt fuer Strg+Z/Strg+Y das normale Rueckgaengig des Browsers. Alle Sidebar-Eintraege sind per Tab-Taste erreichbar.

## XML-Dateien laden

1. Eine oder mehrere `.xml`-Dateien ueber `Open XML…` laden.
2. Alternativ XML-Dateien in den Bereich `Drop XML files here` ziehen.
3. Eine Datei in der linken Dateiliste anklicken (oder per Tab + Enter waehlen), um sie als aktive Datei auszuwaehlen. Der Status zeigt `Saved` oder `Unsaved`.
4. Mehrere Dateien koennen ueber die Kontrollkaestchen fuer Batch-Aktionen markiert werden.

Geladene Dateien werden nach den ersten vier Zeichen ihres Namens sortiert: Dateien mit vierstelliger Nummer (z. B. `0303-…`) stehen zuerst und aufsteigend, alle anderen danach in Ladereihenfolge. Aktiv wird die erste neu geladene Datei in dieser Reihenfolge. Per Ziehen in der Dateiliste kann weiterhin von Hand umsortiert werden.

Die Dateien werden im Browser geladen und dort bearbeitet. Es wird keine Datei automatisch auf einen Server hochgeladen.

Angenommen werden nur gueltige XML-Dateien mit dem Wurzelelement `<sched>` und mindestens einem `<segment>`. Abgewiesene Dateien werden in der Statusleiste mit Grund aufgefuehrt. Nach dem Laden sind alle neuen Dateien markiert. Das Laden ist ein eigener Schritt im Zurueck-Verlauf.

## Bearbeiten

**Textfelder:** Felder, die laut Schema Text sind (z. B. `arc_type` mit `TOUCH`), werden als Text angezeigt und unveraendert gespeichert; Aenderungen gehen wie bei Zahlen auf markierte Dateien.

**Ungueltige Werte:** Steht in der Datei in einem Zahlenfeld kein gueltiger Wert (z. B. `abc`), zeigt der Editor den Originaltext rot an und veraendert ihn nicht, auch nicht beim Anklicken. Erst eine gueltige Eingabe wird geschrieben, bei Kommazahlen mit sechs Nachkommastellen, bei Ganzzahl- und Ja/Nein-Feldern ohne.

Die XML-Daten sind in folgende Bereiche gegliedert:

- `Description`
- `Global`
- `Limits`
- `Overrides`
- `Segments`

Werte koennen direkt in den Eingabefeldern geaendert werden. Dezimalzahlen duerfen mit Punkt oder Komma eingegeben werden (`12,5` = `12.5`); Eingaben wie `12abc` werden nicht uebernommen. Gespeichert wird immer mit der Anzahl Nachkommastellen, die der Wert in der Datei hat. Wird dabei gerundet, erscheint ein Hinweis in der Statusleiste.

**Anzeige mit 2 Nachkommastellen:** Alle Zahlen werden im Editor mit hoechstens zwei Nachkommastellen angezeigt (z. B. `10.00` statt `10.000000`), auch im Vergleich, beim Heat Input und in der WPS-Pruefung. In der Datei bleibt die volle Genauigkeit erhalten: Nur Anklicken und Verlassen eines Feldes aendert nichts, auch nicht in den umgerechneten Einheiten (mm, cm/min). Eine eingetippte Zahl wird mit der Stellenzahl der Datei gespeichert (`3,1234567` → `3.123457`, angezeigt `3.12`).

Ist die aktive Datei markiert, werden Aenderungen in `Description`, `Global`, `Limits` und `Overrides` auch in alle anderen markierten Dateien uebernommen. Diese Aenderungen erscheinen im Change Log und lassen sich gemeinsam rueckgaengig machen. Segmentwerte gelten immer nur fuer die aktive Datei.

Werte, die vom zuletzt gespeicherten (bzw. geladenen) Stand abweichen, bleiben gruen markiert, auch nach einem Bereichswechsel. Beim Ueberfahren mit der Maus zeigt ein Tooltip den gespeicherten Wert (`Last saved: …`).

Beim Ueberfahren einer Parameterzeile erscheinen drei Knoepfe: ★ markiert den Parameter als wichtig (farbig hervorgehoben), 🔒 sperrt ihn gegen Aenderungen, ⊘ blendet ihn aus.

**Reihenfolge:** Die Parameterzeilen werden nicht mehr automatisch sortiert. Am Parameternamen oder am Griff ⠿ links davon laesst sich eine Zeile per Drag & Drop verschieben; mit `Alt+↑` / `Alt+↓` auf dem Griff rueckt sie um eine Position. Die Reihenfolge gilt je Bereich (`Description`, `Global`, `Limits`, `Overrides`; alle Segmente teilen sich eine Reihenfolge) fuer alle Dateien, laesst sich mit Undo zuruecknehmen und wird im `localStorage` gespeichert (Schluessel `scheduleEditorParameterOrder`, auch im Local Storage Backup enthalten). `Reset order` im Panel-Kopf stellt die Standardreihenfolge wieder her: XML-Reihenfolge bzw. bei Segmenten die Vorgabe aus `segments_sorting.json`. Neue Felder, die in der gespeicherten Reihenfolge fehlen, erscheinen am Ende. Gesperrte Parameter (🔒) lassen sich nicht verschieben und bleiben an ihrer Position stehen, wenn andere Zeilen verschoben werden.

**Sperren:** Ein gesperrter Parameter (🔒 bleibt sichtbar, Feld gestrichelt und schreibgeschuetzt) kann nicht versehentlich geaendert werden. Die Sperre gilt je Parametername fuer alle Dateien und bleibt im Browser gespeichert (auch im Settings). Sie schuetzt auch vor indirekten Aenderungen: Uebertragung auf markierte Dateien, Comparison (Bearbeiten und `Apply to all`), Kopf-Presets beim Wechsel des Heads sowie – bei gesperrtem `segment_time` – Nahtlaenge, editierbare Segment-Tabelle und die Neuverteilung beim Hinzufuegen/Duplizieren/Loeschen. Zurueck (Undo) und `Revert` bleiben moeglich. Ein erneuter Klick auf 🔒 entsperrt. Doppelklick bzw. Rechtsklick auf den Namen funktionieren weiterhin. Ausgeblendete Parameter werden unter `Tools > Hidden Parameters` wiederhergestellt.

Die Suche filtert die Tabellen nach Parametername und angezeigtem Wert und zeigt die Trefferzahl. Mit × oder Esc wird sie geleert.

Ueber die Einheiten-Taste neben einem Feld wird die Anzeige umgeschaltet (z. B. `in`/`mm` fuer Durchmesser, `cm/min` fuer Vorschub und Draht, Grad fuer `tungsten_width`). In der Datei bleibt der Wert immer in der XML-Einheit gespeichert.

Die Parameter werden platzsparend in mehreren Spalten angezeigt (je nach Fensterbreite eine bis drei); `note` und `custom_search_tag` nutzen die volle Breite.

Im Bereich `Segments` zeigt die Uebersicht links einen Ring (ein Umlauf = gesamte Schweisslaenge, jedes Segment als anteiliger Bogen; in der Mitte Durchmesser, Umdrehungen und Gesamtwinkel) und rechts eine Tabelle mit Laenge, Winkel, Umdrehungen und Schweisszeit je Segment sowie einer Summenzeile. Ein Klick auf eine Tabellenzeile oder einen Bogen oeffnet das Segment; die Knoepfe ⧉ ↑ ↓ × in der Zeile duplizieren, verschieben bzw. loeschen es. Die geschaetzte Gesamt-Schweisszeit steht in der Kopfzeile der Uebersicht.

Neben dem Ring steht das Feld **Weld seam length (mm)**. Die eingegebene Schweissnahtlaenge wird gleichmaessig auf alle Segmente verteilt und (in Zoll umgerechnet) in `segment_time` eingetragen, z. B. 2400 mm bei 3 Segmenten → je 800 mm. Enter oder Verlassen des Feldes uebernimmt den Wert, Esc verwirft ihn; Dezimal-Komma ist erlaubt. Beim Hinzufuegen, Duplizieren und Loeschen eines Segments bleibt die Nahtlaenge gleich und wird automatisch neu auf alle Segmente verteilt. Alle Aenderungen erscheinen im Change Log und lassen sich rueckgaengig machen.

Die eingegebene Nahtlaenge bleibt fest, auch wenn `segment_time` eines Segments von Hand geaendert wird. In diesem Fall gilt die gleichmaessige Aufteilung nicht mehr:

- Das geaenderte Segment wird als `manual` markiert und bleibt fest.
- Die uebrigen (nicht manuellen) Segmente teilen sich die Restlaenge gleichmaessig, z. B. 2400 mm, Segment 1 auf 1000 mm → Segment 2 und 3 je 700 mm. Wird danach Segment 2 auf 500 mm gesetzt, bleibt Segment 1 bei 1000 mm und Segment 3 erhaelt 900 mm.
- Sind alle anderen Segmente bereits manuell, werden sie wieder freigegeben und gleichen die Aenderung aus.
- Erreichen die festen Segmente die Nahtlaenge oder ueberschreiten sie sie, werden die anderen nicht angepasst; unter dem Feld erscheint eine Warnung.
- `Split evenly` stellt die gleichmaessige Aufteilung wieder her (ebenso eine neue Eingabe im Feld sowie Hinzufuegen, Duplizieren oder Loeschen).
- Manuelle Aenderung und Ausgleich bilden einen gemeinsamen Zurueck-Schritt.

Die Werte in der Segment-Tabelle sind direkt editierbar (Klick in die Zahl, Enter uebernimmt, Esc verwirft). Jede Eingabe wird in `segment_time` umgerechnet und wirkt wie eine manuelle Aenderung (Segment wird `manual`, die anderen gleichen aus):

- **Length (mm):** Laenge des Segments
- **Angle (°):** Laenge = Winkel / 360 × π × `layer_diameter`
- **Turns:** Laenge = Umdrehungen × π × `layer_diameter`
- **Weld time:** Laenge = Zeit × mittlerer Vorschub des Segments; Eingabe als `320`, `5:20`, `1:05:20` oder `5 min 20 s`. Nur bei zwei oder mehr Segmenten mit gueltigen Vorschub-/Dwell-Werten editierbar.
- **Total – Length:** entspricht dem Feld `Weld seam length` und verteilt gleichmaessig auf alle Segmente.

Bei nur einem Segment uebernimmt eine geaenderte Laenge direkt die Nahtlaenge.

Segmente werden im Editor ab 1 nummeriert (Segment 1, 2, …). Im XML bleibt das Attribut `index` wie von der Maschine erwartet bei 0 beginnend.

Die aktive Datei kann ausserdem umbenannt werden. Der Bereich `Segments` erlaubt das Bearbeiten, Duplizieren, Verschieben und Loeschen von Segmenten. Das geoeffnete Segment ist in der Liste hervorgehoben und bleibt nach Duplizieren, Verschieben, Undo/Redo und Bereichswechsel ausgewaehlt; nach dem Duplizieren ist die Kopie gewaehlt.

**Segment-Anordnung:** Ohne eigene Reihenfolge stehen die wichtigsten Segmentfelder in Gruppen untereinander:

- Spalte 1: `pri_amp`, `bkg_amp`, `pri_ahc`, `bkg_ahc`, `pri_travel`, `bkg_travel`
- Spalte 2: `pri_wire`, `bkg_wire`, `indwell`, `excursion`, `outdwell`, `tungsten_width`
- Spalte 3: `layer_diameter`, `segment_time`, `sync_mode`, `slope`, `osc_width`, `wire_manipulator_in_out_width`

Bei schmalem Fenster rueckt eine Gruppe unter die vorige, bleibt aber zusammen. Alle uebrigen Felder folgen darunter. Die Gruppen stehen in `segments_sorting.json` (`segmentColumns`) und sind eingebaut, falls die Datei nicht geladen werden kann. Wer die Felder per Ziehen selbst anordnet, bekommt diese Reihenfolge; `Reset order` stellt die Gruppenanordnung wieder her.

Aenderungen werden direkt im geladenen XML-DOM gespeichert. Die urspruengliche Datei auf der Festplatte bleibt bis zum Download unveraendert.

**Rohrgroesse:** Neben `outer_diameter` (Bereich `Description`) gibt es ein Auswahlfeld mit den Rohrgroessen G10 bis G38 (330, 381, 514, 565, 615, 666, 717, 768, 819, 920, 971, 1022 mm, wie im `batch_editor`). Die Auswahl schreibt den Durchmesser in Zoll (mm / 25,4, sechs Nachkommastellen) ins XML. Passt der aktuelle Wert zu einer Groesse (±0,5 mm), ist sie vorausgewaehlt, sonst steht dort `Custom`. Die Aenderung laesst sich rueckgaengig machen, wird wie andere Description-Werte auf markierte Dateien uebertragen und ist bei gesperrtem `outer_diameter` (🔒) deaktiviert.

Beim Wechsel des Heads werden die Jog-Parameter fuer `NGRT + H-HEAD` (auch `NGRT-Head`) oder `H2-FV-100S` automatisch auf die jeweiligen Standardwerte gesetzt. Andere Head-Namen veraendern diese Parameter nicht.

## XML Viewer

Unter `Tools > XML Viewer` wird die aktuell aktive Datei in einem separaten Browserfenster angezeigt.

Der Viewer zeigt:

- den aktuellen XML-Stand inklusive noch nicht gespeicherter Aenderungen;
- den Dateinamen der aktiven Datei;
- den XML-Inhalt schreibgeschuetzt;
- nach Auswahl eines XDR-Schemas (im Editor gespeichert oder aus der Schedule Database; das im Editor aktive ist vorausgewaehlt) fehlende erforderliche Elemente, Werte und Attribute als rote, rein visuelle Platzhalter an der passenden XML-Position.

**Aenderungen anzeigen:** Mit `Highlight changes since last save` (standardmaessig an) zeigt der Viewer farbig, was sich gegenueber dem zuletzt gespeicherten bzw. geladenen Stand der Datei geaendert hat. Das ist z. B. nach einem Version-Upgrade praktisch:

- **gruen `+`:** neu hinzugekommene Elemente, z. B. ergaenzte Felder oder neue Namen umbenannter Felder wie `pri_amp_max`.
- **rot `−`, durchgestrichen:** entfernte Elemente mit ihrem alten Wert, an ihrer frueheren Position, z. B. `ahc_retract` oder `amp_max`.
- **gelb `~`:** geaenderte Werte bzw. Attribute, dahinter der alte Wert (`was: …`), z. B. `config_version` 1.7.4.1 → 1.8.3.7.
- **Nicht markiert:** Elemente, die nur ihre Position gewechselt haben.

Ueber dem XML steht die Zusammenfassung (`+ n added · − n removed · ~ n changed`). `Changes only` blendet unveraenderte Werte aus, damit nur die Aenderungen und ihre Bereiche sichtbar bleiben. Nach dem Speichern gilt der gespeicherte Stand als neuer Vergleichsstand.

Die Schemas werden aus derselben IndexedDB-Datenbank wie die Schedule Database gelesen. Beide Seiten muessen dazu im selben Browserprofil und unter demselben Ursprung (zum Beispiel demselben lokalen Webserver und Port) geoeffnet sein. Wenn kein Schema gespeichert ist, laden Sie es zuerst in der Schedule Database und oeffnen den Viewer erneut. Die Platzhalter aendern weder das XML im Editor noch gespeicherte Dateien.

Wenn kein separates Fenster erscheint, muss der Popup-Blocker des Browsers fuer die HTML-Datei deaktiviert bzw. eine Ausnahme hinzugefuegt werden. Der Viewer aendert die XML-Datei nicht.

## Schema-Pruefung (XDR)

Jede geladene Datei wird automatisch gegen das **aktive XDR-Schema** geprueft – beim Laden, nach jeder Aenderung und nach Undo/Redo. Eingebaut ist `WELDSCHEDULE.XDR` in Version 1.8.3.7; sie steht auch ohne Webserver und offline zur Verfuegung.

Geprueft werden:

- fehlende Pflichtelemente (`minOccurs`) und zu haeufige Elemente (`maxOccurs`),
- unbekannte Elemente (das Schema ist geschlossen, `model="closed"`),
- die Reihenfolge der Elemente (`order="seq"`),
- Pflichtattribute wie `head` an `<sched>` oder `index` an `<segment>`,
- Datentypen von Werten und Attributen: `float` (Zahl), `int`, `ui1` (0–255), `ui2`, `ui4`, `boolean` (0 oder 1). Leere Zahlenfelder gelten als Warnung.

**Anzeige:**

- In der Dateiliste markiert ein rotes `! n` Dateien mit Schemafehlern; der Tooltip zeigt den ersten Fehler.
- Nach dem Laden nennt die Statuszeile die Anzahl abweichender Dateien.
- `Tools > Schema Check` zeigt je Datei den Status (`✓ Valid`, `! n errors`, `△ n warnings`), die Version der Datei im Vergleich zur Schema-Version und die Liste der Befunde mit Pfad. `Show` springt zum betroffenen Bereich bzw. Segment und hebt die Zeile kurz hervor.

**Speichern:** Hat eine zu speichernde Datei Schemafehler, fragt der Editor bei `Batch Save` (Herunterladen) nach (`Save anyway`, `Cancel` oder `Show details`). Warnungen allein loesen keine Rueckfrage aus.

**Versionskontrolle:** Die Version einer Datei wird aus `metadata/schema_version` gelesen, wenn gefuellt, sonst aus `metadata/config_version`, und mit der Version des aktiven Schemas (`xmlns:version` in der XDR) verglichen.

- `= schema ✓`: Die Versionen stimmen ueberein.
- `older than schema`: Die Datei stammt aus einer aelteren Version. Abweichungen sind dann zu erwarten; z. B. hat eine 1.8.3.5-Datei gegenueber 1.8.3.7 vier Unterschiede in `<global>`.
- `newer than schema – load a newer XDR`: Das geladene Schema ist aelter als die Datei.

Ist eine passende Version gespeichert, bietet `Use v…` an, sie zu aktivieren.

**Auf die neueste Version bringen (Upgrade):** Aeltere Schedules lassen sich direkt im Editor auf die Version des aktiven Schemas bringen, damit die Maschine sie ohne Fehlermeldung liest. Werden solche Dateien geladen, erscheint oben ein Hinweis („n file(s) do not match schema v… Upgrade them?“) mit `Review & upgrade…` (oeffnet den Upgrade-Dialog) und `Dismiss`. Geaendert wird erst nach Bestaetigung.

- `Tools > Schema Check` zeigt bei jeder Datei mit Schemafehlern oder aelterer Version `Upgrade to v…`.
- Oben gibt es `Upgrade all to v… (n)` fuer alle betroffenen Dateien.
- Ein Dialog zeigt vorher je Datei: Version alt → neu, Anzahl ergaenzter, entfernter und umbenannter Felder sowie das verwendete Muster.

Regeln (wie `_archiv/Schedule_Org/batch_editor1.6.py`: Layout von der neuesten Version, nicht die Werte):

1. **Werte bleiben erhalten:** Alle vorhandenen Felder behalten ihren Wert, auch gesperrte (🔒). Alle Segmente bleiben erhalten.
2. **Fehlende Pflichtfelder ergaenzen:** Sie werden mit dem Wert aus dem Layout-Muster ergaenzt. Das Muster richtet sich nach dem Head:
   - Head mit `NGRT` → `8888-layout new NGRT.xml`
   - sonst → `7777-layout new NG.xml`

   Beide sind eingebaut. Eigene Muster laedt man unter `Tools > Settings` (`Load template XML…`); sie werden ueber ihren Head zugeordnet.
3. **Umbenennungen:** `amp_max` → `pri_amp_max` und `bkg_amp_max`, `amp_rate` → `pri_amp_rate` und `bkg_amp_rate` (Wert wird uebernommen).
4. **Felder ohne Gegenstueck im Schema werden entfernt**, z. B. `ahc_retract`, `blast_time`, `mig_pulse_*`.
5. **Reihenfolge:** Die Felder werden in die Reihenfolge des Schemas gebracht. Der Python-Batch-Editor haengt neue Felder dagegen hinten an.
6. **Feste Werte:** `config_version` wird auf die Schema-Version gesetzt, `jog_speed_edit_mode` auf `1`.

Nach dem Upgrade:

- Die Dateien sind `Unsaved` und werden wie gewohnt gespeichert.
- Der Vorgang laesst sich mit Undo komplett zuruecknehmen und steht im Change Log.
- Unter `Last upgrade` listet der Editor alle ergaenzten, entfernten (mit altem Wert) und umbenannten Felder auf.

Geprueft mit `schedule_beispiel.xml` (1.7.4.1), `5555-layout old NG.xml` (1.8.3.3) und `Test 2 Segmente.xml` (1.8.3.5): Danach sind alle schema-konform, und ihr Aufbau entspricht genau den 1.8.3.7-Programmen in `04_HIC_PK_764_CS_NGRT_Rev1/`.

**Schema-Versionen verwalten:** Unter `Tools > Settings` (Bereich „XDR schema“):

- Liste aller gespeicherten Versionen mit Version, Dateiname und Ladedatum.
- `Use` aktiviert eine Version.
- `Delete` loescht eine geladene Version; die eingebaute laesst sich nicht loeschen.
- Neue Versionen werden ueber `Load XDR…` oder per Ablegen einer `.XDR`-Datei aufgenommen und sofort aktiviert. Eine bereits gespeicherte Version kann ersetzt werden.

Die Versionen und eigene Layout-Muster liegen im `localStorage` (`scheduleEditorXdrSchemas`, `scheduleEditorLayoutTemplates`) und sind im JSON-Backup enthalten.

## Speichern

### Save

`Save` (Strg+S) laedt **nichts herunter**. Gespeichert werden **alle geladenen Dateien mit Aenderungen**, nicht nur die aktive. Jede gespeicherte Datei bekommt im Change Log eine gruen hervorgehobene Zeile `Saved` mit der Anzahl ihrer Aenderungen seit dem letzten Speichern. Die einzelnen Feldaenderungen stehen wie bisher darunter.

Nach dem Speichern gilt der gespeicherte Stand als neue Vergleichsbasis:

- Die gruenen Markierungen verschwinden.
- `Revert` und der XML Viewer vergleichen ab jetzt mit diesem Stand.

Status einer Datei in der Dateiliste:

- `Unsaved`: Aenderungen seit dem letzten Speichern.
- `Saved ↓` (gelb): gespeichert, aber noch nicht heruntergeladen.
- `Saved`: heruntergeladen bzw. unveraendert seit dem Laden.

Die Kopfzeile zeigt z. B. `2 not downloaded`. Beim Schliessen des Tabs oder beim Entfernen einer Datei warnt der Editor, solange Aenderungen nicht heruntergeladen wurden.

Umbenennen geht ueber das Dateinamen-Feld oben in der Dateikarte. `Save As…` gibt es nicht mehr.

### Batch Save

**Einziger Weg zum Herunterladen.** Speichert und laedt die markierten Dateien herunter; im Change Log entsteht je Datei eine Zeile `Downloaded`. Danach stehen die Dateien auf `Saved`. Wenn keine Datei markiert ist, werden alle geladenen Dateien verwendet.

**Heat-Input-Pruefung beim Herunterladen:** Liegt der Heat Input eines Segments (Bereich Min – Max) ausserhalb der Grenzen, erscheint vor dem Download die Fehlermeldung „Heat input outside the limits“. Geprueft wird gegen:

- die Grenzen in der Datei (`heat_input_fault_low` / `heat_input_fault_high` in `<limits>`, sofern gesetzt, also groesser als 0 und kleiner als 9999),
- den Ziel-Bereich unter `Tools > Heat Input & WPS` (Reiter „Heat Input“) (Felder Min/Max, rote Linien).

Die Meldung nennt jedes betroffene Segment mit Wertebereich und der ueberschrittenen Grenze. Zur Wahl stehen `Cancel` (nichts wird heruntergeladen), `Show heat input` (oeffnet die Heat-Input-Ansicht) und `Save anyway`. Danach folgt gegebenenfalls noch die Schema-Rueckfrage.

Vor dem Speichern oeffnet sich ein Dialog fuer einen optionalen **Revisions-Tag** (z. B. `Rev1`). Der Tag wird an jeden Dateinamen angehaengt:

- `Naht_A.xml` + `Rev1` → `Naht_A_Rev1.xml`
- Ein vorhandenes Suffix `_Rev…` wird ersetzt: `Naht_A_Rev1.xml` + `Rev2` → `Naht_A_Rev2.xml` (gilt fuer Tags, die mit `Rev` beginnen; andere Tags werden nur angehaengt)
- Leerzeichen und in Dateinamen unzulaessige Zeichen (`\ / : * ? " < > |`) werden aus dem Tag entfernt
- Leeres Feld: Dateinamen bleiben unveraendert
- Die Dateien werden auch im Editor umbenannt; Zurueck (Strg+Z) stellt die alten Namen wieder her
- Der Dialog zeigt eine Vorschau der neuen Namen und schlaegt den zuletzt verwendeten Tag vor
- Ergeben zwei Dateien denselben Namen, wird das Speichern mit einer Meldung abgebrochen
- Checkbox `Download files` (standardmaessig an): Ist sie aus, werden die Dateien nur mit dem Tag umbenannt und nicht heruntergeladen; sie bleiben dann `Unsaved`

- Bei mehreren Dateien wird ein ZIP-Archiv erstellt.
- Bei nur einer Zieldatei wird eine einzelne XML-Datei heruntergeladen.

## Tools

- `Comparison`: Vergleicht die geladenen Dateien und kann Werte auf andere Dateien uebertragen. Nur die Tabelle scrollt (waagerecht und senkrecht); Kopfzeile sowie die Spalten Status und Parameter bleiben dabei stehen. `Show differences only` blendet gleiche Parameter aus; Zellen, die vom haeufigsten Wert der Zeile abweichen, sind rot markiert. Eine Zusammenfassung zeigt, wie viele Parameter sich unterscheiden.
- `Heat Input`: Zeigt nominalen Heat Input, Min und Max je aktivem Segment mit TIG-Wirkungsgrad η = 0,6 in kJ/mm. Grundwerte gelten waehrend `excursion`, Hauptwerte waehrend `indwell + outdwell`; Zeiten in Sekunden und IPM wird fuer die Wegberechnung in mm/s umgerechnet. Min/Max beruecksichtigen die in `<overrides>` angegebenen Grenzen als symmetrische ±%-Abweichungen: `avc_override_max` fuer beide Spannungen, `bkg_amp_max`/`pri_amp_max` fuer die Stroeme, `travel_max` fuer beide Vorschuebe, `dwell_max` fuer `indwell`/`outdwell` und `excursion_max` fuer `excursion`. Alle Grenzen werden gleichzeitig kombiniert; fehlende Werte gelten als 0%. `pulse_freq`, `pulse_width` und `*_rate` werden nicht zusaetzlich gewichtet. Alle geladenen XML-Dateien werden in **einem** Diagramm gezeigt: das Diagramm ist waagerecht angeordnet: Heat Input (kJ/mm) auf der x-Achse, je Segment eine Zeile, nach Datei gruppiert (Dateiname ueber der Gruppe). Ein waagerechter Balken zeigt die Bandbreite Min–Max, ein Punkt den Nominalwert. Jede Zeile ist mit Farbpunkt und Segmentname beschriftet; die Farben entsprechen dem Ring der Segment-Uebersicht. Die Hoehe waechst mit der Anzahl Segmente. Plausible Grenzwerte aus `<limits>` (`heat_input_fault_low`/`heat_input_fault_high` groesser 0 und kleiner 9999) erscheinen je Datei als senkrechte gestrichelte Linien ueber deren Gruppe; die Grenzwerte werden in kJ/mm angenommen. Ueberschreitungen sind rot umrandet und mit „! outside limit“ beschriftet. Die x-Achse hat ein Raster in 0,1-kJ/mm-Schritten (bei schmalem Fenster wird nur jeder zweite bzw. fuenfte Strich beschriftet).

**Target ranges (mehrere Ziel-Bereiche):** Ueber dem Diagramm lassen sich mit `+ Add target range` beliebig viele Ziel-Bereiche anlegen, z. B. „Hot pass“ 0,6–0,9 fuer 0402/0403, „Fill“ 1,0–1,3 fuer 0404–0407 und „Cap“ 0,55–0,75 fuer 0408/0409. Jeder Bereich hat:

- **Name, Min, Max** in kJ/mm. Enter oder Verlassen des Feldes uebernimmt den Wert, Dezimal-Komma ist erlaubt, ein leeres Feld laesst diese Grenze weg. Min muss kleiner als Max sein.
- **Dateizuordnung:** `All files` oder einzelne Dateien ueber ihre 4-stellige Nummer. Die Zuordnung bleibt gespeichert; zugeordnete, aber gerade nicht geladene Nummern bleiben gestrichelt sichtbar.
- `Remove` entfernt den Bereich.

Im Diagramm erscheinen die Bereiche als rote Linien nur ueber den zugeordneten Dateien, beschriftet mit Name und Wert. Geprueft wird jede Datei gegen alle ihr zugeordneten Bereiche:

- Liegt die Bandbreite eines Segments (Min–Max) unter einem Ziel-Min oder ueber einem Ziel-Max, wird das Segment rot umrandet und als „! outside target“ markiert. Der Tooltip der Statusspalte nennt den Bereich.
- Dateien ohne Bereich werden nur gegen die Grenzen aus der Datei geprueft.

Die Bereiche werden im Browser gespeichert und sind im Settings-Backup enthalten. Ein frueher gespeicherter einzelner Ziel-Bereich wird als „Target“ fuer alle Dateien uebernommen. Auch die Fehlermeldung beim Batch Save und die Programmuebersicht nennen den jeweiligen Bereich.

In Heat Input und Comparison werden Dateien mit ihrer Kurzbezeichnung angezeigt: den vier Ziffern am Anfang des Dateinamens (z. B. `0303` fuer `0303-HOT PASS 2 ….xml`). Der volle Name erscheint im Tooltip. Fehlen die vier Ziffern oder haben mehrere geladene Dateien dieselben, wird fuer diese der volle Name verwendet. Im Heat-Input-Diagramm steht die Kurzbezeichnung direkt in der Zeile (`0303 · Segment 1`), sodass keine eigene Kopfzeile je Datei noetig ist.

Sind mehrere Dateien geladen, kann jede Datei ueber eine Checkbox oberhalb des Diagramms ein- oder ausgeblendet werden; ausgeblendete Dateien fehlen in Diagramm und Tabelle. `Show all` blendet alle Dateien auf einmal ein, `Hide all` alle aus. Die Auswahl gilt nur fuer die laufende Sitzung. Hover zeigt die Werte, ein Klick oeffnet das Segment.

Darunter steht eine gemeinsame Tabelle: je Datei eine Kopfzeile mit Name und Grenzwerten, darunter je Segment Heat Input (fett), Bereich Min – Max, Mittelstrom, Vorschub und ein Status (`✓ within limits`, `! outside limit`, `disabled` oder `! not calculable` mit Grund im Tooltip). Ein Klick auf eine Zeile oeffnet das Segment.
- `Hidden Parameters`: Verwaltet ausgeblendete Parameter.
- `Change Log`: Zeigt protokollierte Aenderungen. Jedes `Saved` (bzw. `Downloaded`) laesst sich per Klick aufklappen und zeigt die einzelnen Aenderungen dieses Speicherns: `~ changed` mit altem und neuem Wert, `+ added` und `− removed` (z. B. nach einem Upgrade). Gespeicherte Feldaenderungen stehen nur noch dort; oben erscheinen ungespeicherte Aenderungen und die Speicher-Eintraege. `Clear log` loescht alle Eintraege nach Rueckfrage; mit Undo lassen sie sich wiederherstellen.
- `XML Viewer`: Oeffnet den schreibgeschuetzten XML-Inhalt der aktiven Datei.
- `Program Overview (PDF)`: Fragt zuerst nach dem **Nahtnamen** und **„Prepared by“** (Ersteller; erscheint oben rechts im Kopf, beide werden beim naechsten Mal vorgeschlagen). Der Nahtname wird als Ueberschrift und Fenstertitel – damit auch als PDF-Dateiname – verwendet; bleibt er leer, erscheint die Standard-Ueberschrift „Program overview“. Oeffnet dann eine Druckansicht (A4 quer), die alle geladenen Dateien zusammenfasst. Mit `Print / Save as PDF` wird daraus ueber den Druckdialog eine PDF-Datei („Als PDF speichern“). Die Seiten enthalten:
  1. eine Dateiliste mit Nummer, Name, Head, Anzahl Segmente, WPS-Lage, Heat-Input-Zielbereich, Schema-Status und Speicherstand. Die Version steht nur dabei, wenn sie sich unterscheidet; sonst steht sie im Kopf, zusammen mit der WPS-Nummer;
  2. die Hauptwerte der Segmente, je Datei und Segment eine Spalte.
     - Gruppiert nach Strom, Spannung, Vorschub, Draht, Pendeln und weiteren Werten (danach weitere mit ★ markierte Segmentwerte). Eine eigene, per Ziehen festgelegte Reihenfolge gilt hier nicht.
     - Zeilen, die in allen Dateien gleich sind, erscheinen grau, damit Unterschiede auffallen;
  3. die hervorgehobenen (★) Werte aus `Global`, nur wenn welche markiert sind;
  4. die Overrides in Prozent (`pri_amp_max`, `bkg_amp_max`, `avc_override_max`, `travel_max`, `dwell_max`, `excursion_max`, `wire_max`), 0 % grau;
  5. das Heat-Input-Diagramm (inklusive Ziel-Bereich und Grenzen) mit Tabelle (Nominal, Bereich mit Overrides, Zielbereich, Mittelstrom, Vorschub, Status).
  6. zum Schluss, falls eine WPS uebernommen ist: **WPS – ranges and check**
     - die WPS-Bereiche je Lage (Strom, Spannung, Vorschub, Draht, Heat Input) mit den zugeordneten Schedules;
     - die Pruefung wie im Editor (Puls/Grund getrennt, Status OK / Override / Outside).

  Seitenumbrueche: Jeder Abschnitt wird nach Moeglichkeit zusammen auf einer Seite gedruckt; Tabellen werden nicht zerschnitten (nur wenn eine Tabelle laenger als eine Seite ist, wird sie geteilt und der Tabellenkopf wiederholt).

  Welche Global-Werte und zusaetzlichen Segmentwerte erscheinen, steuert die Markierung mit ★; Einheiten werden wie im Editor eingestellt angezeigt. Bei vielen Dateien werden die Tabellen in Bloecke zu acht (Overrides: zehn) Spalten aufgeteilt.
- `Schema Check`: Prueft alle geladenen Dateien gegen das aktive XDR-Schema (siehe „Schema-Pruefung (XDR)“).
- `Settings` (frueher `Local Storage Backup`): Verwaltet die XDR-Schema-Versionen und exportiert die lokalen Editor-Einstellungen als JSON-Datei oder importiert ein zuvor erstelltes JSON-Backup. Beim Import wird bestaetigt, dass die aktuellen Editor-Einstellungen ersetzt werden; anschliessend wird die Seite neu geladen. Nicht zum Schedule Editor gehoerende Local-Storage-Eintraege bleiben unberuehrt.

## Auswahl und Verlauf

- `Select all` (Sidebar) markiert alle geladenen Dateien.
- `Clear` hebt die Auswahl auf.
- `Invert` kehrt die Auswahl um.
- Der Zurueck- und Wiederholen-Verlauf steht fuer Bearbeitungen zur Verfuegung (siehe Tastenkuerzel).
- `Revert` setzt alle geladenen Dateien auf den zuletzt gespeicherten (bzw. geladenen) Stand zurueck. Auch das laesst sich rueckgaengig machen.

Die Anzeige in der Kopfzeile nennt die Zahl ungespeicherter Dateien. Beim Schliessen des Browsers warnt der Editor, solange eine Datei ungespeichert ist.

## Lokale Einstellungen

Ausgeblendete, wichtige und gesperrte Parameter, die Parameter-Reihenfolge, die XDR-Schemas, eigene Head-Werte, Einheiten, Aenderungsprotokoll und Sidebar-Ausklappzustaende werden im `localStorage` des Browsers gespeichert. Diese Einstellungen sind browser- und profilbezogen. Beschaedigte Eintraege werden beim Start ignoriert und durch Standardwerte ersetzt. Das Aenderungsprotokoll (`Tools > Change Log`) bleibt ueber Sitzungen erhalten. Die XDR-Schema-Versionen liegen ebenfalls dort (`scheduleEditorXdrSchemas`, aktive Version in `scheduleEditorActiveXdr`). Mit `Tools > Settings` koennen diese Daten als JSON exportiert und spaeter wieder importiert werden.

Der Editor erwartet Schedule-XML-Dateien mit den bekannten Liburdi-Bereichen. Nicht passende oder fehlerhafte XML-Dateien werden beim Laden abgewiesen.

## Dateien

- `Lib_Schedule_Editor_v3_1.html`: Liburdi Schedule Suite 3.1 (Startseite, Schedule Editor, WDR Converter, Pendant Layout) in einer Datei; alle Bibliotheken eingebettet.
- `segments_sorting.json`: Reihenfolge der Segmentfelder (muss neben der HTML liegen).
- `README_v3_1.md`: Diese Anleitung.
- `data/samples/`: Beispiel-Schedules (`schedule_beispiel.xml`, `Test 2 Segmente.xml`), Referenzprogramme `04_HIC_PK_764_CS_NGRT_Rev1/` (1.8.3.7), Layout-Muster NG/NGRT (`layouts/`), Pendant-Beispiel `key_layout.xml`.
- `data/schema/WELDSCHEDULE.XDR`: Liburdi-Schema 1.8.3.7 (auch im Editor eingebaut).
- `data/wdr/`: Beispiel-Datalog (CSV), alte Excel-Vorlage und WPQ-Sammeltabelle als Referenz.
- `data/machine_backup/`: Sicherung der Maschinensoftware 1.8.3.87 (Datalogs mit Schedule-Snapshots, Schedules, XDR, XSL-Upgrades).
- `docs/`: Notizen, offene Punkte (`to_do`), Befunde zur Excel-Vorlage.
- `src/`, `build.js`: Quelltext der Suite in Modulen. Die HTML-Datei wird daraus erzeugt (siehe „Entwicklung“).
- `tests/`: Browser-Tests (`npm test`).
- Fruehere Versionen (v2 bis v2.9) und nicht mehr benoetigte Werkzeuge liegen in `/_archiv` (nur zum Nachschlagen).

## Entwicklung

Die Datei `Lib_Schedule_Editor_v3_1.html` wird **erzeugt** und nicht direkt bearbeitet. Quellen liegen in `src/`:
- `suite/`: Startseite und Umschaltung.
- `editor/`: Markup, CSS und 12 JS-Dateien nach Bereichen.
- `wdr/`: Auswertung, Excel-Writer und Oberflaeche.
- `pendant/`: Pendant Layout.
- `vendor/`: Bibliotheken.

Welche Datei fuer welches Thema zustaendig ist, steht in `src/MAP.md`. Jedes Modul hat eine kurze `README.md`.

Nach einer Aenderung im Ordner `Schedule_editor` ausfuehren:

```bash
node build.js            # erzeugt Lib_Schedule_Editor_v3_1.html
cd tests && npm test     # prueft zuerst, ob der Build aktuell ist, dann alle Browser-Tests
```

`build.js` braucht nur Node.js, keine weiteren Pakete. Das Ergebnis bleibt eine einzelne, offline lauffaehige Datei.
