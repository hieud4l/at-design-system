#!/usr/bin/env python3
"""
Script to clean up duplicate tokens in the design system.
- Removes duplicate color definitions from color.json
- Restructures dimention.json to remove nested dimension.dimension
"""

import json
import os

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def clean_color_json():
    """Remove duplicate color.* entries that are duplicated in color.colors.*"""
    color_file = os.path.join(TOKENS_DIR, 'color.json')
    
    with open(color_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'color' not in data:
        print("No 'color' key found in color.json")
        return
    
    color_data = data['color']
    
    # Keys that exist at both color.* and color.colors.* levels
    duplicate_keys = [
        'base', 'gray-light-mode', 'gray-dark-mode', 'brand', 'error', 'warning', 
        'success', 'gray-blue', 'gray-cool', 'gray-modern', 'gray-neutral', 
        'gray-iron', 'gray-true', 'gray-warm', 'moss', 'green-light', 'green', 
        'teal', 'cyan', 'blue-light', 'blue', 'blue-dark', 'indigo', 'violet', 
        'purple', 'fuchsia', 'pink', 'ros', 'orange-dark', 'orange', 'yellow'
    ]
    
    # Check if colors key exists (the one that is referenced by semantic tokens)
    if 'colors' in color_data:
        # Remove duplicate top-level color keys (keep colors.* as it's referenced)
        removed_count = 0
        for key in duplicate_keys:
            if key in color_data:
                del color_data[key]
                removed_count += 1
        
        print(f"Removed {removed_count} duplicate top-level color keys from color.json")
        
        # Save the cleaned file
        with open(color_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"Saved cleaned color.json")
    else:
        print("No 'colors' key found - the file structure may be different than expected")

def clean_dimension_json():
    """Restructure dimention.json to flatten dimension.dimension into separate keys"""
    dim_file = os.path.join(TOKENS_DIR, 'dimention.json')
    
    with open(dim_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'dimension' not in data:
        print("No 'dimension' key found in dimention.json")
        return
    
    dim_data = data['dimension']
    
    # Check if there's a nested 'dimension' key
    if 'dimension' in dim_data:
        nested_dim = dim_data['dimension']
        
        # Group the nested dimension tokens by category
        radius_tokens = {}
        width_tokens = {}
        spacing_tokens = {}
        container_tokens = {}
        paragraph_tokens = {}
        
        for key, value in nested_dim.items():
            if key.startswith('radius'):
                radius_tokens[key] = value
            elif key.startswith('width'):
                width_tokens[key] = value
            elif key.startswith('spacing'):
                spacing_tokens[key] = value
            elif key.startswith('container') or key.startswith('paragraph'):
                container_tokens[key] = value
            else:
                # Keep other tokens in a misc category
                container_tokens[key] = value
        
        # Remove the nested dimension key
        del dim_data['dimension']
        
        # Add flattened categories
        if radius_tokens:
            dim_data['radius'] = radius_tokens
        if width_tokens:
            dim_data['width'] = width_tokens
        if spacing_tokens:
            # Merge with existing spacing or add new
            if 'spacing' in dim_data:
                dim_data['spacing-semantic'] = spacing_tokens
            else:
                dim_data['spacing-semantic'] = spacing_tokens
        if container_tokens:
            dim_data['layout'] = container_tokens
        
        print(f"Restructured dimension tokens:")
        print(f"  - radius: {len(radius_tokens)} tokens")
        print(f"  - width: {len(width_tokens)} tokens")
        print(f"  - spacing-semantic: {len(spacing_tokens)} tokens")
        print(f"  - layout: {len(container_tokens)} tokens")
        
        # Remove _comment if exists
        if '_comment' in data:
            del data['_comment']
        
        # Save the cleaned file
        with open(dim_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"Saved restructured dimention.json")
    else:
        print("No nested 'dimension.dimension' found - the file structure is already flat")

def main():
    print("=" * 50)
    print("Cleaning up duplicate tokens...")
    print("=" * 50)
    
    print("\n1. Cleaning color.json...")
    clean_color_json()
    
    print("\n2. Cleaning dimention.json...")
    clean_dimension_json()
    
    print("\n" + "=" * 50)
    print("Done! Please run 'npm run build:tokens' to rebuild.")
    print("=" * 50)

if __name__ == '__main__':
    main()
