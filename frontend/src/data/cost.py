import os
from stl import mesh
import numpy as np
from tkinter import Tk, filedialog

# === Constants ===
DENSITY_G_CM3 = {'PLA': 1.24, 'PETG': 1.27, 'TPU': 1.20}

# === Helper Functions ===

def get_material_choice():
    print("\n📦 Available Materials:")
    for i, mat in enumerate(DENSITY_G_CM3.keys(), 1):
        print(f"{i}. {mat} (Density: {DENSITY_G_CM3[mat]} g/cm³)")
    choice = input("🔧 Enter material choice number: ").strip()
    material_list = list(DENSITY_G_CM3.keys())
    if choice.isdigit() and 1 <= int(choice) <= len(material_list):
        return material_list[int(choice) - 1]
    print("❌ Invalid choice.")
    return None

def read_stl_dimensions(file_path):
    try:
        model = mesh.Mesh.from_file(file_path)

        # Perform a more accurate "is closed" check
        if not model.is_closed(exact=True):
            print(f"⚠️ Warning: Mesh {os.path.basename(file_path)} is not closed (exact check). Volume may be inaccurate.")

        # Mass properties
        volume_cm3, _, _ = model.get_mass_properties()
        surface_area_cm2 = np.sum(model.areas)
        bounds = (model.x.ptp(), model.y.ptp(), model.z.ptp())

        # Get raw vertex data (each triangle has 3 vertices)
        raw_vertices = model.vectors.reshape(-1, 3)
        unique_vertices = np.unique(np.round(raw_vertices, decimals=5), axis=0)

        num_triangles = len(model)
        num_vertices = len(unique_vertices)

        return {
            "x": round(bounds[0], 2),
            "y": round(bounds[1], 2),
            "z": round(bounds[2], 2),
            "volume_cm3": round(volume_cm3, 2),
            "surface_area_cm2": round(surface_area_cm2, 2),
            "num_vertices": num_vertices,
            "num_triangles": num_triangles
        }

    except Exception as e:
        print(f"❌ Error reading {os.path.basename(file_path)}: {e}")
        return None

def select_stl_files():
    root = Tk()
    root.withdraw()
    return list(filedialog.askopenfilenames(
        title="Select STL Files",
        filetypes=[("STL files", "*.stl")]
    ))

# === Main ===

def main():
    print("📁 Select one or more STL files...")
    files = select_stl_files()
    if not files:
        print("❌ No files selected.")
        return

    material = get_material_choice()
    if not material:
        return

    density = DENSITY_G_CM3[material]
    print(f"\n🧵 Material Selected: {material} (Density = {density} g/cm³)")

    for file_path in files:
        file_name = os.path.basename(file_path)
        print(f"\n🔍 Processing: {file_name}")
        dims = read_stl_dimensions(file_path)
        if not dims:
            continue

        mass_g = round(dims['volume_cm3'] * density, 2)

        print(f"📐 Dimensions (X × Y × Z): {dims['x']} × {dims['y']} × {dims['z']} cm")
        print(f"📏 Volume: {dims['volume_cm3']} cm³")
        print(f"📎 Surface Area: {dims['surface_area_cm2']} cm²")
        print(f"🧩 Triangles: {dims['num_triangles']}, Vertices: {dims['num_vertices']}")
        print(f"⚖️ Estimated Mass: {mass_g} g")
        print(f"⚙️ Density Used: {density} g/cm³")

if __name__ == "__main__":
    main()
