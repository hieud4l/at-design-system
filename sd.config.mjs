/**
 * Style Dictionary v5 Configuration with Theme Support
 * @see https://styledictionary.com/versions/v5/
 */

// Custom CSS format for dark mode selector
const darkModeFormat = {
  name: 'css/dark-mode',
  format: ({ dictionary, options }) => {
    const header = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark Mode Theme Variables
 */

.dark-mode,
[data-theme="dark"] {`;

    const footer = `}`;

    const variables = dictionary.allTokens
      .map(token => `  --${token.name}: ${token.value};`)
      .join('\n');

    return header + '\n' + variables + '\n' + footer;
  }
};

// Custom CSS format for combined themes
const combinedThemeFormat = {
  name: 'css/themes',
  format: ({ dictionary, options, file }) => {
    const lightTokens = dictionary.allTokens.filter(t => !t.filePath.includes('dark'));
    const darkTokens = dictionary.allTokens.filter(t => t.filePath.includes('dark'));

    let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Design System Theme Variables
 */

:root {
`;

    output += lightTokens.map(t => `  --${t.name}: ${t.value};`).join('\n');
    output += '\n}\n\n';

    if (darkTokens.length > 0) {
      output += `.dark-mode,
[data-theme="dark"] {
`;
      output += darkTokens.map(t => `  --${t.name}: ${t.value};`).join('\n');
      output += '\n}\n';
    }

    return output;
  }
};

