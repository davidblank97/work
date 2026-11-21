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

Die Oberflaeche des Editors ist englisch; diese Anleitung ist deutsch.

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

Beim Ueberfahren einer Parameterzeile erscheinen zwei Knoepfe: ★ markiert den Parameter als wichtig (wichtige Parameter stehen oben), ⊘ blendet ihn aus. Doppelklick bzw. Rechtsklick auf den Namen funktionieren weiterhin. Ausgeblendete Parameter werden unter `Tools > Hidden Parameters` wiederhergestellt.

Die Suche filtert die Tabellen nach Parametername und angezeigtem Wert und zeigt die Trefferzahl. Mit × oder Esc wird sie geleert.

Ueber die Einheiten-Taste neben einem Feld wird die Anzeige umgeschaltet (z. B. `in`/`mm` fuer Durchmesser, `cm/min` fuer Vorschub und Draht, Grad fuer `tungsten_width`). In der Datei bleibt der Wert immer in der XML-Einheit gespeichert.

Die aktive Datei kann ausserdem umbenannt werden. Der Bereich `Segments` erlaubt das Bearbeiten, Duplizieren, Verschieben und Loeschen von Segmenten. Das geoeffnete Segment ist in der Liste hervorgehoben und bleibt nach Duplizieren, Verschieben, Undo/Redo und Bereichswechsel ausgewaehlt; nach dem Duplizieren ist die Kopie gewaehlt.

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
- `Heat Input`: Zeigt nominalen Heat Input, Min und Max je aktivem Segment mit TIG-Wirkungsgrad η = 0,6 in kJ/mm. Grundwerte gelten waehrend `excursion`, Hauptwerte waehrend `indwell + outdwell`; Zeiten in Sekunden und IPM wird fuer die Wegberechnung in mm/s umgerechnet. Min/Max beruecksichtigen die in `<overrides>` angegebenen Grenzen als symmetrische ±%-Abweichungen: `avc_override_max` fuer beide Spannungen, `bkg_amp_max`/`pri_amp_max` fuer die Stroeme, `travel_max` fuer beide Vorschuebe, `dwell_max` fuer `indwell`/`outdwell` und `excursion_max` fuer `excursion`. Alle Grenzen werden gleichzeitig kombiniert; fehlende Werte gelten als 0%. `pulse_freq`, `pulse_width` und `*_rate` werden nicht zusaetzlich gewichtet.
- `Hidden Parameters`: Verwaltet ausgeblendete Parameter.
- `Change Log`: Zeigt protokollierte Aenderungen.
- `XML Viewer`: Oeffnet den schreibgeschuetzten XML-Inhalt der aktiven Datei.
- `Local Storage Backup`: Exportiert die lokalen Editor-Einstellungen als JSON-Datei oder importiert ein zuvor erstelltes JSON-Backup. Beim Import wird bestaetigt, dass die aktuellen Editor-Einstellungen ersetzt werden; anschliessend wird die Seite neu geladen. Nicht zum Schedule Editor gehoerende Local-Storage-Eintraege bleiben unberuehrt.

## Auswahl und Verlauf

- `Select all` (Sidebar) markiert alle geladenen Dateien.
- `Clear` hebt die Auswahl auf.
- `Invert` kehrt die Auswahl um.
- Der Zurueck- und Wiederholen-Verlauf steht fuer Bearbeitungen zur Verfuegung (siehe Tastenkuerzel).
- `Revert` setzt alle geladenen Dateien auf den zuletzt gespeicherten (bzw. geladenen) Stand zurueck. Auch das laesst sich rueckgaengig machen.

Die Anzeige in der Kopfzeile nennt die Zahl ungespeicherter Dateien. Beim Schliessen des Browsers warnt der Editor, solange eine Datei ungespeichert ist.

## Lokale Einstellungen

Ausgeblendete Parameter, wichtige Parameter, eigene Head-Werte, Einheiten, Aenderungsprotokoll und Sidebar-Ausklappzustaende werden im `localStorage` des Browsers gespeichert. Diese Einstellungen sind browser- und profilbezogen. Beschaedigte Eintraege werden beim Start ignoriert und durch Standardwerte ersetzt. Das Aenderungsprotokoll (`Tools > Change Log`) bleibt ueber Sitzungen erhalten. Mit `Tools > Local Storage Backup` koennen diese Daten als JSON exportiert und spaeter wieder importiert werden.

Der Editor erwartet Schedule-XML-Dateien mit den bekannten Liburdi-Bereichen. Nicht passende oder fehlerhafte XML-Dateien werden beim Laden abgewiesen.

## Dateien

- `Lib_Schedule_Editor_v2_9.html`: Editor-Anwendung (HTML, CSS, JavaScript und JSZip in einer Datei)
- `segments_sorting.json`: Reihenfolge der Segmentfelder
- `README_v2_9.md`: Diese Anleitung
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: Beispiel-Schedules zum Testen
