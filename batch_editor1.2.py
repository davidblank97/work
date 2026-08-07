import os
import xml.etree.ElementTree as ET

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

print("=== XML Batch Editor ===")

source_folder = input(
    "Pfad zum Quellordner mit XML-Dateien: "
).strip()

if not os.path.exists(source_folder):
    print("Ordner nicht gefunden!")
    quit()

try:
    layer_mm = float(
        input("Layer Diameter in mm: ")
    )
except ValueError:
    print("Ungültiger Wert!")
    quit()

layer_inch = layer_mm / 25.4

parent_path = os.path.dirname(source_folder)

files_written = 0

for folder_name, outer_mm in OUTER_DIAMETERS.items():

    outer_inch = outer_mm / 25.4

    target_folder = os.path.join(
        parent_path,
        folder_name
    )

    os.makedirs(target_folder, exist_ok=True)

    print(
        f"\n{folder_name}: "
        f"Outer={outer_inch:.6f}\" "
        f"Layer={layer_inch:.6f}\""
    )

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
                    elem.text = f"{outer_inch:.6f}"

                elif elem.tag == "layer_diameter":
                    elem.text = f"{layer_inch:.6f}"

            target_file = os.path.join(
                target_folder,
                filename
            )

            tree.write(
                target_file,
                encoding="utf-8",
                xml_declaration=False
            )

            files_written += 1

        except Exception as e:
            print(f"Fehler in {filename}: {e}")

print("\n================================")
print(f"{files_written} Dateien erstellt.")
print("================================")