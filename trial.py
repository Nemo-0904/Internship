import os
import json

# === CONFIGURATION ===
reference_json_path = r"D:\Techligence\Robotic_Co_refined_new\frontend\src\data\combined_data_with_no_duplicate_names_with_ids.json"
models_root_dir = r"D:\Techligence\Robotic_Co_refined_new\frontend\public\stl"
output_json_path = r"D:\Techligence\Robotic_Co_refined_new\frontend\src\data\stlfiles.json"

# === Load reference JSON ===
with open(reference_json_path, "r", encoding="utf-8") as ref_file:
    reference_data = json.load(ref_file)

# === Extract names from reference JSON ===
reference_names = [entry["name"] for entry in reference_data]

# === Supported file extensions ===
SUPPORTED_EXTENSIONS = {".stl", ".3mf"}

# === Build output ===
output = []

for name in reference_names:
    folder_path = os.path.join(models_root_dir, name)
    file_entries = []

    if os.path.isdir(folder_path):
        for filename in os.listdir(folder_path):
            ext = os.path.splitext(filename)[1].lower()
            if ext in SUPPORTED_EXTENSIONS:
                file_entries.append({
                    "name": os.path.splitext(filename)[0],
                    "filename": filename
                })
            else:
                print(f"⚠️ Unsupported file type in '{name}': {filename}")
    else:
        print(f"❌ Folder not found for: '{name}'")

    file_entries.sort(key=lambda x: x["name"])  # optional: alphabetical
    output.append({
        "name": name,
        "stl_files": file_entries
    })

# === Save output JSON ===
with open(output_json_path, "w", encoding="utf-8") as out_file:
    json.dump(output, out_file, indent=2)

print(f"\n✅ JSON generated and saved to:\n{output_json_path}")
