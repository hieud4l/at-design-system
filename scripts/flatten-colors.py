#!/usr/bin/env python3
"""
Script to flatten color.colors into color (remove redundant 'colors' nesting)
and update all references.
"""

import json
import os
import re

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def flatten_color_colors():
    """Remove the redundant 'colors' level from color.json"""
    color_file = os.path.join(TOKENS_DIR, 'color.json')
    
    with open(color_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'color' not in data:
        print("No 'color' key found")
        return
    
    color_data = data['color']
    
    if 'colors' not in color_data:
        print("No 'colors' key found - already flat")
        return
    
    # Get the contents of color.colors
    colors_content = color_data['colors']
    
    # Remove the 'colors' key
    del color_data['colors']
    
    # Merge colors content directly into color
    for key, value in colors_content.items():
        color_data[key] = value
    
    # Now update all references from {color.colors.X} to {color.X}
    json_str = json.dumps(data, indent=4, ensure_ascii=False)
    
    # Replace references
    json_str = re.sub(r'\{color\.colors\.', '{color.', json_str)
    
    # Also handle component-colors references
    json_str = re.sub(r'\{color\.component-colors\.', '{color.components.', json_str)
    
    # Parse back
    data = json.loads(json_str)
    
    # Rename component-colors to components for cleaner names
    if 'component-colors' in data['color']:
        data['color']['components'] = data['color']['component-colors']
        del data['color']['component-colors']
    
    # Save
    with open(color_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✅ Flattened color.colors into color")
    print(f"✅ Renamed component-colors to components")
    print(f"✅ Updated all token references")

def main():
    print("=" * 50)
    print("Flattening color token structure...")
    print("=" * 50)
    
    flatten_color_colors()
    
    print("\n" + "=" * 50)
    print("Done! Run 'npm run build:tokens' to rebuild.")
    print("=" * 50)

if __name__ == '__main__':
    main()
