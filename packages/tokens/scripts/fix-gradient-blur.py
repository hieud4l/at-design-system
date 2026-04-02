#!/usr/bin/env python3
"""
Script to fix redundant nesting in gradient.json and prefixes in blur.json.
"""

import json
import os

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def fix_gradient_json():
    gradient_file = os.path.join(TOKENS_DIR, 'gradient.json')
    if not os.path.exists(gradient_file):
        return
        
    with open(gradient_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Flatten gradient.gradient -> gradient
    if 'gradient' in data and 'gradient' in data['gradient']:
        data['gradient'] = data['gradient']['gradient']
        with open(gradient_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("✅ Flattened gradient.json")

def fix_blur_json():
    blur_file = os.path.join(TOKENS_DIR, 'blur.json')
    if not os.path.exists(blur_file):
        return
        
    with open(blur_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'blur' not in data:
        return
        
    blur_data = data['blur']
    
    # Rename backdrop-blurs -> backdrop and remove prefix backdrop-blur-
    if 'backdrop-blurs' in blur_data:
        old_cat = blur_data.pop('backdrop-blurs')
        new_cat = {}
        for key, value in old_cat.items():
            new_key = key.replace('backdrop-blur-', '')
            new_cat[new_key] = value
        blur_data['backdrop'] = new_cat
        
        with open(blur_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("✅ Cleaned blur.json")

if __name__ == '__main__':
    fix_gradient_json()
    fix_blur_json()
