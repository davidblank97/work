# Liburdi Schedule Suite v3.0

Version 3.0 fasst den **Schedule Editor** und den **WDR Converter** (Welddata Converter) in einer Datei zusammen: `Lib_Schedule_Editor_v3_0.html`.

## Start

`Lib_Schedule_Editor_v3_0.html` in einem aktuellen Browser oeffnen. Es erscheint eine **Startseite** mit zwei Karten:

- **Schedule Editor:** Liburdi-Schedule-XML-Dateien bearbeiten, vergleichen und speichern (Beschreibung ab „Aufbau der Oberflaeche“).
- **WDR Converter:** Schweissdaten-Aufzeichnungen (CSV/XML) in Excel-Dateien (.xlsx) umwandeln. Chrome/Edge fragen beim Start nach einem Zielordner und schreiben die Dateien direkt dorthin; andere Browser laden ein ZIP herunter. XML-Dateien werden unveraendert kopiert.

Nach der Auswahl wird die Anwendung geoeffnet. Oben erscheint eine schmale Leiste:

- `⌂ Start` fuehrt zur Startseite zurueck.
- `Schedule Editor` / `WDR Converter` wechseln direkt zwischen den Anwendungen.

Einmal geoeffnete Anwendungen laufen weiter: Geladene XML-Dateien, Undo-Verlauf und Auswahl bleiben beim Wechsel erhalten, auf der Startseite sind sie mit `Open` markiert. Erst beim Schliessen oder Neuladen des Browser-Tabs gehen sie verloren (der Editor warnt bei ungespeicherten Aenderungen). Die Adresse merkt sich die gewaehlte Anwendung (`…v3_0.html#editor` bzw. `#wdr`); solche Links und die Zurueck-Taste des Browsers funktionieren.

Der Schedule Editor ist eigenstaendig (CSS, JavaScript und JSZip eingebettet) und braucht kein Internet. Der WDR Converter laedt seine Bibliotheken (SheetJS, JSZip, FileSaver) aus dem Internet und braucht daher eine Verbindung.

Empfohlen wird der Start ueber einen lokalen Webserver, damit `segments_sorting.json` geladen wird und der XML Viewer auf die Schemas der Schedule Database zugreifen kann:

```bash
cd /workspaces/work
python3 -m http.server 8000
```

Danach `http://localhost:8000/Schedule_editor/Lib_Schedule_Editor_v3_0.html` oeffnen.

Die Oberflaeche ist englisch; diese Anleitung ist deutsch.

**Aufbau der Datei:** Startseite und Umschaltung stehen am Anfang und Ende der Datei. Die beiden Anwendungen liegen unveraendert in `<template id="app-editor">` bzw. `<template id="app-wdr">` und werden beim Oeffnen jeweils als eigenes Dokument (iframe) gestartet, damit sich CSS und JavaScript nicht gegenseitig stoeren. Aenderungen am Editor oder Converter werden direkt im jeweiligen Template vorgenommen. Einstellungen im `localStorage` (ausgeblendete/gesperrte Parameter, Reihenfolge usw.) sind dieselben wie bei der Einzeldatei, solange sie ueber dieselbe Adresse geoeffnet wird.

## Aufbau der Oberflaeche

- **Kopfzeile links:** `Open XML…`, Zurueck (↩), Wiederholen (↪), Hilfe (?)
- **Kopfzeile Mitte:** Suche mit Trefferzahl
- **Kopfzeile rechts:** Anzeige ungespeicherter Dateien, `Revert`, `Save`, `Save As…`, `Batch Save`
- **Sidebar:** Dateiliste mit `Select all` / `Clear` / `Invert`, Bereiche (`Description` … `Segments`) und Tools

## Tastenkuerzel

| Kuerzel | Funktion |
|---|---|
| Strg+S | Aktive Datei speichern |
| Strg+Umschalt+S | Save As |
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

Die XML-Daten sind in folgende Bereiche gegliedert:

- `Description`
- `Global`
- `Limits`
- `Overrides`
- `Segments`

Werte koennen direkt in den Eingabefeldern geaendert werden. Dezimalzahlen duerfen mit Punkt oder Komma eingegeben werden (`12,5` = `12.5`); Eingaben wie `12abc` werden nicht uebernommen. Gespeichert wird immer mit der Anzahl Nachkommastellen, die der Wert in der Datei hat. Wird dabei gerundet, erscheint ein Hinweis in der Statusleiste.

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

