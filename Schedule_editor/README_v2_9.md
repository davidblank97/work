# Liburdi Schedule Editor v2.9

Browserbasierter Editor fuer Liburdi-Schedule-XML-Dateien.

## Start

`Lib_Schedule_Editor_v2_9.html` direkt in einem aktuellen Browser oeffnen. Die Datei ist eigenstaendig: CSS, JavaScript und die ZIP-Bibliothek JSZip sind eingebettet, eine Internetverbindung ist nicht noetig.

Empfohlen wird der Start ueber einen lokalen Webserver, damit `segments_sorting.json` geladen wird und der XML Viewer auf die Schemas der Schedule Database zugreifen kann:

```bash
cd Schedule_editor
python3 -m http.server 8000
```

Danach `http://localhost:8000/Lib_Schedule_Editor_v2_9.html` oeffnen.

## XML-Dateien laden

1. Eine oder mehrere `.xml`-Dateien ueber die Dateiauswahl laden.
2. Alternativ XML-Dateien in den Bereich `Drop XML files here` ziehen.
3. Eine Datei in der linken Dateiliste anklicken, um sie als aktive Datei auszuwaehlen.
4. Mehrere Dateien koennen ueber die Kontrollkaestchen fuer Batch-Aktionen markiert werden.

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

Ist die aktive Datei markiert, werden Aenderungen in `Description`, `Global`, `Limits` und `Overrides` auch in alle anderen markierten Dateien uebernommen. Diese Aenderungen erscheinen im Change Log, in der Save-Notiz und lassen sich gemeinsam rueckgaengig machen. Segmentwerte gelten immer nur fuer die aktive Datei.

Ueber die Einheiten-Taste neben einem Feld wird die Anzeige umgeschaltet (z. B. `in`/`mm` fuer Durchmesser, `cm/min` fuer Vorschub und Draht, Grad fuer `tungsten_width`). In der Datei bleibt der Wert immer in der XML-Einheit gespeichert.

Die aktive Datei kann ausserdem umbenannt werden. Der Bereich `Segments` erlaubt das Bearbeiten, Duplizieren, Verschieben und Loeschen von Segmenten.

Die Reihenfolge der hervorgehobenen Segmentfelder wird ueber `segments_sorting.json` (im selben Ordner) gesteuert. Die Feldnamen in `segmentPriorityOrder` koennen dort umsortiert werden; alle nicht aufgefuehrten Felder erscheinen danach. Die Datei wird nur geladen, wenn der Editor ueber einen Webserver laeuft. Beim direkten Oeffnen der HTML-Datei oder bei einer fehlerhaften JSON-Datei verwendet der Editor seine eingebaute Standardreihenfolge.

Aenderungen werden direkt im geladenen XML-DOM gespeichert. Die urspruengliche Datei auf der Festplatte bleibt bis zum Download unveraendert.

Beim Wechsel des Heads werden die Jog-Parameter fuer `NGRT + H-HEAD` (auch `NGRT-Head`) oder `H2-FV-100S` automatisch auf die jeweiligen Standardwerte gesetzt. Andere Head-Namen veraendern diese Parameter nicht.

## XML Viewer

Unter `Tools > XML Viewer` wird die aktuell aktive Datei in einem separaten Browserfenster angezeigt.

Der Viewer zeigt:

- den aktuellen XML-Stand inklusive noch nicht gespeicherter Aenderungen;
- den Dateinamen der aktiven Datei;
- den XML-Inhalt schreibgeschuetzt;
- nach Auswahl eines in der Schedule Database gespeicherten XDR-Schemas fehlende erforderliche Elemente, Werte und Attribute als rote, rein visuelle Platzhalter an der passenden XML-Position.

Die Schemas werden aus derselben IndexedDB-Datenbank wie die Schedule Database gelesen. Beide Seiten muessen dazu im selben Browserprofil und unter demselben Ursprung (zum Beispiel demselben lokalen Webserver und Port) geoeffnet sein. Wenn kein Schema gespeichert ist, laden Sie es zuerst in der Schedule Database und oeffnen den Viewer erneut. Die Platzhalter aendern weder das XML im Editor noch gespeicherte Dateien.

Wenn kein separates Fenster erscheint, muss der Popup-Blocker des Browsers fuer die HTML-Datei deaktiviert bzw. eine Ausnahme hinzugefuegt werden. Der Viewer aendert die XML-Datei nicht.

## Speichern

### Save

Speichert die aktive Datei als XML-Datei mit ihrem aktuellen Namen. Vor dem Speichern koennen optionale Informationen fuer die XML-Notiz eingegeben werden:

- Author
- WPS Number
- Note
- Use notes on save

