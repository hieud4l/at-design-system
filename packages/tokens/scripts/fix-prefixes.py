#!/usr/bin/env python3
"""
Script to remove redundant prefixes from token names AND update references.
E.g., text.text-primary → text.primary
      border.border-primary → border.primary
"""

import json
import os
import re

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def remove_redundant_prefixes():
    """Remove redundant prefixes from token names in color.json"""
    color_file = os.path.join(TOKENS_DIR, 'color.json')
    
    with open(color_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, do text replacements in the raw JSON string for references
    replacements = [
        # Update references - remove redundant prefixes
        (r'\{color\.text\.text-', '{color.text.'),
        (r'\{color\.border\.border-', '{color.border.'),
        (r'\{color\.foreground\.fg-', '{color.foreground.'),
        (r'\{color\.background\.bg-', '{color.background.'),
    ]
    
    changes = 0
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            changes += content.count(pattern.replace('\\', '').replace('{', '').replace('}', ''))
            content = new_content
    
    # Parse as JSON to rename keys
    data = json.loads(content)
    
    if 'color' not in data:
        print("No 'color' key found")
        return
    
    color_data = data['color']
    
    # Define categories and their redundant prefixes
    categories_to_fix = {
        'text': 'text-',
        'border': 'border-',
        'foreground': 'fg-',
        'background': 'bg-',
    }
    
    keys_renamed = 0
    for category, prefix in categories_to_fix.items():
        if category not in color_data:
            continue
            
        cat_data = color_data[category]
        if not isinstance(cat_data, dict):
            continue
        
        # Find keys that start with the redundant prefix
        keys_to_rename = [k for k in cat_data.keys() if k.startswith(prefix)]
        
        for old_key in keys_to_rename:
            new_key = old_key[len(prefix):]  # Remove the prefix
            if new_key and new_key not in cat_data:  # Avoid empty keys or conflicts
                cat_data[new_key] = cat_data[old_key]
                del cat_data[old_key]
                keys_renamed += 1
                print(f"  {category}.{old_key} → {category}.{new_key}")
    
    # Save
    with open(color_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✅ Renamed {keys_renamed} token keys")
    print(f"✅ Updated {changes} references")

def main():
    print("=" * 50)
    print("Removing redundant prefixes from token names...")
    print("=" * 50)
    print()
    
    remove_redundant_prefixes()
    
    print("\n" + "=" * 50)
    print("Done! Run 'npm run build:tokens' to rebuild.")
    print("=" * 50)

if __name__ == '__main__':
    main()
