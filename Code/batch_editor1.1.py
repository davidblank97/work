import os
import xml.etree.ElementTree as ET

TARGET_FOLDERS = [
    "G10", "G12", "G18", "G20",
    "G22", "G24", "G26", "G28",
    "G30", "G34", "G36", "G38"
]

print("=== XML Batch Editor ===")

source_folder = input(
    "Pfad zum Quellordner mit XML-Dateien: "
).strip()

if not os.path.exists(source_folder):
    print("FEHLER: Ordner nicht gefunden!")
    exit()

try:
    outer_value = float(
        input("Outer Diameter neuer Wert: ")
    )

    layer_value = float(
        input("Layer Diameter neuer Wert: ")
    )

except ValueError:
    print("FEHLER: Bitte nur Zahlen eingeben.")
    exit()

success_count = 0

parent_path = os.path.dirname(source_folder)

for folder_name in TARGET_FOLDERS:

    target_folder = os.path.join(
        parent_path,
        folder_name
    )

    os.makedirs(target_folder, exist_ok=True)

    print(f"\nBearbeite {folder_name}...")

    for filename in os.listdir(source_folder):

        if not filename.lower().endswith(".xml"):
            continue

        source_file = os.path.join(
            source_folder,
            filename
        )

        try:
            tree = ET.parse(source_file)
            root = tree.getroot()

            for elem in root.iter():

                if elem.tag == "outer_diameter":
                    elem.text = f"{outer_value:.6f}"

                elif elem.tag == "layer_diameter":
                    elem.text = f"{layer_value:.6f}"

            target_file = os.path.join(
                target_folder,
                filename
            )

            tree.write(
                target_file,
                encoding="utf-8",
                xml_declaration=False
            )

            success_count += 1

            print(f"  OK -> {filename}")

        except Exception as e:
            print(f"  FEHLER bei {filename}: {e}")

print("\n=================================")
print(f"Fertig. {success_count} Dateien verarbeitet.")
print("=================================")