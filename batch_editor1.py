import os
import tkinter as tk
from tkinter import filedialog, messagebox
import xml.etree.ElementTree as ET

TARGET_FOLDERS = [
    "G10", "G12", "G18", "G20",
    "G22", "G24", "G26", "G28",
    "G30", "G34", "G36", "G38"
]


def select_folder():
    folder = filedialog.askdirectory()
    folder_var.set(folder)


def process_files():

    source_folder = folder_var.get()

    if not source_folder:
        messagebox.showerror("Fehler", "Bitte Quellordner auswählen.")
        return

    try:
        outer_value = float(entry_outer.get())
        layer_value = float(entry_layer.get())
    except ValueError:
        messagebox.showerror(
            "Fehler",
            "Bitte gültige Zahlen eingeben."
        )
        return

    success_count = 0

    try:

        parent_path = os.path.dirname(source_folder)

        for target_folder_name in TARGET_FOLDERS:

            target_folder = os.path.join(
                parent_path,
                target_folder_name
            )

            os.makedirs(target_folder, exist_ok=True)

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

                except Exception as e:
                    print(f"Fehler bei {filename}: {e}")

        messagebox.showinfo(
            "Fertig",
            f"{success_count} Dateien erfolgreich verarbeitet."
        )

    except Exception as e:
        messagebox.showerror(
            "Fehler",
            str(e)
        )


root = tk.Tk()
root.title("XML Batch Editor")
root.geometry("600x260")

folder_var = tk.StringVar()

tk.Label(
    root,
    text="Quellordner mit XML-Dateien"
).pack(pady=10)

frame = tk.Frame(root)
frame.pack()

tk.Entry(
    frame,
    textvariable=folder_var,
    width=60
).pack(side=tk.LEFT, padx=5)

tk.Button(
    frame,
    text="Ordner wählen",
    command=select_folder
).pack(side=tk.LEFT)

tk.Label(
    root,
    text="Outer Diameter"
).pack(pady=(20, 5))

entry_outer = tk.Entry(root, width=20)
entry_outer.insert(0, "12.000000")
entry_outer.pack()

tk.Label(
    root,
    text="Layer Diameter"
).pack(pady=(15, 5))

entry_layer = tk.Entry(root, width=20)
entry_layer.insert(0, "5.000000")
entry_layer.pack()

tk.Button(
    root,
    text="Ausführen",
    command=process_files,
    bg="green",
    fg="white",
    width=20
).pack(pady=25)

root.mainloop()