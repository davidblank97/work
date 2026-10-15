# Schweißprogramm-Datenbank

## Start

Öffnen Sie [Programmdatenbank.html](./Programmdatenbank.html) in einem aktuellen Browser. Ein lokaler Server und eine Internetverbindung sind nicht erforderlich.

## Erste Verwendung

1. Unter **Schweißkopf-Schemas** eine XML-Vorlage pro Schweißkopf hinzufügen. Die Anwendung liest den Head-Namen aus dem `head`-Attribut des XML-Wurzelelements. Bei Bedarf kann dafür ein abweichender Name eingetragen werden.
2. Unter **Programme** für ein mehrteiliges Schedule den kompletten Ordner **Programmordner mit allen XML-Dateien hinzufügen** auswählen. Die XML-Dateien werden gemeinsam als ein Programm gespeichert; Unterordner und Dateinamen bleiben erhalten. Einzelne XML-Dateien können weiterhin über **XML-Programme hinzufügen** gespeichert werden.
3. Im Formular Programmname, Schweißkopf und Ringdurchmesser auswählen und **XML herunterladen** anklicken.

XML-Dateien oder ganze Programmordner können alternativ in den jeweiligen Drag-and-drop-Bereich unter **Programme** gezogen werden. Schema-XML-Dateien lassen sich im Drag-and-drop-Bereich unter **Schweißkopf-Schemas** ablegen.

Die beiden mitgelieferten Dateien `0403-Hotpass2.xml` und `0703-hot pass 2-Rev9.xml` können als Vorlagen für die jeweiligen Schemas hinzugefügt werden. Der NGRT-Kopf heißt `NGRT + H-HEAD`.

## Verhalten

- Programme und Schemas werden in IndexedDB des aktuellen Browsers gespeichert. Sie sind nur in diesem Browserprofil auf diesem Gerät verfügbar; Browserdaten löschen entfernt auch diese Daten.
- Die hochgeladenen XML-Dateien bleiben als Originale in der lokalen Datenbank erhalten. Beim Abrufen werden alle XML-Dateien des Programms separat angepasst und gemeinsam in einer ZIP-Datei heruntergeladen. Einzelne Programme bestehen ebenfalls aus einem ZIP mit einer XML-Datei.
- Eine gewählte Schema-Vorlage ergänzt fehlende XML-Elemente, entfernt Elemente, die nicht zur Vorlage gehören, und übernimmt die `config_version` der Vorlage, sofern beide Dateien sie enthalten.
- Das `head`-Attribut jeder erzeugten XML-Datei wird aus dem `head`-Attribut des ausgewählten Schema-Templates übernommen. NGRT-Varianten werden als `NGRT + H-HEAD` ausgegeben. Die XML-Ausgabe beginnt direkt mit `<sched>` ohne XML-Deklaration. Die Jog-Parameter erhalten die hinterlegten Werte für `NGRT + H-HEAD` und `H2-FV-100S`.
- Im Abrufformular werden die `config_version` des ausgewählten Programms und des gewählten Schema-Templates angezeigt. Wenn XML-Dateien eines Ordnerprogramms verschiedene Versionen haben, werden diese einzeln aufgeführt.
- Die Ringdurchmesser entsprechen der Zuordnung G10–G38 aus `Schedule_Org/batch_editor1.6.py`. Die Umrechnung verwendet mm / 25,4 und sechs Nachkommastellen.
- Der Layerdurchmesser ist optional. `0` oder ein leeres Feld verwendet den gewählten Ringdurchmesser; ein anderer Wert wird als mm interpretiert.
- Schemas und Programme können einzeln aus der lokalen Datenbank gelöscht werden. Gleichnamige Imports fragen vor dem Ersetzen nach.

## Hinweise

Die Anwendung kontrolliert beim Abruf, ob die erforderlichen XML-Elemente für die ausgewählten Jog-Werte und Durchmesser vorhanden sind. Fehlende Elemente oder ungültige XML-Dateien werden als Fehler angezeigt und nicht als erfolgreich herunterladbare Datei ausgegeben.
