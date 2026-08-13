# AGENTS.md

## Project overview

This repository contains a small XML batch-editing utility for manufacturing data. The core logic is in the `Code/` directory, where Python scripts and a browser-based GUI manipulate XML files in a folder tree such as `Schedule_new/G10/...` or sibling group folders like `G10` through `G38`.

## Key files

- `Code/batch_editor1.py`: Tkinter desktop version that updates XML values in a source folder and writes results into sibling target folders.
- `Code/batch_editor_gui.html`: browser-based GUI version for the same XML editing workflow.
- `Code/test/`: local test area or scratch space for validation.
- `Schedule_new/`: source data structure with multiple XML files grouped by test or machine area.
- `README.md`: project-level overview and any usage notes.

## Working conventions

- Treat the Python scripts in `Code/` as the operational reference for XML editing behavior.
- Preserve the existing folder logic: the scripts derive target folders from the parent directory of the selected source folder and write to sibling groups such as `G10`, `G12`, etc.
- Keep XML field updates limited to the known target nodes: `outer_diameter` and `layer_diameter`.
- When updating the GUI, keep the behavior aligned with the Python versions unless the change is intentionally version-specific.
- Do not rename or restructure the generated target folders without a clear reason; many scripts assume the `Gxx` layout.

## Validation and usage

- Run Python scripts directly with the local interpreter, for example: `python3 Code/batch_editor1.py`
- The browser UI is a static HTML file and is usually opened directly in a browser.
- This project is primarily data-processing and GUI automation, not a package-based app; there is no formal build/test pipeline to run.

## Safe change guidance

- Prefer minimal, targeted edits.
- Preserve XML serialization behavior and existing error handling unless the task specifically requires a change there.
- If you add new batch-editing options, keep defaults compatible with the current workflow and document any new input fields or output assumptions.
- Avoid broad refactors in this repo unless the task explicitly calls for them.

## Repository-specific notes

- Files under `Schedule_new/` are data artifacts, not app source code.
- The scripts are intentionally simple and rely on `xml.etree.ElementTree`.
- Most user-facing text is German, so preserve localized labels and error messages unless a task explicitly requires translation.
