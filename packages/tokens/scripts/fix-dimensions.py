#!/usr/bin/env python3
"""
Script to fix redundant prefixes in dimension.json and rename the file.
E.g., radius.radius-none -> radius.none
"""

import json
import os
import re

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def fix_dimensions():
    old_file = os.path.join(TOKENS_DIR, 'dimention.json')
    new_file = os.path.join(TOKENS_DIR, 'dimension.json')
    
    # Rename if old exists
    if os.path.exists(old_file):
        os.rename(old_file, new_file)
        print(f"✅ Renamed dimention.json to dimension.json")
    
    with open(new_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Phase 1: Update internal references in the content string
    replacements = [
        (r'\{dimension\.radius\.radius-', '{dimension.radius.'),
        (r'\{dimension\.width\.width-', '{dimension.width.'),
        (r'\{dimension\.spacing-semantic\.spacing-', '{dimension.spacing-semantic.'),
    ]
    
    changes = 0
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            changes += 1
            content = new_content
            
    # Phase 2: Load JSON and fix the keys
    data = json.loads(content)
    if 'dimension' not in data:
        print("No 'dimension' key found")
        return
        
    dim_data = data['dimension']
    
    categories_to_fix = {
        'radius': 'radius-',
        'width': 'width-',
        'spacing-semantic': 'spacing-',
    }
    
    keys_renamed = 0
    for category, prefix in categories_to_fix.items():
        if category in dim_data:
            cat_data = dim_data[category]
            keys_to_rename = [k for k in cat_data.keys() if k.startswith(prefix)]
            for old_key in keys_to_rename:
                new_key = old_key.replace(prefix, '')
                if new_key and new_key not in cat_data:
                    cat_data[new_key] = cat_data.pop(old_key)
                    keys_renamed += 1
                    
    # Save back
    with open(new_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"✅ Cleaned dimension.json redundant prefixes ({keys_renamed} keys renamed)")
    
    # Phase 3: Update references in OTHER files
    for filename in os.listdir(TOKENS_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(TOKENS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                f_content = f.read()
            
            new_f_content = f_content
            ref_changes = 0
            for pattern, replacement in replacements:
                res = re.sub(pattern, replacement, new_f_content)
                if res != new_f_content:
                    new_f_content = res
                    ref_changes += 1
            
            if new_f_content != f_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_f_content)
                print(f"✅ Updated references in {filename}")

if __name__ == '__main__':
    fix_dimensions()
