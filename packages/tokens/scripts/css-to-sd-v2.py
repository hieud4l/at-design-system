#!/usr/bin/env python3
"""
CSS to Style Dictionary Converter V2
Converts CSS custom properties to Style Dictionary JSON with resolved values.
"""

import re
import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Tuple


def parse_css_variables(content: str) -> Dict[str, str]:
    """Parse CSS variables from content."""
    variables = {}
    content = re.sub(r'@keyframes\s+\w+\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'/\*[^*]*\*/', '', content, flags=re.DOTALL)
    
    pattern = r'--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);'
    for match in re.finditer(pattern, content, re.DOTALL):
        var_name = match.group(1).strip()
        var_value = ' '.join(match.group(2).split())
        variables[var_name] = var_value
    
    return variables


def resolve_references(variables: Dict[str, str]) -> Dict[str, str]:
    """Resolve CSS var() references to actual values."""
    resolved = {}
    
    def resolve_value(value: str, depth: int = 0) -> str:
        if depth > 10:
            return value
        
        def replace_var(match):
            var_name = match.group(1)
            fallback = match.group(2) if match.group(2) else None
            
            if var_name in variables:
                resolved_val = resolve_value(variables[var_name], depth + 1)
                return resolved_val
            elif fallback:
                return fallback.strip()
            else:
                return match.group(0)
        
        pattern = r'var\(--([a-zA-Z0-9_-]+)(?:\s*,\s*([^)]+))?\)'
        return re.sub(pattern, replace_var, value)
    
    for name, value in variables.items():
        resolved[name] = resolve_value(value)
    
    return resolved


def determine_type(name: str, value: str) -> str:
    """Determine token type from name and value."""
    name_lower = name.lower()
    
    if 'font' in name_lower and ('body' in name_lower or 'display' in name_lower or 'mono' in name_lower):
        return 'fontFamily'
    if 'font' in name_lower:
        return 'fontFamily'
    if 'shadow' in name_lower or 'drop' in name_lower:
        return 'boxShadow'
    if 'radius' in name_lower:
        return 'borderRadius'
    if 'color' in name_lower or 'bg' in name_lower or 'fg' in name_lower or 'border' in name_lower:
        return 'color'
    if value.startswith('rgb') or value.startswith('#'):
        return 'color'
    if 'px' in value or 'rem' in value or 'em' in value or value.startswith('calc('):
        return 'dimension'
    
    return 'other'


def build_nested_structure(variables: Dict[str, str]) -> Dict[str, Any]:
    """Build nested JSON structure from flat variables."""
    result = {}
    
    for name, value in variables.items():
        parts = name.split('-')
        token_type = determine_type(name, value)
        
        current = result
        for i, part in enumerate(parts[:-1]):
            if part not in current:
                current[part] = {}
            elif not isinstance(current[part], dict):
                temp_val = current[part]
                current[part] = {'_self': temp_val}
            current = current[part]
        
        final_part = parts[-1]
        if final_part in current and isinstance(current[final_part], dict):
            current[final_part]['value'] = value
            current[final_part]['type'] = token_type
        else:
            current[final_part] = {
                'value': value,
                'type': token_type
            }
    
    return result


def categorize_tokens(flat_vars: Dict[str, str]) -> Dict[str, Dict[str, str]]:
    """Categorize tokens by type prefix."""
    categories = {
        'color': {},
        'typography': {},
        'effect': {},
        'dimension': {},
        'animation': {},
    }
    
    for name, value in flat_vars.items():
        parts = name.split('-')
        first = parts[0].lower()
        
        if first == 'color' or first in ['text', 'border', 'bg', 'fg', 'ring', 'outline', 'background', 'utility']:
            categories['color'][name] = value
        elif first == 'font':
            categories['typography'][name] = value
        elif first == 'shadow' or first == 'drop':
            categories['effect'][name] = value
        elif first in ['radius', 'max', 'breakpoint', 'spacing']:
            categories['dimension'][name] = value
        elif first == 'animate':
            categories['animation'][name] = value
        elif first == 'text' and 'line-height' not in name and 'letter-spacing' not in name:
            categories['typography'][name] = value
        else:
            categories['dimension'][name] = value
    
    return {k: v for k, v in categories.items() if v}


def main():
    if len(sys.argv) < 2:
        print("Usage: python css-to-sd-v2.py <input.css> [output_dir]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else './tokens'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('\n', ' ').replace('\r', ' ')
    content = re.sub(r'\s+', ' ', content)
    
    print(f"📖 Reading: {input_file}")
    
    variables = parse_css_variables(content)
    print(f"   Found {len(variables)} CSS variables")
    
    resolved = resolve_references(variables)
    print(f"   Resolved references")
    
    categorized = categorize_tokens(resolved)
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    for category, cat_vars in categorized.items():
        nested = build_nested_structure(cat_vars)
        output_file = os.path.join(output_dir, f'{category}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(nested, f, indent=2, ensure_ascii=False)
        print(f"✅ Created: {output_file} ({len(cat_vars)} tokens)")
    
    print(f"\n🎉 Done! Files saved to: {output_dir}/")


if __name__ == '__main__':
    main()
