import os
import xml.etree.ElementTree as ET
from datetime import datetime

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
    quit()

log_file = os.path.join(root_folder, "batch_log.txt")

processed_files = 0
created_folders = 0

with open(log_file, "w", encoding="utf-8") as log:

    log.write("=========================================\n")
    log.write("XML Batch Editor\n")
    log.write(f"Start: {datetime.now()}\n")
    log.write("=========================================\n\n")

    source_folders = []

    # Alle Quellordner sammeln
    for item in os.listdir(root_folder):

        full_path = os.path.join(root_folder, item)

        if not os.path.isdir(full_path):
            continue

        # G-Ordner überspringen
        if item.upper() in OUTER_DIAMETERS:
            continue

        source_folders.append(item)

    source_folders.sort()

    print(
        f"{len(source_folders)} Quellordner gefunden.\n"
    )

    log.write("Gefundene Quellordner:\n")

    for folder in source_folders:
        log.write(f"  {folder}\n")

    log.write("\n")

    # Für jeden G-Ordner
    for g_folder, outer_mm in OUTER_DIAMETERS.items():

        outer_inch = outer_mm / 25.4

        # Layer = Outer
        layer_inch = outer_inch

        print(f"\n{g_folder}")
        print("-" * 30)

        log.write(
            f"\n{g_folder}\n"
            f"Outer Diameter: {outer_mm} mm "
            f"({outer_inch:.6f} in)\n"
            f"Layer Diameter: {outer_mm} mm "
            f"({layer_inch:.6f} in)\n"
        )

        for source_name in source_folders:

            source_path = os.path.join(
                root_folder,
                source_name
            )

            target_path = os.path.join(
                root_folder,
                g_folder,
                source_name
            )

            os.makedirs(
                target_path,
                exist_ok=True
            )

            created_folders += 1
            xml_count = 0

            for file_name in os.listdir(source_path):

                if not file_name.lower().endswith(".xml"):
                    continue

                source_file = os.path.join(
                    source_path,
                    file_name
                )

                try:

                    tree = ET.parse(source_file)
                    root = tree.getroot()

                    for elem in root.iter():

                        if elem.tag == "outer_diameter":
                            elem.text = f"{outer_inch:.6f}"

                        elif elem.tag == "layer_diameter":
                            elem.text = f"{layer_inch:.6f}"

                    target_file = os.path.join(
                        target_path,
                        file_name
                    )

                    tree.write(
                        target_file,
                        encoding="utf-8",
                        xml_declaration=False
                    )

                    xml_count += 1
                    processed_files += 1

                except Exception as e:

                    print(
                        f"Fehler: {file_name}"
                    )

                    log.write(
                        f"FEHLER: {source_file}\n"
                    )

                    log.write(
                        f"{e}\n"
                    )

            print(
                f"{source_name}: "
                f"{xml_count} XML-Dateien"
            )

            log.write(
                f"  {source_name}: "
                f"{xml_count} XML-Dateien\n"
            )

    log.write("\n=========================================\n")
    log.write(f"Erstellte Ordner: {created_folders}\n")
    log.write(f"Verarbeitete XML-Dateien: {processed_files}\n")
    log.write("=========================================\n")

print("\n==========================================")
print("FERTIG")
print("==========================================")
print(f"Verarbeitete XML-Dateien : {processed_files}")
print(f"Log-Datei                : {log_file}")
print("==========================================")

input("\nEnter zum Beenden...")