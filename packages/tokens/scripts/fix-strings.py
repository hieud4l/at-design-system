#!/usr/bin/env python3
"""
Script to fix redundant prefixes in strings.json.
E.g., font-family.font-family-display -> font-family.display
"""

import json
import os

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def fix_strings_json():
    strings_file = os.path.join(TOKENS_DIR, 'strings.json')
    
    with open(strings_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'string' not in data:
        print("No 'string' key found")
        return
    
    string_data = data['string']
    
    # Fix font-family category
    if 'font-family' in string_data:
        ff_cat = string_data['font-family']
        keys_to_rename = [k for k in ff_cat.keys() if k.startswith('font-family-')]
        for old_key in keys_to_rename:
            new_key = old_key.replace('font-family-', '')
            ff_cat[new_key] = ff_cat.pop(old_key)
            print(f"  font-family.{old_key} -> font-family.{new_key}")
            
    # Save back
    with open(strings_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("\n✅ Cleaned strings.json redundant prefixes")

if __name__ == '__main__':
    fix_strings_json()