export default {
  // Source token files (exclude dark mode tokens)
  source: ['tokens/**/*.json', '!tokens/color/dark.json'],

  // Logging configuration - allow warnings instead of errors
  log: {
    warnings: 'warn', // Changed from 'error' to 'warn'
    verbosity: 'default',
    errors: {
      brokenReferences: 'warn' // Don't fail on broken references
    }
  },

  // Preprocessors (v5 feature)
  preprocessors: ['tokens-studio'],

  // Custom configuration
  hooks: {
    transforms: {
      'size/float': {
        type: 'value',
        transitive: true,
        filter: (token) => {
          // Only apply to dimension/size tokens, NOT color tokens
          const isColor = token.type === 'color' || token.path.includes('color');
          const isSize = ['dimension', 'fontSize', 'spacing', 'borderRadius', 'borderWidth'].includes(token.type) || token.path.includes('spacing');
          return isSize && !isColor;
        },
        transform: (token) => {
          const val = parseFloat(token.value);
          if (isNaN(val)) return token.value;
          return `${val.toFixed(2)}f`;
        }
      }
    },
    formats: {
      'css/dark-mode': darkModeFormat.format,
      'ios/custom-plist': ({ dictionary, options }) => {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!-- Do not edit directly, this file was auto-generated. -->
<plist version="1.0">
  <dict>`;
        const footer = `  </dict>\n</plist>`;

        const content = dictionary.allTokens
          .filter(token => token.value !== undefined && token.value !== null)
          .map(token => {
            let value = token.value;
            if (typeof value !== 'string') {
              value = String(value);
            }
            if (token.type === 'color' || token.path.includes('color')) {
              value = value.replace(/\s/g, '');
              const hexMatch = value.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
              if (hexMatch) {
                const r = parseInt(hexMatch[1], 16) / 255;
                const g = parseInt(hexMatch[2], 16) / 255;
                const b = parseInt(hexMatch[3], 16) / 255;
                const a = hexMatch[4] ? parseInt(hexMatch[4], 16) / 255 : 1;
                return `    <key>${token.name}</key>\n    <dict>\n      <key>r</key> <real>${r}</real>\n      <key>g</key> <real>${g}</real>\n      <key>b</key> <real>${b}</real>\n      <key>a</key> <real>${a}</real>\n    </dict>`;
              }
            }
            const num = parseFloat(value);
            if (!isNaN(num) && (token.type === 'dimension' || token.path.includes('spacing') || token.type === 'fontSize' || token.type === 'borderRadius')) {
              return `    <key>${token.name}</key>\n    <integer>${num}</integer>`;
            }
            return `    <key>${token.name}</key>\n    <string>${value}</string>`;
          }).join('\n');
        return header + '\n' + content + '\n' + footer;
      }
    }
  },

  // Platform-specific outputs
  platforms: {
    // Light theme CSS
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },

    // Dark theme CSS - uses dark tokens
    'css-dark': {
      transformGroup: 'css',
      buildPath: 'build/css/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: 'variables-dark.css',
          format: 'css/dark-mode',
          options: {
            outputReferences: true
          }
        }
      ]
    },

    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },

    // Dark SCSS
    'scss-dark': {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: '_variables-dark.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },

    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },

    // Dark mode JS
    'js-dark': {
      transformGroup: 'js',
      buildPath: 'build/js/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: 'tokens-dark.js',
          format: 'javascript/es6'
        }
      ]
    },

    json: {
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        }
      ]
    },

    'json-dark': {
      transformGroup: 'js',
      buildPath: 'build/json/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: 'tokens-dark.json',
          format: 'json/flat'
        }
      ]
    },

    // iOS Objective-C Header
    'ios-objc': {
      buildPath: 'build/ios/',
      transforms: ['attribute/cti', 'name/pascal', 'color/UIColor', 'size/float'],
      files: [
        {
          destination: 'StyleDictionary.h',
          format: 'ios/macros',
          options: {
            className: 'StyleDictionary'
          },
          filter: (token) => token.type !== 'fontFamily'
        }
      ]
    },

    // iOS Plist
    'ios-plist': {
      buildPath: 'build/ios/',
      transforms: ['attribute/cti', 'name/camel', 'color/hex'],
      files: [
        {
          destination: 'StyleDictionary.plist',
          format: 'ios/custom-plist',
          options: {
            className: 'StyleDictionary'
          },
          filter: (token) => token.type !== 'fontFamily'
        }
      ]
    },

    // iOS Swift
    'ios-swift': {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios-swift/',
      files: [
        {
          destination: 'StyleDictionary.swift',
          format: 'ios-swift/class.swift',
          options: {
            className: 'StyleDictionary'
          },
          filter: (token) => token.type !== 'fontFamily'
        }
      ]
    },

    // iOS SwiftUI
    'ios-swiftui': {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios-swiftui/',
      files: [
        {
          destination: 'StyleDictionary+Color.swift',
          format: 'ios-swift/class.swift',
          options: {
            className: 'StyleDictionaryColor',
            accessControl: 'public'
          },
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'StyleDictionary+Size.swift',
          format: 'ios-swift/class.swift',
          options: {
            className: 'StyleDictionarySize',
            accessControl: 'public'
          },
          filter: (token) => token.type === 'dimension' || token.path.includes('spacing')
        }
      ]
    },

    // Android Platform
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors'
        },
        {
          destination: 'dimens.xml',
          format: 'android/dimens'
        },
        {
          destination: 'font_dimens.xml',
          format: 'android/fontDimens'
        },
        {
          destination: 'integers.xml',
          format: 'android/integers'
        }
      ]
    },

    // Android Dark Theme
    'android-dark': {
      transformGroup: 'android',
      buildPath: 'build/android-night/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors'
        }
      ]
    },

    // Android Compose
    'compose': {
      transformGroup: 'compose',
      buildPath: 'build/compose/',
      files: [
        {
          destination: 'StyleDictionaryColor.kt',
          format: 'compose/object',
          options: {
            className: 'StyleDictionaryColor',
            packageName: 'com.yourapp.tokens'
          },
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'StyleDictionarySize.kt',
          format: 'compose/object',
          options: {
            className: 'StyleDictionarySize',
            packageName: 'com.yourapp.tokens'
          },
          filter: (token) => token.type === 'dimension' || token.path.includes('spacing')
        }
      ]
    },

    // Compose Dark Theme
    'compose-dark': {
      transformGroup: 'compose',
      buildPath: 'build/compose/',
      include: ['tokens/color/base.json', 'tokens/color/semantic.json'],
      source: ['tokens/color/dark.json'],
      files: [
        {
          destination: 'StyleDictionaryColorDark.kt',
          format: 'compose/object',
          options: {
            className: 'StyleDictionaryColorDark',
            packageName: 'com.yourapp.tokens'
          },
          filter: {
            type: 'color'
          }
        }
      ]
    }
  }
};