Nur wenn `Use notes on save` aktiviert ist, wird `<note>` in `<description>` ersetzt: durch Author, WPS, die in dieser Sitzung protokollierten Aenderungen der Datei und die Notiz. Ist die Option aus, bleibt eine vorhandene Notiz unveraendert. In der Notiz bleiben nur Buchstaben, Ziffern und Leerzeichen erhalten (maximal 500 Zeichen); Punkte, Unterstriche und andere Sonderzeichen werden entfernt.

### Save As...

Speichert die aktive Datei unter einem neuen Dateinamen.

### Batch Save

Speichert die markierten Dateien. Wenn keine Datei markiert ist, werden alle geladenen Dateien verwendet.

- Bei mehreren Dateien wird ein ZIP-Archiv erstellt.
- Das Archiv enthaelt zusaetzlich `batch_change_log.txt` mit den in dieser Sitzung protokollierten Aenderungen der gespeicherten Dateien.
- Bei nur einer Zieldatei wird eine einzelne XML-Datei heruntergeladen.

## Tools

- `Comparison`: Vergleicht die geladenen Dateien und kann Werte auf andere Dateien uebertragen.
- `Unit Converter`: Rechnet IPM und cm/min um.
- `Heat Input`: Zeigt nominalen Heat Input, Min und Max je aktivem Segment mit TIG-Wirkungsgrad η = 0,6 in kJ/mm. Grundwerte gelten waehrend `excursion`, Hauptwerte waehrend `indwell + outdwell`; Zeiten in Sekunden und IPM wird fuer die Wegberechnung in mm/s umgerechnet. Min/Max beruecksichtigen die in `<overrides>` angegebenen Grenzen als symmetrische ±%-Abweichungen: `avc_override_max` fuer beide Spannungen, `bkg_amp_max`/`pri_amp_max` fuer die Stroeme, `travel_max` fuer beide Vorschuebe, `dwell_max` fuer `indwell`/`outdwell` und `excursion_max` fuer `excursion`. Alle Grenzen werden gleichzeitig kombiniert; fehlende Werte gelten als 0%. `pulse_freq`, `pulse_width` und `*_rate` werden nicht zusaetzlich gewichtet.
- `Hidden Parameters`: Verwaltet ausgeblendete Parameter.
- `Change Log`: Zeigt protokollierte Aenderungen.
- `XML Viewer`: Oeffnet den schreibgeschuetzten XML-Inhalt der aktiven Datei.
- `Local Storage Backup`: Exportiert die lokalen Editor-Einstellungen als JSON-Datei oder importiert ein zuvor erstelltes JSON-Backup. Beim Import wird bestaetigt, dass die aktuellen Editor-Einstellungen ersetzt werden; anschliessend wird die Seite neu geladen. Nicht zum Schedule Editor gehoerende Local-Storage-Eintraege bleiben unberuehrt.

## Auswahl und Verlauf

- `Select all` markiert alle geladenen Dateien.
- `Clear selection` hebt die Auswahl auf.
- `Invert selection` kehrt die Auswahl um.
- Der Zurueck- und Wiederholen-Verlauf steht fuer Bearbeitungen zur Verfuegung (Strg+Z, Strg+Y bzw. Strg+Umschalt+Z). Steht der Cursor in einem Eingabefeld, gilt dort das normale Rueckgaengig des Browsers.
- `Restore Original Values` stellt die zuletzt geladene Originalversion der Dateien wieder her.

Beim Schliessen des Browsers warnt der Editor, wenn eine geladene Datei vom zuletzt geladenen Stand abweicht.

## Lokale Einstellungen

Ausgeblendete Parameter, wichtige Parameter, eigene Head-Werte, Einheiten, Aenderungsprotokoll und Sidebar-Ausklappzustaende werden im `localStorage` des Browsers gespeichert. Diese Einstellungen sind browser- und profilbezogen. Beschaedigte Eintraege werden beim Start ignoriert und durch Standardwerte ersetzt. Das Aenderungsprotokoll bleibt ueber Sitzungen erhalten; in Save-Notiz und Batch-Log fliessen aber nur Aenderungen der aktuell geladenen Dateien ein. Mit `Tools > Local Storage Backup` koennen diese Daten als JSON exportiert und spaeter wieder importiert werden.

Der Editor erwartet Schedule-XML-Dateien mit den bekannten Liburdi-Bereichen. Nicht passende oder fehlerhafte XML-Dateien werden beim Laden abgewiesen.

## Dateien

- `Lib_Schedule_Editor_v2_9.html`: Editor-Anwendung (HTML, CSS, JavaScript und JSZip in einer Datei)
- `segments_sorting.json`: Reihenfolge der Segmentfelder
- `README_v2_9.md`: Diese Anleitung
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: Beispiel-Schedules zum Testen
