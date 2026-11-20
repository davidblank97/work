# Liburdi Schedule Editor v2.9

Browserbasierter Editor fuer Liburdi-Schedule-XML-Dateien.

## Start

Die gemeinsame Startseite [`../index.html`](../index.html) oeffnen und **Schedule Editor** waehlen, oder `Lib_Schedule_Editor_v2_9.html` direkt in einem aktuellen Browser oeffnen. CSS und JavaScript liegen separat in `styles.css` und `app.js`. Ein lokaler oder gehosteter Webserver wird fuer den regulaeren Betrieb empfohlen.

Fuer die ZIP-Funktion beim Batch-Speichern wird die Bibliothek JSZip von einem CDN geladen. Dafuer ist beim Start eine Internetverbindung erforderlich.

## XML-Dateien laden

1. Eine oder mehrere `.xml`-Dateien ueber die Dateiauswahl laden.
2. Alternativ XML-Dateien in den Bereich `Drop XML files here` ziehen.
3. Eine Datei in der linken Dateiliste anklicken, um sie als aktive Datei auszuwaehlen.
4. Mehrere Dateien koennen ueber die Kontrollkaestchen fuer Batch-Aktionen markiert werden.

Die Dateien werden im Browser geladen und dort bearbeitet. Es wird keine Datei automatisch auf einen Server hochgeladen.

## Bearbeiten

Die XML-Daten sind in folgende Bereiche gegliedert:

- `Description`
- `Global`
- `Limits`
- `Overrides`
- `Segments`

Werte koennen direkt in den Eingabefeldern geaendert werden. Die aktive Datei kann ausserdem umbenannt werden. Der Bereich `Segments` erlaubt das Bearbeiten, Duplizieren, Verschieben und Loeschen von Segmenten.

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

### Save As...

Speichert die aktive Datei unter einem neuen Dateinamen.

### Batch Save

Speichert die markierten Dateien. Wenn keine Datei markiert ist, werden alle geladenen Dateien verwendet.

- Bei mehreren Dateien wird ein ZIP-Archiv erstellt.
- Das Archiv enthaelt zusaetzlich `batch_change_log.txt`.
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
- Der Zurueck- und Wiederholen-Verlauf steht fuer Bearbeitungen zur Verfuegung.
- `Restore Original Values` stellt die zuletzt geladene Originalversion der Dateien wieder her.

Beim Schliessen des Browsers warnt der Editor, wenn noch Aenderungen vorhanden sind.

## Lokale Einstellungen

Ausgeblendete Parameter, wichtige Parameter, eigene Head-Werte, Einheiten, Aenderungsprotokoll und Sidebar-Ausklappzustaende werden im `localStorage` des Browsers gespeichert. Diese Einstellungen sind browser- und profilbezogen. Mit `Tools > Local Storage Backup` koennen diese Daten als JSON exportiert und spaeter wieder importiert werden.

Der Editor erwartet Schedule-XML-Dateien mit den bekannten Liburdi-Bereichen. Nicht passende oder fehlerhafte XML-Dateien werden beim Laden abgewiesen.

## Dateien

- `Lib_Schedule_Editor_v2_9.html`: Editor-Anwendung
- `styles.css`: Styles der Editor-Anwendung
- `app.js`: JavaScript der Editor-Anwendung
- `README_v2_9.md`: Diese Anleitung
