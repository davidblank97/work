import copy
import logging
import os
import sys
import traceback
import xml.etree.ElementTree as ET
from datetime import datetime

# Konstanten
TAG_OUTER_DIAMETER = "outer_diameter"
TAG_LAYER_DIAMETER = "layer_diameter"
TAG_CONFIG_VERSION = "config_version"
TAG_JOG_SPEED_EDIT_MODE = "jog_speed_edit_mode"
TAG_TRAVEL_JOG = "travel_jog"
TAG_AHC_RETRACT = "ahc_retract"
XML_EXTENSION = ".xml"
TEMPLATE_FOLDER_NAME = "Muster_schedules"

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
    logger = logging.getLogger("batch_editor_1_6")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()

    file_handler = logging.FileHandler(log_file, mode="w", encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter("%(message)s"))

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
        if item.upper() in OUTER_DIAMETERS:
            continue
        source_folders.append(item)
    source_folders.sort()
    return source_folders


def version_key(version):
    """Macht eine config_version numerisch vergleichbar."""
    try:
        return tuple(int(part) for part in version.split("."))
    except (AttributeError, ValueError):
        return ()


def find_latest_template(script_folder):
    """Lädt die XML-Vorlage mit der höchsten config_version."""
    template_folders = [
        os.path.abspath(os.path.join(script_folder, TEMPLATE_FOLDER_NAME)),
        os.path.abspath(os.path.join(script_folder, "..", "Code", TEMPLATE_FOLDER_NAME)),
        os.path.abspath(os.path.join(script_folder, "..", TEMPLATE_FOLDER_NAME)),
    ]
    candidates = []
    for template_folder in template_folders:
        if not os.path.isdir(template_folder):
            continue
        for file_name in os.listdir(template_folder):
            if not file_name.lower().endswith(XML_EXTENSION):
                continue
            file_path = os.path.join(template_folder, file_name)
            try:
                root = ET.parse(file_path).getroot()
                version_element = root.find("./metadata/" + TAG_CONFIG_VERSION)
                version = version_element.text.strip() if version_element is not None else ""
                candidates.append((version_key(version), file_path, root, version))
            except (OSError, ET.ParseError):
                continue

    if not candidates:
        raise FileNotFoundError(
            f"Keine gültige XML-Vorlage in {template_folders[0]} gefunden."
        )

    _, template_path, template_root, version = max(candidates, key=lambda item: item[0])
    return template_path, template_root, version


def merge_layout(source_element, template_element):
    """Ergänzt fehlende Vorlagelemente und behält vorhandene Quellwerte."""
    template_children = list(template_element)
    template_by_tag = {}
    for child in template_children:
        template_by_tag.setdefault(child.tag, []).append(child)

    source_occurrences = {}
    for child in list(source_element):
        occurrence = source_occurrences.get(child.tag, 0)
        source_occurrences[child.tag] = occurrence + 1
        matching_templates = template_by_tag.get(child.tag, [])
        if not matching_templates:
            continue

        # Wiederholte Bereiche wie segment verwenden die erste Vorlage
        # für jedes vorhandene Quellsegment.
        template_child = matching_templates[min(occurrence, len(matching_templates) - 1)]
        merge_layout(child, template_child)

    existing_counts = {}
    for child in list(source_element):
        existing_counts[child.tag] = existing_counts.get(child.tag, 0) + 1

    for template_child in template_children:
        count = existing_counts.get(template_child.tag, 0)
        template_count = sum(
            1 for child in template_children if child.tag == template_child.tag
        )
        if count < template_count:
            source_element.append(copy.deepcopy(template_child))
            existing_counts[template_child.tag] = count + 1


def set_element_value(root, tag, value):
    """Setzt den Text aller Elemente mit dem angegebenen Tag."""
    count = 0
    for element in root.iter(tag):
        element.text = value
        count += 1
    return count


def remove_elements(root, tag):
    """Entfernt alle Elemente mit dem angegebenen Tag aus dem XML-Baum."""
    count = 0
    for parent in root.iter():
        for child in list(parent):
            if child.tag == tag:
                parent.remove(child)
                count += 1
    return count


def prune_layout(source_element, template_element):
    """Entfernt Elemente, die in der Referenzstruktur nicht vorkommen."""
    template_children = list(template_element)
    template_by_tag = {}
    for child in template_children:
        template_by_tag.setdefault(child.tag, []).append(child)

    removed = 0
    source_occurrences = {}
    for child in list(source_element):
        matching_templates = template_by_tag.get(child.tag)
        if not matching_templates:
            source_element.remove(child)
            removed += 1
            continue

        occurrence = source_occurrences.get(child.tag, 0)
        source_occurrences[child.tag] = occurrence + 1
        template_child = matching_templates[
            min(occurrence, len(matching_templates) - 1)
        ]
        removed += prune_layout(child, template_child)

    return removed


