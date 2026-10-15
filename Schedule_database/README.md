# Schweißprogramm-Datenbank

## Start

Öffnen Sie [Schedul_database_V1.1.html](./Schedul_database_V1.1.html) in einem aktuellen Browser. Ein lokaler Server und eine Internetverbindung sind nicht erforderlich.

## Erste Verwendung

1. Unter **XML Schema (XDR)** die Datei `WELDSCHEDULE.XDR` laden. Das XDR-Schema beschreibt und prüft die Struktur der Schedule-XML-Dateien; es ist keine XML-Vorlage für einen Schweißkopf.
2. Unter **Programs** für ein mehrteiliges Schedule den kompletten Ordner **Add a program folder with all XML files** auswählen. Die XML-Dateien werden gemeinsam als ein Programm gespeichert; Unterordner und Dateinamen bleiben erhalten. Einzelne XML-Dateien können in den Programm-Drag-and-drop-Bereich gezogen werden.
3. Im Formular Programm, XDR-Schema und Ringdurchmesser auswählen. Optional einen Schweißkopf wählen und separat **Apply Welding Head** anklicken; dadurch werden dessen `head`-Attribut und die hinterlegten Jog-Werte für den Download vorgemerkt. Danach **Download Program** anklicken.

Ganze Programmordner können alternativ in den Drag-and-drop-Bereich unter **Programs** gezogen werden. Einzelne XML-Dateien lassen sich dort ebenfalls ablegen. XDR-Dateien können in den Bereich **XML Schema (XDR)** abgelegt werden. Frühere XML-Kopfvorlagen werden in v1.1 nicht mehr als Schema verwendet; zuvor gespeicherte Programme bleiben im selben Browserprofil erhalten.

## Verhalten

- Programme und Schemas werden in IndexedDB des aktuellen Browsers gespeichert. Sie sind nur in diesem Browserprofil auf diesem Gerät verfügbar; Browserdaten löschen entfernt auch diese Daten.
- Die hochgeladenen XML-Dateien bleiben als Originale in der lokalen Datenbank erhalten. Beim Abrufen werden alle XML-Dateien des Programms separat angepasst und gemeinsam in einer ZIP-Datei heruntergeladen. Einzelne Programme bestehen ebenfalls aus einem ZIP mit einer XML-Datei.
- Das geladene XDR-Schema wird beim Abruf verwendet, um die Struktur, Reihenfolge, Vorkommen, Attribute und Datentypen jeder Programm-XML zu prüfen. Es ergänzt oder entfernt keine Elemente und überschreibt nicht die `config_version` des Programms.
- Die separate Schweißkopfauswahl kann `NGRT + H-HEAD` oder `H2-FV-100S` auf den Download anwenden. **Apply Welding Head** prüft zuerst, ob alle XML-Dateien die benötigten Jog-Elemente enthalten. Beim Download werden das `head`-Attribut und die hinterlegten Jog-Werte gesetzt. Ohne manuelle Auswahl bleibt das bisherige `head`-Attribut bestehen; erkannte NGRT-Varianten werden als `NGRT + H-HEAD` ausgegeben. Die Originale bleiben unverändert. Die XML-Ausgabe beginnt direkt mit `<sched>` ohne XML-Deklaration.
- Im Abrufformular werden die `config_version` des Programms und die Version des ausgewählten XDR-Schemas angezeigt. Der Schema-Name ist im Schema-Auswahlfeld sichtbar. Wenn XML-Dateien eines Ordnerprogramms verschiedene Versionen haben, werden diese einzeln aufgeführt.
- Die Ringdurchmesser entsprechen der Zuordnung G10–G38 aus `Schedule_Org/batch_editor1.6.py`. Die Umrechnung verwendet mm / 25,4 und sechs Nachkommastellen.
- Der Layerdurchmesser ist optional. `0` oder ein leeres Feld verwendet den gewählten Ringdurchmesser; ein anderer Wert wird als mm interpretiert.
- Schemas und Programme können einzeln aus der lokalen Datenbank gelöscht werden. Gleichnamige Imports fragen vor dem Ersetzen nach.

## Hinweise

Die Anwendung kontrolliert beim Abruf, ob jede Programmdatei dem geladenen XDR-Schema entspricht und die erforderlichen Elemente für Durchmesser und Jog-Werte vorhanden sind. Abweichende Strukturen, fehlende Elemente oder ungültige XML-Dateien werden als Fehler angezeigt und nicht als erfolgreich herunterladbare Datei ausgegeben.
