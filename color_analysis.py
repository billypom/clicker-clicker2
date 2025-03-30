#!/usr/bin/env python3
from PIL import Image
import numpy as np
import os
from collections import Counter
import colorsys

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_dominant_colors(image_path, num_colors=5):
    # Open image and convert to RGB
    img = Image.open(image_path).convert('RGB')
    
    # Resize image to make processing faster
    img = img.resize((100, 100))
    
    # Get colors
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)
    
    # Count most common colors
    count = Counter(map(tuple, pixels))
    most_common = count.most_common(num_colors)
    
    # Convert to hex
    return [rgb_to_hex(color) for color, count in most_common]

def get_color_stats(hex_color):
    # Convert hex to RGB
    h = hex_color.lstrip('#')
    r, g, b = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    
    # Convert RGB to HSV
    h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
    
    # Determine if color is dark or light
    is_dark = v < 0.5
    
    # Determine if color is vibrant
    is_vibrant = s > 0.5 and v > 0.5
    
    # Determine basic color category
    if s < 0.15:
        if v < 0.15:
            category = "black"
        elif v > 0.85:
            category = "white"
        else:
            category = "gray"
    else:
        if h < 0.05 or h > 0.95:
            category = "red"
        elif 0.05 <= h < 0.15:
            category = "orange"
        elif 0.15 <= h < 0.25:
            category = "yellow"
        elif 0.25 <= h < 0.5:
            category = "green"
        elif 0.5 <= h < 0.65:
            category = "cyan"
        elif 0.65 <= h < 0.75:
            category = "blue"
        elif 0.75 <= h < 0.95:
            category = "purple"
    
    return {
        "hex": hex_color,
        "rgb": (r, g, b),
        "hsv": (h*360, s*100, v*100),
        "is_dark": is_dark,
        "is_vibrant": is_vibrant,
        "category": category
    }

def analyze_assets(directory):
    assets = []
    
    # Find all PNG files
    for file in os.listdir(directory):
        if file.endswith('.png'):
            assets.append(os.path.join(directory, file))
    
    # Get color data
    color_data = {}
    all_colors = []
    
    for asset in assets:
        name = os.path.basename(asset)
        dominant_colors = get_dominant_colors(asset)
        color_data[name] = dominant_colors
        all_colors.extend(dominant_colors)
    
    # Count most common colors across all assets
    color_counter = Counter(all_colors)
    most_common_colors = color_counter.most_common(10)
    
    # Get stats for most common colors
    color_stats = [get_color_stats(color) for color, _ in most_common_colors]
    
    # Find primary and accent colors
    primary_colors = []
    accent_colors = []
    
    for stat in color_stats:
        if stat["category"] not in ["black", "white", "gray"]:
            if stat["is_vibrant"]:
                accent_colors.append(stat)
            else:
                primary_colors.append(stat)
    
    # Find background colors (darker colors)
    background_colors = [stat for stat in color_stats if stat["is_dark"]]
    
    return {
        "individual_assets": color_data,
        "most_common_colors": [color for color, _ in most_common_colors],
        "color_stats": color_stats,
        "primary_colors": primary_colors[:3],
        "accent_colors": accent_colors[:3],
        "background_colors": background_colors[:3]
    }

if __name__ == "__main__":
    assets_dir = "/home/billy/code/viber/src/assets"
    results = analyze_assets(assets_dir)
    
    print("Color Analysis Results:\n")
    
    print("Most Common Colors:")
    for color in results["most_common_colors"]:
        print(f"  {color}")
    
    print("\nPrimary Colors:")
    for color in results["primary_colors"]:
        print(f"  {color['hex']} - {color['category']}")
    
    print("\nAccent Colors:")
    for color in results["accent_colors"]:
        print(f"  {color['hex']} - {color['category']}")
    
    print("\nBackground Colors:")
    for color in results["background_colors"]:
        print(f"  {color['hex']} - {color['category']}")
    
    print("\nDetailed Color Stats:")
    for i, stat in enumerate(results["color_stats"][:5]):
        print(f"Color {i+1}:")
        print(f"  Hex: {stat['hex']}")
        print(f"  RGB: {stat['rgb']}")
        print(f"  HSV: {stat['hsv']}")
        print(f"  Category: {stat['category']}")
        print(f"  Dark: {stat['is_dark']}")
        print(f"  Vibrant: {stat['is_vibrant']}")
        print("") 