def prepare_xml(source_file, template_root, outer_inch, layer_inch):
    """Migriert Layout und Werte einer XML-Datei für die neue Softwareversion."""
    source_root = ET.parse(source_file).getroot()
    merge_layout(source_root, template_root)
    prune_layout(source_root, template_root)
    remove_elements(source_root, TAG_AHC_RETRACT)

    config_version = template_root.find("./metadata/" + TAG_CONFIG_VERSION)
    source_config_version = source_root.find("./metadata/" + TAG_CONFIG_VERSION)
    if config_version is not None and source_config_version is not None:
        source_config_version.text = config_version.text

    set_element_value(source_root, TAG_JOG_SPEED_EDIT_MODE, "1")
    set_element_value(source_root, TAG_TRAVEL_JOG, "19.98")
    set_element_value(source_root, TAG_OUTER_DIAMETER, f"{outer_inch:.6f}")
    set_element_value(source_root, TAG_LAYER_DIAMETER, f"{layer_inch:.6f}")
    return source_root


def process_file(source_file, target_file, template_root, outer_inch, layer_inch, logger):
    """Verarbeitet eine einzelne XML-Datei. Liefert True bei Erfolg."""
    try:
        root = prepare_xml(source_file, template_root, outer_inch, layer_inch)
        ET.indent(root, space="\t")
        ET.ElementTree(root).write(target_file, encoding="utf-8")
        return True
    except Exception:
        logger.error(f"FEHLER: {source_file}")
        logger.error(traceback.format_exc())
        return False


def main():
    print("\n==========================================")
    print(" XML Batch Editor 1.6")
    print(" Layout-Migration auf die neueste config_version")
    print("==========================================\n")

    root_folder = input(
        "Pfad zum Hauptordner (z.B. Schedule_new): "
    ).strip()

    if not os.path.isdir(root_folder):
        print("\nFEHLER: Ordner nicht gefunden!")
        input("\nEnter zum Beenden...")
        sys.exit(1)

    layer_diameter_mm = input(
        "\nLayer-Diameter in mm (0 = Layer = Outer): "
    ).strip()

    try:
        layer_diameter_mm = float(layer_diameter_mm)
        script_folder = os.path.dirname(os.path.abspath(__file__))
        template_path, template_root, config_version = find_latest_template(script_folder)
    except (ValueError, FileNotFoundError) as error:
        print(f"\nFEHLER: {error}")
        input("\nEnter zum Beenden...")
        sys.exit(1)

    log_file = os.path.join(root_folder, "batch_log.txt")
    logger = setup_logging(log_file)
    start_time = datetime.now()

    logger.info("=========================================")
    logger.info("XML Batch Editor 1.6")
    logger.info(f"Start: {start_time}")
    logger.info(f"Layout-Vorlage: {template_path}")
    logger.info(f"config_version: {config_version}")
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

    for g_folder, outer_mm in OUTER_DIAMETERS.items():
        outer_inch = outer_mm / 25.4
        if layer_diameter_mm == 0:
            layer_inch = outer_inch
            layer_used_mm = outer_mm
        else:
            layer_inch = layer_diameter_mm / 25.4
            layer_used_mm = layer_diameter_mm

        logger.info(f"\n{g_folder}")
        logger.info("-" * 30)
        logger.info(f"Outer Diameter: {outer_mm} mm ({outer_inch:.6f} in)")
        logger.info(f"Layer Diameter: {layer_used_mm} mm ({layer_inch:.6f} in)")

        for source_name in source_folders:
            source_path = os.path.join(root_folder, source_name)
            target_path = os.path.join(root_folder, g_folder, source_name)
            xml_files = [
                file_name for file_name in os.listdir(source_path)
                if file_name.lower().endswith(XML_EXTENSION)
            ]

            if not xml_files:
                logger.info(f"{source_name}: 0 XML-Dateien (übersprungen)")
                continue

            if not os.path.isdir(target_path):
                os.makedirs(target_path, exist_ok=True)
                created_folders += 1

            xml_count = 0
            for file_name in xml_files:
                source_file = os.path.join(source_path, file_name)
                target_file = os.path.join(target_path, file_name)
                if process_file(
                    source_file, target_file, template_root,
                    outer_inch, layer_inch, logger
                ):
                    xml_count += 1
                    processed_files += 1
                else:
                    error_files += 1

            logger.info(f"{source_name}: {xml_count} XML-Dateien")

    end_time = datetime.now()
    logger.info("")
    logger.info("=========================================")
    logger.info(f"Erstellte Ordner: {created_folders}")
    logger.info(f"Verarbeitete XML-Dateien: {processed_files}")
    logger.info(f"Dateien mit Fehlern: {error_files}")
    logger.info(f"Ende: {end_time}")
    logger.info(f"Dauer: {end_time - start_time}")
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