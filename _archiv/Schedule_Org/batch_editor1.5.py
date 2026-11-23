import os
import re
import sys
import logging
import traceback
from datetime import datetime

# Konstanten
TAG_OUTER_DIAMETER = "outer_diameter"
TAG_LAYER_DIAMETER = "layer_diameter"
XML_EXTENSION = ".xml"

# Rohrdurchmesser in mm
OUTER_DIAMETERS = {
    "G10": 330,
    "G12": 381,
    "G18": 514,
    "G20": 565,
    "G22": 615,
    "G24": 666,
    "G26": 717,
    "G28": 768,
    "G30": 819,
    "G34": 920,
    "G36": 971,
    "G38": 1022
}


def setup_logging(log_file):
    """Richtet das Logging mit Datei- und Konsolenausgabe ein."""
    logger = logging.getLogger("batch_editor")
    logger.setLevel(logging.INFO)

    # Datei-Handler
    file_handler = logging.FileHandler(log_file, mode="w", encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter("%(message)s"))

    # Konsolen-Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter("%(message)s"))

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    return logger


def get_source_folders(root_folder):
    """Sammelt alle Quellordner (alle Ordner außer den G-Zielordnern)."""
    source_folders = []
    for item in os.listdir(root_folder):
        full_path = os.path.join(root_folder, item)
        if not os.path.isdir(full_path):
            continue
        # G-Ordner überspringen
        if item.upper() in OUTER_DIAMETERS:
            continue
        source_folders.append(item)
    source_folders.sort()
    return source_folders


def replace_value(text, tag, new_value):
    """Ersetzt den Wert eines XML-Tags.

    Liefert (neuer_text, anzahl_ersetzungen).
    """
    pattern = re.compile(rf"(<{tag}>)([^<]*)(</{tag}>)")
    new_text, count = pattern.subn(
        lambda m: f"{m.group(1)}{new_value:.6f}{m.group(3)}",
        text
    )
    return new_text, count


def process_file(source_file, target_file, outer_inch, layer_inch, logger):
    """Verarbeitet eine einzelne XML-Datei. Liefert True bei Erfolg."""
    try:
        with open(source_file, "r", encoding="utf-8") as f:
            text = f.read()

        # outer_diameter: immer ersetzen
        text, count_outer = replace_value(text, TAG_OUTER_DIAMETER, outer_inch)

        # layer_diameter: mit dem abgefragten Wert ersetzen
        text, count_layer = replace_value(text, TAG_LAYER_DIAMETER, layer_inch)

        if count_outer == 0 and count_layer == 0:
            logger.warning(
                f"WARNUNG: Keine Treffer in {source_file} "
                f"(weder {TAG_OUTER_DIAMETER} noch {TAG_LAYER_DIAMETER} gefunden)"
            )

        with open(target_file, "w", encoding="utf-8") as f:
            f.write(text)

        return True

    except Exception:
        logger.error(f"FEHLER: {source_file}")
        logger.error(traceback.format_exc())
        return False


def main():
    print("\n==========================================")
    print(" XML Batch Editor")
    print(" outer_diameter = layer_diameter")
    print("==========================================\n")

    root_folder = input(
        "Pfad zum Hauptordner (z.B. Schedule_new): "
    ).strip()

    if not os.path.isdir(root_folder):
        print("\nFEHLER: Ordner nicht gefunden!")
        input("\nEnter zum Beenden...")
        sys.exit(1)

    # layer_diameter am Anfang abfragen (in mm)
    # Wenn 0 eingegeben wird, wird layer_diameter = outer_diameter
    # des jeweiligen G-Ordners gesetzt.
    layer_diameter_mm = input(
        "\nLayer-Diameter in mm (0 = Layer = Outer): "
    ).strip()

    try:
        layer_diameter_mm = float(layer_diameter_mm)
    except ValueError:
        print("\nFEHLER: Ungültige Eingabe für Layer-Diameter!")
        input("\nEnter zum Beenden...")
        sys.exit(1)

    log_file = os.path.join(root_folder, "batch_log.txt")
    logger = setup_logging(log_file)

    start_time = datetime.now()

    logger.info("=========================================")
    logger.info("XML Batch Editor")
    logger.info(f"Start: {start_time}")
    logger.info("=========================================")
    logger.info("")

    source_folders = get_source_folders(root_folder)

    logger.info(f"{len(source_folders)} Quellordner gefunden.")
    logger.info("")
    logger.info("Gefundene Quellordner:")
    for folder in source_folders:
        logger.info(f"  {folder}")
    logger.info("")

    processed_files = 0
    created_folders = 0
    error_files = 0

    # Für jeden G-Ordner
    for g_folder, outer_mm in OUTER_DIAMETERS.items():
        outer_inch = outer_mm / 25.4

        # layer_diameter bestimmen:
        # Wenn 0 eingegeben wurde -> Layer = Outer des jeweiligen G-Ordners
        # Sonst -> der eingegebene Wert (in mm -> inch)
        if layer_diameter_mm == 0:
            layer_inch = outer_inch
            layer_used_mm = outer_mm
        else:
            layer_inch = layer_diameter_mm / 25.4
            layer_used_mm = layer_diameter_mm

        logger.info(f"\n{g_folder}")
        logger.info("-" * 30)
        logger.info(
            f"Outer Diameter: {outer_mm} mm ({outer_inch:.6f} in)"
        )
        logger.info(
            f"Layer Diameter: {layer_used_mm} mm ({layer_inch:.6f} in)"
        )

        for source_name in source_folders:
            source_path = os.path.join(root_folder, source_name)
            target_path = os.path.join(root_folder, g_folder, source_name)

            # Nur XML-Dateien sammeln
            xml_files = [
                f for f in os.listdir(source_path)
                if f.lower().endswith(XML_EXTENSION)
            ]

            # Leere Quellordner überspringen (kein Zielordner anlegen)
            if not xml_files:
                logger.info(f"{source_name}: 0 XML-Dateien (übersprungen)")
                continue

            # Zielordner nur anlegen, wenn er noch nicht existiert
            if not os.path.isdir(target_path):
                os.makedirs(target_path, exist_ok=True)
                created_folders += 1

            xml_count = 0
            for file_name in xml_files:
                source_file = os.path.join(source_path, file_name)
                target_file = os.path.join(target_path, file_name)

                if process_file(
                    source_file, target_file, outer_inch, layer_inch, logger
                ):
                    xml_count += 1
                    processed_files += 1
                else:
                    error_files += 1

            logger.info(f"{source_name}: {xml_count} XML-Dateien")

    end_time = datetime.now()
    duration = end_time - start_time

    logger.info("")
    logger.info("=========================================")
    logger.info(f"Erstellte Ordner: {created_folders}")
    logger.info(f"Verarbeitete XML-Dateien: {processed_files}")
    logger.info(f"Dateien mit Fehlern: {error_files}")
    logger.info(f"Ende: {end_time}")
    logger.info(f"Dauer: {duration}")
    logger.info("=========================================")

    print("\n==========================================")
    print("FERTIG")
    print("==========================================")
    print(f"Verarbeitete XML-Dateien : {processed_files}")
    print(f"Dateien mit Fehlern      : {error_files}")
    print(f"Log-Datei                : {log_file}")
    print("==========================================")

    input("\nEnter zum Beenden...")


if __name__ == "__main__":
    main()