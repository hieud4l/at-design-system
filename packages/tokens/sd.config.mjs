/**
 * Style Dictionary v5 Configuration with Light and Dark themes
 * @see https://styledictionary.com/versions/v5/
 */

// Shared configuration
const sharedConfig = {
  log: {
    warnings: 'warn',
    verbosity: 'default',
    errors: {
      brokenReferences: 'warn'
    }
  },
  preprocessors: ['tokens-studio'],
  hooks: {
    transforms: {
      'size/float': {
        type: 'value',
        transitive: true,
        filter: (token) => {
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
      },
      'css/variables-themed': ({ dictionary, options, file }) => {
        const selector = options.selector || ':root';
        return `${selector} {\n` + dictionary.allTokens.map(token => {
          let value = token.value;
          if (options.outputReferences && dictionary.usesReference(token.original.value)) {
            const refs = dictionary.getReferences(token.original.value);
            refs.forEach(ref => {
              value = value.replace(ref.value, `var(--${ref.name})`);
            });
          }
          return `  --${token.name}: ${value};`;
        }).join('\n') + `\n}`;
      }
    }
  }
};

// Base tokens - shared across all themes
const baseSources = [
  'src/base/color-primitives.json',
  'src/base/dimension.json',
  'src/base/typography.json',
  'src/base/blur.json',
  'src/base/strings.json',
  'src/base/gradient.json'
];

// Light theme sources
const lightSources = [
  ...baseSources,
  'src/themes/light/color-semantic.json',
  'src/themes/light/shadows.json'
];

// Dark theme sources (includes dark overrides)
const darkSources = [
  ...baseSources,
  'src/themes/dark/color-semantic.json',
  'src/themes/dark/shadows.json'
];

// Platform configurations factory
const createPlatforms = (theme) => ({
  css: {
    transformGroup: 'css',
    buildPath: `dist/css/`,
    files: [
      {
        destination: `variables-${theme}.css`,
        format: 'css/variables-themed',
        options: {
          outputReferences: true,
          selector: theme === 'dark' ? '[data-theme="dark"]' : ':root, [data-theme="light"]'
        }
      }
    ]
  },

  scss: {
    transformGroup: 'scss',
    buildPath: `dist/scss/`,
    files: [
      {
        destination: `_variables-${theme}.scss`,
        format: 'scss/variables',
        options: {
          outputReferences: true
        }
      }
    ]
  },

  js: {
    transformGroup: 'js',
    buildPath: `dist/js/`,
    files: [
      {
        destination: `tokens-${theme}.js`,
        format: 'javascript/es6'
      },
      {
        destination: `tokens-${theme}.d.ts`,
        format: 'typescript/es6-declarations'
      }
    ]
  },

  json: {
    transformGroup: 'js',
    buildPath: `dist/json/`,
    files: [
      {
        destination: `tokens-${theme}.json`,
        format: 'json/flat'
      }
    ]
  },

  // iOS Objective-C Header
  [`ios-objc-${theme}`]: {
    buildPath: `dist/ios/`,
    transforms: ['attribute/cti', 'name/pascal', 'color/UIColor', 'size/float'],
    files: [
      {
        destination: `StyleDictionary-${theme}.h`,
        format: 'ios/macros',
        options: {
          className: 'StyleDictionary'
        },
        filter: (token) => token.type !== 'fontFamily'
      }
    ]
  },

  // iOS Plist
  [`ios-plist-${theme}`]: {
    buildPath: `dist/ios/`,
    transforms: ['attribute/cti', 'name/camel', 'color/hex'],
    files: [
      {
        destination: `StyleDictionary-${theme}.plist`,
        format: 'ios/custom-plist',
        options: {
          className: 'StyleDictionary'
        },
        filter: (token) => token.type !== 'fontFamily'
      }
    ]
  },

  // iOS Swift
  [`ios-swift-${theme}`]: {
    transformGroup: 'ios-swift',
    buildPath: `dist/ios-swift/`,
    files: [
      {
        destination: `StyleDictionary-${theme}.swift`,
        format: 'ios-swift/class.swift',
        options: {
          className: 'StyleDictionary'
        },
        filter: (token) => token.type !== 'fontFamily'
      }
    ]
  },

  // iOS SwiftUI
  [`ios-swiftui-${theme}`]: {
    transformGroup: 'ios-swift',
    buildPath: `dist/ios-swiftui/`,
    files: [
      {
        destination: `StyleDictionary+Color-${theme}.swift`,
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
        destination: `StyleDictionary+Size-${theme}.swift`,
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
  [`android-${theme}`]: {
    transformGroup: 'android',
    buildPath: `dist/android/`,
    files: [
      {
        destination: `colors-${theme}.xml`,
        format: 'android/colors'
      },
      {
        destination: `dimens-${theme}.xml`,
        format: 'android/dimens'
      },
      {
        destination: `font_dimens-${theme}.xml`,
        format: 'android/fontDimens'
      },
      {
        destination: `integers-${theme}.xml`,
        format: 'android/integers'
      }
    ]
  },

  // Android Compose
  [`compose-${theme}`]: {
    transformGroup: 'compose',
    buildPath: `dist/compose/`,
    files: [
      {
        destination: `StyleDictionaryColor-${theme}.kt`,
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
        destination: `StyleDictionarySize-${theme}.kt`,
        format: 'compose/object',
        options: {
          className: 'StyleDictionarySize',
          packageName: 'com.yourapp.tokens'
        },
        filter: (token) => token.type === 'dimension' || token.path.includes('spacing')
      }
    ]
  }
});

// Export array of configurations for multiple theme builds
export default [
  {
    ...sharedConfig,
    source: lightSources,
    platforms: createPlatforms('light')
  },
  {
    ...sharedConfig,
    source: darkSources,
    platforms: createPlatforms('dark')
  }
];
