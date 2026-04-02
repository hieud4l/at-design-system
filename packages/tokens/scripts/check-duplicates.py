#!/usr/bin/env python3
"""
Script to check for duplicate tokens in the design system.
Scans both JSON token files and built CSS files.
"""

import json
import os
import re
from collections import Counter

TOKENS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tokens')
BUILD_DIR = os.path.join(os.path.dirname(__file__), '..', 'build')

def flatten_tokens(obj, prefix=''):
    """Recursively flatten nested token objects into a list of full paths"""
    tokens = []
    if isinstance(obj, dict):
        if 'value' in obj and 'type' in obj:
            # This is a token
            tokens.append(prefix)
        else:
            for key, value in obj.items():
                new_prefix = f"{prefix}.{key}" if prefix else key
                tokens.extend(flatten_tokens(value, new_prefix))
    return tokens

def find_duplicate_tokens():
    """Find duplicate token names across all JSON files"""
    all_tokens = []
    
    for filename in os.listdir(TOKENS_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(TOKENS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Remove _comment if exists
            if '_comment' in data:
                del data['_comment']
            
            tokens = flatten_tokens(data)
            for token in tokens:
                all_tokens.append((token, filename))
    
    # Get just the final token name (last part of path)
    token_names = [t[0].split('.')[-1] for t in all_tokens]
    duplicates = [item for item, count in Counter(token_names).items() if count > 1]
    
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate token names:")
        for dup in duplicates[:20]:  # Show first 20
            matching = [t for t in all_tokens if t[0].split('.')[-1] == dup]
            print(f"\n  '{dup}' appears {len(matching)} times:")
            for token_path, filename in matching:
                print(f"    - {filename}: {token_path}")
        
        if len(duplicates) > 20:
            print(f"\n  ... and {len(duplicates) - 20} more duplicates")
        
        return duplicates
    else:
        print("\n✅ No duplicate token names found in JSON files!")
        return []

def check_css_duplicates(css_file):
    """Check for duplicate CSS variable names"""
    if not os.path.exists(css_file):
        print(f"  File not found: {css_file}")
        return []
    
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract CSS variable names
    variables = re.findall(r'--([a-zA-Z0-9_-]+):', content)
    duplicates = [item for item, count in Counter(variables).items() if count > 1]
    
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate CSS variables in {os.path.basename(css_file)}:")
        for dup in duplicates[:10]:
            count = variables.count(dup)
            print(f"    --{dup} (appears {count} times)")
        return duplicates
    else:
        print(f"  ✅ No duplicate CSS variables in {os.path.basename(css_file)}")
        return []

def analyze_token_structure():
    """Analyze the overall structure of tokens"""
    print("\n📊 Token Structure Analysis:")
    
    for filename in os.listdir(TOKENS_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(TOKENS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if '_comment' in data:
                del data['_comment']
            
            tokens = flatten_tokens(data)
            
            # Group by top-level category
            categories = {}
            for token in tokens:
                parts = token.split('.')
                if len(parts) >= 2:
                    cat = f"{parts[0]}.{parts[1]}"
                else:
                    cat = parts[0]
                categories[cat] = categories.get(cat, 0) + 1
            
            print(f"\n  {filename} ({len(tokens)} tokens):")
            for cat, count in sorted(categories.items()):
                print(f"    - {cat}: {count} tokens")

def main():
    print("=" * 60)
    print("Checking for duplicate tokens in AT-DesignSystem")
    print("=" * 60)
    
    # Check JSON token duplicates
    print("\n1. Checking JSON token files...")
    duplicates = find_duplicate_tokens()
    
    # Check CSS duplicates
    print("\n2. Checking built CSS files...")
    css_files = [
        os.path.join(BUILD_DIR, 'css', 'variables.css'),
        os.path.join(BUILD_DIR, 'css', 'variables-dark.css')
    ]
    css_duplicates = []
    for css_file in css_files:
        css_duplicates.extend(check_css_duplicates(css_file))
    
    # Analyze structure
    analyze_token_structure()
    
    # Summary
    print("\n" + "=" * 60)
    if not duplicates and not css_duplicates:
        print("✅ All checks passed! No duplicates found.")
    else:
        print(f"⚠️  Found issues:")
        if duplicates:
            print(f"   - {len(duplicates)} duplicate token names in JSON")
        if css_duplicates:
            print(f"   - {len(css_duplicates)} duplicate CSS variables")
    print("=" * 60)

if __name__ == '__main__':
    main()
