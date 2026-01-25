#!/usr/bin/env python3
"""
CSS to Style Dictionary Converter
Converts CSS custom properties (variables) to Style Dictionary JSON format.

Usage:
    python css-to-style-dictionary.py input.css [output_dir]
"""

import re
import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Tuple

# Token type mapping based on prefix
TOKEN_TYPE_MAP = {
    'font': 'fontFamily',
    'text': 'dimension',
    'color': 'color',
    'shadow': 'boxShadow',
    'radius': 'borderRadius',
    'spacing': 'spacing',
    'breakpoint': 'dimension',
    'max': 'dimension',
    'animate': 'other',
    'drop': 'boxShadow',
    'background': 'color',
    'border': 'color',
    'ring': 'color',
    'outline': 'color',
}


def parse_css_value(value: str) -> Tuple[str, str]:
    """Parse CSS value and determine its type."""
    value = value.strip()
    
    # Check if it's a reference to another variable
    var_match = re.match(r'^var\(--([^)]+)\)$', value)
    if var_match:
        ref_path = var_match.group(1).replace('-', '.')
        return f'{{{ref_path}}}', 'reference'
    
    # Composite var references (like shadow with multiple vars)
    if 'var(--' in value:
        # Replace all var(--xxx) with {xxx}
        def replace_var(m):
            return '{' + m.group(1).replace('-', '.') + '}'
        processed = re.sub(r'var\(--([^)]+)\)', replace_var, value)
        return processed, 'composite'
    
    if value.startswith('calc('):
        return value, 'dimension'
    
    if value.startswith('rgb'):
        return value, 'color'
    
    if re.match(r'^#[0-9a-fA-F]{3,8}$', value):
        return value, 'color'
    
    if re.match(r'^-?[\d.]+(?:px|rem|em|%|vh|vw)$', value):
        return value, 'dimension'
    
    if re.match(r'^-?[\d.]+$', value):
        return value, 'number'
    
    if ',' in value and any(x in value.lower() for x in ['sans', 'mono', 'serif', 'system']):
        return value, 'fontFamily'
    
    if 'rgba' in value or ('px' in value and 'rgb' in value):
        return value, 'boxShadow'
    
    return value, 'other'


def css_var_to_path(var_name: str) -> List[str]:
    """Convert CSS variable name to nested path."""
    name = var_name.lstrip('-')
    return name.split('-')


def set_nested_value(obj: Dict, path: List[str], value: Any):
    """Set a value in a nested dictionary structure."""
    current = obj
    for key in path[:-1]:
        if key not in current:
            current[key] = {}
        elif not isinstance(current[key], dict):
            current[key] = {'_value': current[key]}
        current = current[key]
    
    final_key = path[-1]
    if final_key in current and isinstance(current[final_key], dict) and 'value' not in current[final_key]:
        current[final_key]['value'] = value['value']
        current[final_key]['type'] = value['type']
    else:
        current[final_key] = value


def determine_token_type(var_name: str, value: str) -> str:
    """Determine the token type based on variable name and value."""
    parts = var_name.lstrip('-').split('-')
    
    for prefix, token_type in TOKEN_TYPE_MAP.items():
        prefix_parts = prefix.split('-')
        if parts[:len(prefix_parts)] == prefix_parts:
            return token_type
    
    _, value_type = parse_css_value(value)
    if value_type not in ['reference', 'composite', 'other']:
        return value_type
    
    # Default based on content
    if 'color' in var_name.lower() or 'bg' in var_name.lower() or 'fg' in var_name.lower():
        return 'color'
    
    return 'other'


def extract_balanced_block(content: str, start_keyword: str) -> str:
    """Extract a balanced {} block after a keyword."""
    pattern = re.escape(start_keyword) + r'\s*\{'
    match = re.search(pattern, content)
    if not match:
        return ''
    
    start = match.end()
    depth = 1
    i = start
    
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
    
    return content[start:i-1] if depth == 0 else ''


