#!/usr/bin/env python3
"""
Script to refine shadows.json by flattening the shadow.shadows structure
and removing redundant prefixes.
"""

import json
import os

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')

def fix_shadows_json():
    shadows_file = os.path.join(TOKENS_DIR, 'shadows.json')
    if not os.path.exists(shadows_file):
        print(f"File not found: {shadows_file}")
        return
        
    with open(shadows_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'shadow' not in data:
        return

    shadow_data = data['shadow']
    new_shadow_data = {}

    # Handle standard shadows and portfolio-mockups
    if 'shadows' in shadow_data:
        inner_shadows = shadow_data.pop('shadows')
        
        for key, value in inner_shadows.items():
            if key == 'portfolio-mockups':
                # Handle portfolio-mockups category
                new_mockups = {}
                for m_key, m_value in value.items():
                    # Remove 'shadow-' prefix from mockups if it exists (though plan didn't explicitly mention inner mockups, it's consistent)
                    new_m_key = m_key.replace('shadow-', '')
                    new_mockups[new_m_key] = m_value
                new_shadow_data['portfolio-mockups'] = new_mockups
            else:
                # Remove 'shadow-' prefix from basic shadows
                new_key = key.replace('shadow-', '')
                if new_key:
                    new_shadow_data[new_key] = value

    # Handle focus-rings
    if 'focus-rings' in shadow_data:
        inner_focus = shadow_data.pop('focus-rings')
        new_focus = {}
        for key, value in inner_focus.items():
            # Remove 'focus-ring-' prefix and 'shadow-' prefix
            cleaned = key.replace('focus-ring-', '').replace('shadow-', '')
            if cleaned == 'focus-ring':
                cleaned = 'standard'
            new_focus[cleaned] = value
        new_shadow_data['focus-rings'] = new_focus

    # Preserve other categories if any
    for k, v in shadow_data.items():
        new_shadow_data[k] = v

    data['shadow'] = new_shadow_data
    
    with open(shadows_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("✅ Refined shadows.json")

if __name__ == '__main__':
    fix_shadows_json()
