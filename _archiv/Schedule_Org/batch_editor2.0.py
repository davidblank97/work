import importlib.util
import os
import queue
import threading
import tkinter as tk
import xml.etree.ElementTree as ET
from datetime import datetime
from tkinter import filedialog, messagebox, ttk


SCRIPT_FOLDER = os.path.dirname(os.path.abspath(__file__))
CORE_PATH = os.path.join(SCRIPT_FOLDER, "batch_editor1.6.py")


spec = importlib.util.spec_from_file_location("batch_editor_core", CORE_PATH)
if spec is None or spec.loader is None:
    raise ImportError(f"Verarbeitungsmodul nicht gefunden: {CORE_PATH}")
core = importlib.util.module_from_spec(spec)
spec.loader.exec_module(core)


def find_template():
    """Verwendet bevorzugt die festgelegte NGRT-Referenzstruktur."""
    preferred_path = os.path.join(
        SCRIPT_FOLDER,
        core.TEMPLATE_FOLDER_NAME,
        "8888-layout new NGRT.xml",
    )
    if os.path.isfile(preferred_path):
        root = ET.parse(preferred_path).getroot()
        version_element = root.find("./metadata/" + core.TAG_CONFIG_VERSION)
        version = version_element.text.strip() if version_element is not None else ""
        if version:
            return preferred_path, root, version
    return core.find_latest_template(SCRIPT_FOLDER)


class BatchEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("XML Batch Editor 2.0")
        self.root.geometry("760x560")
        self.root.minsize(680, 460)

        self.root_folder = tk.StringVar()
        self.layer_diameter = tk.StringVar(value="0")
        self.status = tk.StringVar(value="Bereit")
        self.progress_value = tk.DoubleVar(value=0)
        self.progress_max = tk.IntVar(value=1)
        self.events = queue.Queue()
        self.worker = None

        self._build_ui()
        self.root.after(100, self._poll_events)

    def _build_ui(self):
        main = ttk.Frame(self.root, padding=20)
        main.pack(fill="both", expand=True)
        main.columnconfigure(1, weight=1)
        main.rowconfigure(4, weight=1)

        title = ttk.Label(main, text="XML Batch Editor 2.0", font=("TkDefaultFont", 16, "bold"))
        title.grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 18))

        ttk.Label(main, text="Hauptordner:").grid(row=1, column=0, sticky="w", padx=(0, 10), pady=6)
        self.folder_entry = ttk.Entry(main, textvariable=self.root_folder)
        self.folder_entry.grid(row=1, column=1, sticky="ew", pady=6)
        self.folder_button = ttk.Button(main, text="Ordner waehlen...", command=self._choose_folder)
        self.folder_button.grid(row=1, column=2, padx=(10, 0), pady=6)

        ttk.Label(main, text="Layer-Diameter (mm):").grid(row=2, column=0, sticky="w", padx=(0, 10), pady=6)
        self.layer_entry = ttk.Entry(main, textvariable=self.layer_diameter, width=18)
        self.layer_entry.grid(row=2, column=1, sticky="w", pady=6)
        ttk.Label(main, text="0 = Layer entspricht Outer").grid(row=2, column=2, sticky="w", padx=(10, 0), pady=6)

        self.start_button = ttk.Button(main, text="Verarbeitung starten", command=self._start)
        self.start_button.grid(row=3, column=0, columnspan=3, sticky="ew", pady=(14, 12))

        progress_frame = ttk.LabelFrame(main, text="Fortschritt", padding=10)
        progress_frame.grid(row=4, column=0, columnspan=3, sticky="nsew", pady=(0, 10))
        progress_frame.columnconfigure(0, weight=1)
        progress_frame.rowconfigure(1, weight=1)

        self.progress = ttk.Progressbar(
            progress_frame,
            variable=self.progress_value,
            maximum=1,
            mode="determinate",
        )
        self.progress.grid(row=0, column=0, sticky="ew", pady=(0, 8))
        self.status_label = ttk.Label(progress_frame, textvariable=self.status)
        self.status_label.grid(row=0, column=1, sticky="e", padx=(12, 0))

        self.output = tk.Text(progress_frame, height=14, wrap="word", state="disabled")
        self.output.grid(row=1, column=0, columnspan=2, sticky="nsew")
        scrollbar = ttk.Scrollbar(progress_frame, command=self.output.yview)
        scrollbar.grid(row=1, column=2, sticky="ns")
        self.output.configure(yscrollcommand=scrollbar.set)

        ttk.Label(
            main,
            text="Feste Regeln: aktuelle Layoutstruktur, jog_speed_edit_mode=1, travel_jog=19.98, ahc_retract entfernt",
        ).grid(row=5, column=0, columnspan=3, sticky="w", pady=(4, 0))

    def _choose_folder(self):
        selected = filedialog.askdirectory(title="Hauptordner auswaehlen")
        if selected:
            self.root_folder.set(selected)

    def _write_output(self, text):
        self.output.configure(state="normal")
        self.output.insert("end", text + "\n")
        self.output.see("end")
        self.output.configure(state="disabled")

    def _set_busy(self, busy):
        state = "disabled" if busy else "normal"
        self.start_button.configure(state=state)
        self.folder_button.configure(state=state)
        self.folder_entry.configure(state=state)
        self.layer_entry.configure(state=state)

    def _start(self):
        root_folder = self.root_folder.get().strip()
        if not os.path.isdir(root_folder):
            messagebox.showerror("Ungültiger Ordner", "Bitte einen vorhandenen Hauptordner auswählen.")
            return

        try:
            layer_diameter = float(self.layer_diameter.get().strip())
        except ValueError:
            messagebox.showerror("Ungültiger Wert", "Layer-Diameter muss eine Zahl sein.")
            return

        self._set_busy(True)
        self.progress_value.set(0)
        self.progress.configure(maximum=1)
        self.status.set("Vorbereitung...")
        self._write_output("Verarbeitung gestartet: " + root_folder)
        self.worker = threading.Thread(
            target=self._run_batch,
            args=(root_folder, layer_diameter),
            daemon=True,
        )
        self.worker.start()

    def _run_batch(self, root_folder, layer_diameter):
        logger = None
        try:
            template_path, template_root, config_version = find_template()
            source_folders = core.get_source_folders(root_folder)
            work_items = []
            for g_folder in core.OUTER_DIAMETERS:
                for source_name in source_folders:
                    source_path = os.path.join(root_folder, source_name)
                    xml_files = [
                        name for name in os.listdir(source_path)
                        if name.lower().endswith(core.XML_EXTENSION)
                    ]
                    work_items.extend((g_folder, source_name, file_name) for file_name in xml_files)

            self.events.put(("setup", template_path, config_version, len(source_folders), len(work_items)))
            log_file = os.path.join(root_folder, "batch_log.txt")
            logger = core.setup_logging(log_file)
            start_time = datetime.now()
            logger.info("=========================================")
            logger.info("XML Batch Editor 2.0")
            logger.info(f"Start: {start_time}")
            logger.info(f"Layout-Vorlage: {template_path}")
            logger.info(f"config_version: {config_version}")
            logger.info("=========================================")

            processed_files = 0
            created_folders = 0
            error_files = 0
            current_item = 0

            for g_folder, outer_mm in core.OUTER_DIAMETERS.items():
                outer_inch = outer_mm / 25.4
                if layer_diameter == 0:
                    layer_inch = outer_inch
                else:
                    layer_inch = layer_diameter / 25.4

                for source_name in source_folders:
                    source_path = os.path.join(root_folder, source_name)
                    target_path = os.path.join(root_folder, g_folder, source_name)
                    xml_files = [
                        name for name in os.listdir(source_path)
                        if name.lower().endswith(core.XML_EXTENSION)
                    ]
                    if not xml_files:
                        continue
                    if not os.path.isdir(target_path):
                        os.makedirs(target_path, exist_ok=True)
                        created_folders += 1

                    for file_name in xml_files:
                        current_item += 1
                        source_file = os.path.join(source_path, file_name)
                        target_file = os.path.join(target_path, file_name)
                        success = core.process_file(
                            source_file,
                            target_file,
                            template_root,
                            outer_inch,
                            layer_inch,
                            logger,
                        )
                        if success:
                            processed_files += 1
                        else:
                            error_files += 1
                        self.events.put(("progress", current_item, g_folder, source_name, file_name))

            end_time = datetime.now()
            logger.info(f"Erstellte Ordner: {created_folders}")
            logger.info(f"Verarbeitete XML-Dateien: {processed_files}")
            logger.info(f"Dateien mit Fehlern: {error_files}")
            logger.info(f"Ende: {end_time}")
            logger.info(f"Dauer: {end_time - start_time}")
            self.events.put((
                "done",
                root_folder,
                log_file,
                created_folders,
                processed_files,
                error_files,
            ))
        except Exception as error:
            self.events.put(("error", str(error)))

    def _poll_events(self):
        try:
            while True:
                event = self.events.get_nowait()
                kind = event[0]
                if kind == "setup":
                    _, template_path, config_version, source_count, total = event
                    self.progress.configure(maximum=max(total, 1))
                    self._write_output(f"{source_count} Quellordner gefunden")
                    self._write_output(f"Vorlage: {template_path}")
                    self._write_output(f"config_version: {config_version}")
                elif kind == "progress":
                    _, current, g_folder, source_name, file_name = event
                    self.progress_value.set(current)
                    self.status.set(f"{current}/{int(self.progress['maximum'])}")
                    self._write_output(f"{g_folder}/{source_name}/{file_name}")
                elif kind == "done":
                    _, root_folder, log_file, folders, files, errors = event
                    self.progress_value.set(self.progress["maximum"])
                    self.status.set("Fertig")
                    self._write_output("")
                    self._write_output(f"Erstellte Ordner: {folders}")
                    self._write_output(f"Verarbeitete XML-Dateien: {files}")
                    self._write_output(f"Dateien mit Fehlern: {errors}")
                    self._write_output(f"Log-Datei: {log_file}")
                    self._set_busy(False)
                    messagebox.showinfo("Verarbeitung abgeschlossen", f"{files} XML-Dateien verarbeitet.\nFehler: {errors}")
                elif kind == "error":
                    self.status.set("Fehler")
                    self._write_output("FEHLER: " + event[1])
                    self._set_busy(False)
                    messagebox.showerror("Verarbeitung fehlgeschlagen", event[1])
        except queue.Empty:
            pass
        self.root.after(100, self._poll_events)


def main():
    if os.name != "nt" and not os.environ.get("DISPLAY"):
        print("Keine grafische Anzeige gefunden. Starte im Terminal-Modus.")
        core.main()
        return

    root = tk.Tk()
    BatchEditorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
