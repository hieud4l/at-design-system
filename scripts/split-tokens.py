#!/usr/bin/env python3
"""
Script to split color.json into primitive and semantic tokens
"""

import json
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
TOKENS_DIR = BASE_DIR / "tokens"
COLOR_FILE = TOKENS_DIR / "color.json"

# Output paths
BASE_OUTPUT = TOKENS_DIR / "base"
LIGHT_OUTPUT = TOKENS_DIR / "themes" / "light"
DARK_OUTPUT = TOKENS_DIR / "themes" / "dark"

# Primitive color keys (these don't change between themes)
PRIMITIVE_KEYS = {
    "base",
    "gray-light-mode", 
    "gray-dark-mode",
    "gray-dark-mode-alpha",
    "brand",
    "error",
    "warning", 
    "success",
    "gray-blue",
    "gray-cool",
    "gray-modern",
    "gray-neutral",
    "gray-iron",
    "gray-true",
    "gray-warm",
    "moss",
    "green-light",
    "green",
    "teal",
    "cyan",
    "blue-light",
    "blue",
    "blue-dark",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "ros",
    "orange-dark",
    "orange",
    "yellow"
}

# Semantic color keys (these change between themes)
SEMANTIC_KEYS = {
    "border",
    "text",
    "foreground",
    "background",
    "effects",
    "components"
}

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✓ Saved: {path}")

def split_colors():
    # Load original color.json
    data = load_json(COLOR_FILE)
    colors = data.get("color", {})
    
    # Split into primitives and semantics
    primitives = {}
    semantics_light = {}
    
    for key, value in colors.items():
        if key in PRIMITIVE_KEYS:
            primitives[key] = value
        elif key in SEMANTIC_KEYS:
            semantics_light[key] = value
        else:
            # Unknown key - add to primitives by default
            print(f"⚠ Unknown key '{key}' - adding to primitives")
            primitives[key] = value
    
    # Create output files
    primitives_output = {"color": primitives}
    semantics_light_output = {"color": semantics_light}
    
    # Save primitive colors
    save_json(primitives_output, BASE_OUTPUT / "color-primitives.json")
    
    # Save light theme semantic colors
    save_json(semantics_light_output, LIGHT_OUTPUT / "color-semantic.json")
    
    # Load and copy dark theme overrides
    dark_color_file = BASE_DIR / "tokens-dark" / "color.json"
    if dark_color_file.exists():
        dark_data = load_json(dark_color_file)
        save_json(dark_data, DARK_OUTPUT / "color-semantic.json")
    
    print("\n✓ Color tokens split successfully!")
    print(f"  - Primitives: {len(primitives)} color groups")
    print(f"  - Light semantics: {len(semantics_light)} color groups")

def move_other_tokens():
    """Move other token files to base directory"""
    files_to_move = [
        "dimension.json",
        "typography.json", 
        "blur.json",
        "strings.json",
        "gradient.json"
    ]
    
    for filename in files_to_move:
        src = TOKENS_DIR / filename
        if src.exists():
            data = load_json(src)
            save_json(data, BASE_OUTPUT / filename)
    
    # Move shadows to light theme
    shadows_src = TOKENS_DIR / "shadows.json"
    if shadows_src.exists():
        data = load_json(shadows_src)
        save_json(data, LIGHT_OUTPUT / "shadows.json")
        # Also copy to dark (can be customized later)
        save_json(data, DARK_OUTPUT / "shadows.json")

if __name__ == "__main__":
    print("="*50)
    print("Splitting token files...")
    print("="*50)
    
    split_colors()
    move_other_tokens()
    
    print("\n" + "="*50)
    print("All tokens have been restructured!")
    print("="*50)
    print("\nNext steps:")
    print("1. Update sd.config.mjs with new paths")
    print("2. Run 'npm run build' to test")
    print("3. Compare output with build-backup/")