def parse_css_variables(content: str) -> Dict[str, str]:
    """Parse CSS variables from content, handling multi-line values."""
    variables = {}
    
    # Remove @keyframes blocks first (they're not variables)
    content = re.sub(r'@keyframes\s+\w+\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}', '', content, flags=re.DOTALL)
    
    # Match CSS custom properties
    # This handles multi-line values and complex expressions
    pattern = r'--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        var_name = match.group(1).strip()
        var_value = ' '.join(match.group(2).split())  # Normalize whitespace
        variables[var_name] = var_value
    
    return variables


def convert_to_style_dictionary(variables: Dict[str, str]) -> Dict[str, Any]:
    """Convert CSS variables to Style Dictionary format."""
    result = {}
    
    for var_name, var_value in variables.items():
        path = css_var_to_path(var_name)
        processed_value, _ = parse_css_value(var_value)
        token_type = determine_token_type(var_name, var_value)
        
        token = {
            'value': processed_value,
            'type': token_type
        }
        
        set_nested_value(result, path, token)
    
    return result


def categorize_tokens(tokens: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Categorize tokens into separate files."""
    categories = {
        'color': {},
        'typography': {},
        'effect': {},
        'dimension': {},
        'animation': {},
    }
    
    for key, value in tokens.items():
        key_lower = key.lower()
        
        if key_lower in ['color', 'utility']:
            categories['color'][key] = value
        elif key_lower in ['text', 'border', 'fg', 'bg', 'ring', 'outline', 'background']:
            # These are semantic color tokens
            if 'color' not in categories['color']:
                categories['color']['color'] = {}
            categories['color']['color'][key] = value
        elif key_lower in ['font', 'typography']:
            categories['typography'][key] = value
        elif key_lower in ['shadow', 'drop']:
            categories['effect'][key] = value
        elif key_lower in ['radius', 'max', 'breakpoint', 'spacing']:
            categories['dimension'][key] = value
        elif key_lower in ['animate']:
            categories['animation'][key] = value
        else:
            categories['dimension'][key] = value
    
    return {k: v for k, v in categories.items() if v}


def main():
    if len(sys.argv) < 2:
        print("Usage: python css-to-style-dictionary.py <input.css> [output_dir]")
        print("  If output_dir is not specified, outputs to ./tokens-converted/")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else './tokens-converted'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"📖 Reading: {input_file}")
    print(f"   File size: {len(content)} characters")
    
    # Extract @theme block
    theme_content = extract_balanced_block(content, '@theme')
    print(f"   @theme block: {len(theme_content)} characters")
    
    # Parse variables from theme
    light_vars = parse_css_variables(theme_content) if theme_content else parse_css_variables(content)
    print(f"   Found {len(light_vars)} CSS variables")
    
    # Extract dark mode
    dark_content = extract_balanced_block(content, '.dark-mode')
    dark_vars = parse_css_variables(dark_content) if dark_content else {}
    print(f"   Found {len(dark_vars)} dark mode overrides")
    
    # Convert
    light_tokens = convert_to_style_dictionary(light_vars)
    categorized = categorize_tokens(light_tokens)
    
    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Write files
    for category, tokens in categorized.items():
        if tokens:
            output_file = os.path.join(output_dir, f'{category}.json')
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(tokens, f, indent=2, ensure_ascii=False)
            print(f"✅ Created: {output_file}")
    
    # Dark mode tokens
    if dark_vars:
        dark_tokens = convert_to_style_dictionary(dark_vars)
        dark_categorized = categorize_tokens(dark_tokens)
        for category, tokens in dark_categorized.items():
            dark_file = os.path.join(output_dir, f'{category}-dark.json')
            with open(dark_file, 'w', encoding='utf-8') as f:
                json.dump(tokens, f, indent=2, ensure_ascii=False)
            print(f"✅ Created: {dark_file} (dark mode)")
    
    print(f"\n🎉 Conversion complete! Files saved to: {output_dir}/")
    print("\n📝 Next steps:")
    print("   1. Review generated JSON files")
    print("   2. Copy desired files to tokens/ directory")
    print("   3. Run 'npm run build' to test")


if __name__ == '__main__':
    main()