Die Standardreihenfolge der Segmentfelder (solange keine eigene Reihenfolge per Drag & Drop gespeichert ist) wird ueber `segments_sorting.json` (im selben Ordner) gesteuert. Die Feldnamen in `segmentPriorityOrder` koennen dort umsortiert werden; alle nicht aufgefuehrten Felder erscheinen danach. Die Datei wird nur geladen, wenn der Editor ueber einen Webserver laeuft. Beim direkten Oeffnen der HTML-Datei oder bei einer fehlerhaften JSON-Datei verwendet der Editor seine eingebaute Standardreihenfolge.

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

**Speichern:** Hat eine zu speichernde Datei Schemafehler, fragt der Editor bei `Save`, `Save As…` und `Batch Save` nach (`Save anyway`, `Cancel` oder `Show details`). Warnungen allein loesen keine Rueckfrage aus.

**Versionskontrolle:** Die Version einer Datei wird aus `metadata/schema_version` gelesen, wenn gefuellt, sonst aus `metadata/config_version`, und mit der Version des aktiven Schemas (`xmlns:version` in der XDR) verglichen.

- `= schema ✓`: Die Versionen stimmen ueberein.
- `older than schema`: Die Datei stammt aus einer aelteren Version. Abweichungen sind dann zu erwarten; z. B. hat eine 1.8.3.5-Datei gegenueber 1.8.3.7 vier Unterschiede in `<global>`.
- `newer than schema – load a newer XDR`: Das geladene Schema ist aelter als die Datei.

Ist eine passende Version gespeichert, bietet `Use v…` an, sie zu aktivieren.

**Schema-Versionen verwalten:** Unter `Tools > Settings` (Bereich „XDR schema“):

- Liste aller gespeicherten Versionen mit Version, Dateiname und Ladedatum.
- `Use` aktiviert eine Version.
- `Delete` loescht eine geladene Version; die eingebaute laesst sich nicht loeschen.
- Neue Versionen werden ueber `Load XDR…` oder per Ablegen einer `.XDR`-Datei aufgenommen und sofort aktiviert. Eine bereits gespeicherte Version kann ersetzt werden.

Die Versionen liegen im `localStorage` und sind im JSON-Backup enthalten.

## Speichern

### Save

Speichert die aktive Datei sofort als XML-Datei mit ihrem aktuellen Namen (Strg+S). Es erscheint kein Dialog; die `<note>` in `<description>` bleibt unveraendert und kann bei Bedarf direkt im Bereich `Description` bearbeitet werden.

Nach dem Speichern gilt der gespeicherte Stand als neue Vergleichsbasis: Die Datei steht auf `Saved`, die gruenen Markierungen verschwinden, und `Revert` springt auf diesen Stand zurueck.

### Save As…

Fragt nur den neuen Dateinamen ab (Enter bestaetigt, Esc bricht ab) und speichert. Die Datei wird im Editor umbenannt, sodass ein spaeteres `Save` den neuen Namen verwendet.

### Batch Save

Speichert die markierten Dateien. Wenn keine Datei markiert ist, werden alle geladenen Dateien verwendet.

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

