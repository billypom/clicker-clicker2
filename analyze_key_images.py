#!/usr/bin/env python3
from PIL import Image
import numpy as np
from collections import Counter
import colorsys

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_dominant_colors(image_path, num_colors=8):
    try:
        # Open image and convert to RGB
        img = Image.open(image_path).convert('RGB')
        
        # Resize image to make processing faster
        img = img.resize((150, 150))
        
        # Get colors
        pixels = np.array(img)
        pixels = pixels.reshape(-1, 3)
        
        # Count most common colors
        count = Counter(map(tuple, pixels))
        most_common = count.most_common(num_colors)
        
        # Convert to hex
        return [rgb_to_hex(color) for color, count in most_common]
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return []

# List of key images to analyze
key_images = [
    "/home/billy/code/viber/src/assets/logo.png",
    "/home/billy/code/viber/src/assets/mouse.png",
    "/home/billy/code/viber/src/assets/keyboard.png",
    "/home/billy/code/viber/src/assets/monitor.png",
    "/home/billy/code/viber/src/assets/data center.png",
    "/home/billy/code/viber/src/assets/galaxy.png"
]

print("Key Image Analysis:\n")

for image_path in key_images:
    image_name = image_path.split("/")[-1]
    colors = get_dominant_colors(image_path)
    
    print(f"{image_name}:")
    for color in colors:
        # Convert to RGB for displaying color names
        h = color.lstrip('#')
        r, g, b = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
        h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
        
        # Determine color category
        category = "unknown"
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
        
        print(f"  {color} - {category} (HSV: {h*360:.1f}, {s*100:.1f}%, {v*100:.1f}%)")
    print("") 