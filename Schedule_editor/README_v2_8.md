# Liburdi Schedule Editor v2.8

Browserbasierter Editor fuer Liburdi-Schedule-XML-Dateien.

## Start

Die Datei `Lib_Schedule_Editor_v2_8.html` direkt in einem aktuellen Browser oeffnen. Es ist kein lokaler Server und keine Installation erforderlich.

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

## XML Viewer

Unter `Tools > XML Viewer` wird die aktuell aktive Datei in einem separaten Browserfenster angezeigt.

Der Viewer zeigt:

- den aktuellen XML-Stand inklusive noch nicht gespeicherter Aenderungen;
- den Dateinamen der aktiven Datei;
- den XML-Inhalt als schreibgeschuetzten Text.

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
- `Hidden Parameters`: Verwaltet ausgeblendete Parameter.
- `Change Log`: Zeigt protokollierte Aenderungen.
- `XML Viewer`: Oeffnet den schreibgeschuetzten XML-Inhalt der aktiven Datei.

## Auswahl und Verlauf

- `Select all` markiert alle geladenen Dateien.
- `Clear selection` hebt die Auswahl auf.
- `Invert selection` kehrt die Auswahl um.
- Der Zurueck- und Wiederholen-Verlauf steht fuer Bearbeitungen zur Verfuegung.
- `Restore Original Values` stellt die zuletzt geladene Originalversion der Dateien wieder her.

Beim Schliessen des Browsers warnt der Editor, wenn noch Aenderungen vorhanden sind.

## Lokale Einstellungen

Ausgeblendete Parameter, wichtige Parameter, eigene Head-Werte, Einheiten und die Sidebar-Ausklappzustaende werden im `localStorage` des Browsers gespeichert. Diese Einstellungen sind browser- und profilbezogen.

Der Editor erwartet Schedule-XML-Dateien mit den bekannten Liburdi-Bereichen. Nicht passende oder fehlerhafte XML-Dateien werden beim Laden abgewiesen.

## Dateien

- `Lib_Schedule_Editor_v2_8.html`: Editor-Anwendung
- `README_v2_8.md`: Diese Anleitung