- `Comparison`: Vergleicht die geladenen Dateien und kann Werte auf andere Dateien uebertragen. `Show differences only` blendet gleiche Parameter aus; Zellen, die vom haeufigsten Wert der Zeile abweichen, sind rot markiert. Eine Zusammenfassung zeigt, wie viele Parameter sich unterscheiden.
- `Heat Input`: Zeigt nominalen Heat Input, Min und Max je aktivem Segment mit TIG-Wirkungsgrad η = 0,6 in kJ/mm. Grundwerte gelten waehrend `excursion`, Hauptwerte waehrend `indwell + outdwell`; Zeiten in Sekunden und IPM wird fuer die Wegberechnung in mm/s umgerechnet. Min/Max beruecksichtigen die in `<overrides>` angegebenen Grenzen als symmetrische ±%-Abweichungen: `avc_override_max` fuer beide Spannungen, `bkg_amp_max`/`pri_amp_max` fuer die Stroeme, `travel_max` fuer beide Vorschuebe, `dwell_max` fuer `indwell`/`outdwell` und `excursion_max` fuer `excursion`. Alle Grenzen werden gleichzeitig kombiniert; fehlende Werte gelten als 0%. `pulse_freq`, `pulse_width` und `*_rate` werden nicht zusaetzlich gewichtet. Alle geladenen XML-Dateien werden in **einem** Diagramm gezeigt: das Diagramm ist waagerecht angeordnet: Heat Input (kJ/mm) auf der x-Achse, je Segment eine Zeile, nach Datei gruppiert (Dateiname ueber der Gruppe). Ein waagerechter Balken zeigt die Bandbreite Min–Max, ein Punkt den Nominalwert. Jede Zeile ist mit Farbpunkt und Segmentname beschriftet; die Farben entsprechen dem Ring der Segment-Uebersicht. Die Hoehe waechst mit der Anzahl Segmente. Plausible Grenzwerte aus `<limits>` (`heat_input_fault_low`/`heat_input_fault_high` groesser 0 und kleiner 9999) erscheinen je Datei als senkrechte gestrichelte Linien ueber deren Gruppe; die Grenzwerte werden in kJ/mm angenommen. Ueberschreitungen sind rot umrandet und mit „! outside limit“ beschriftet. Die x-Achse hat ein Raster in 0,1-kJ/mm-Schritten (bei schmalem Fenster wird nur jeder zweite bzw. fuenfte Strich beschriftet).

Ueber dem Diagramm stehen zwei Felder **Min** und **Max** (Target range, kJ/mm). Eingetragene Werte erscheinen als durchgezogene rote Linien ueber das gesamte Diagramm. Enter oder Verlassen des Feldes uebernimmt den Wert, Dezimal-Komma ist erlaubt, ein leeres Feld entfernt die Linie, `Clear` entfernt beide. Min muss kleiner als Max sein. Die Werte werden im Browser gespeichert (auch im Settings) und gelten fuer alle Dateien. Der Ziel-Bereich wird auch geprueft: Liegt die Bandbreite eines Segments (Min–Max) unter dem Ziel-Min oder ueber dem Ziel-Max, wird es im Diagramm rot umrandet und mit „! outside target“ beschriftet; die Statusspalte zeigt dasselbe (bei gleichzeitiger Grenzwertverletzung „! outside limit · ! outside target“). Liegt alles innerhalb, steht dort „✓ OK“.

In Heat Input und Comparison werden Dateien mit ihrer Kurzbezeichnung angezeigt: den vier Ziffern am Anfang des Dateinamens (z. B. `0303` fuer `0303-HOT PASS 2 ….xml`). Der volle Name erscheint im Tooltip. Fehlen die vier Ziffern oder haben mehrere geladene Dateien dieselben, wird fuer diese der volle Name verwendet. Im Heat-Input-Diagramm steht die Kurzbezeichnung direkt in der Zeile (`0303 · Segment 1`), sodass keine eigene Kopfzeile je Datei noetig ist.

Sind mehrere Dateien geladen, kann jede Datei ueber eine Checkbox oberhalb des Diagramms ein- oder ausgeblendet werden; ausgeblendete Dateien fehlen in Diagramm und Tabelle. `Show all` blendet alle Dateien auf einmal ein, `Hide all` alle aus. Die Auswahl gilt nur fuer die laufende Sitzung. Hover zeigt die Werte, ein Klick oeffnet das Segment.

Darunter steht eine gemeinsame Tabelle: je Datei eine Kopfzeile mit Name und Grenzwerten, darunter je Segment Heat Input (fett), Bereich Min – Max, Mittelstrom, Vorschub und ein Status (`✓ within limits`, `! outside limit`, `disabled` oder `! not calculable` mit Grund im Tooltip). Ein Klick auf eine Zeile oeffnet das Segment.
- `Hidden Parameters`: Verwaltet ausgeblendete Parameter.
- `Change Log`: Zeigt protokollierte Aenderungen.
- `XML Viewer`: Oeffnet den schreibgeschuetzten XML-Inhalt der aktiven Datei.
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

- `Lib_Schedule_Editor_v2_9.html`: Editor-Anwendung (HTML, CSS, JavaScript und JSZip in einer Datei)
- `segments_sorting.json`: Reihenfolge der Segmentfelder
- `README_v2_9.md`: Diese Anleitung
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: Beispiel-Schedules zum Testen
