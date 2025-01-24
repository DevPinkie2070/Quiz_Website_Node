import os
import cairosvg


input_dir = "./img/logo_quiz_svg"
output_dir = "./img/logo_quiz" 
os.makedirs(output_dir, exist_ok=True)


for file in os.listdir(input_dir):
    if file.endswith(".svg"):
        svg_path = os.path.join(input_dir, file)
        png_path = os.path.join(output_dir, f"{os.path.splitext(file)[0]}.png")
        

        cairosvg.svg2png(url=svg_path, write_to=png_path)
        print(f"Konvertiert: {svg_path} -> {png_path}")

print("Alle SVG-Dateien wurden erfolgreich konvertiert!")