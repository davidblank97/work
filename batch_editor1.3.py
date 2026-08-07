import os
import xml.etree.ElementTree as ET
from datetime import datetime

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

print("\n=====================================")
print("      Schedule XML Batch Editor")
print("=====================================\n")

root_folder = input(
    "Pfad zu 'Schedule_new': "
).strip()

if not os.path.isdir(root_folder):
    print("FEHLER: Ordner nicht gefunden!")
    quit()

try:
    layer_mm = float(input("Layer Diameter (mm): "))
except ValueError:
    print("FEHLER: Ungültiger Zahlenwert")
    quit()

layer_inch = layer_mm / 25.4

log_file = os.path.join(root_folder, "batch_log.txt")

processed_files = 0

with open(log_file, "w", encoding="utf-8") as log:

    log.write("=====================================\n")
    log.write("Schedule XML Batch Editor\n")
    log.write(f"Start : {datetime.now()}\n")
    log.write("=====================================\n\n")

    source_folders = []

    for item in os.listdir(root_folder):

        full_path = os.path.join(root_folder, item)

        if not os.path.isdir(full_path):
            continue

        # G-Ordner überspringen
        if item.upper() in OUTER_DIAMETERS:
            continue

        source_folders.append(item)

    print(f"\n{len(source_folders)} Quellordner gefunden\n")

    for g_folder, outer_mm in OUTER_DIAMETERS.items():

        outer_inch = outer_mm / 25.4

        print(f"\n=== {g_folder} ===")

        log.write(
            f"{g_folder} | "
            f"Outer={outer_mm}mm "
            f"({outer_inch:.6f}in)\n"
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

                    log.write(
                        f"FEHLER: {source_file}\n"
                    )
                    log.write(
                        f"{str(e)}\n\n"
                    )

            print(
                f"  {source_name}: "
                f"{xml_count} XML-Dateien"
            )

            log.write(
                f"  {source_name}: "
                f"{xml_count} XML\n"
            )

        log.write("\n")

    log.write(
        f"\nGesamt Dateien: "
        f"{processed_files}\n"
    )

print("\n=====================================")
print(f"Fertig. {processed_files} Dateien verarbeitet.")
print(f"Log-Datei: {log_file}")
print("=====================================")