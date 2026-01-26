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
      }
    }
  }
};

// Light theme sources
const lightSources = [
  'tokens/blur.json',
  'tokens/color.json',
  'tokens/dimension.json',
  'tokens/gradient.json',
  'tokens/shadows.json',
  'tokens/strings.json',
  'tokens/typography.json'
];

// Dark theme sources (includes dark overrides)
const darkSources = [
  ...lightSources,
  'tokens-dark/color.json'
];

// Platform configurations factory
const createPlatforms = (theme) => ({
  css: {
    transformGroup: 'css',
    buildPath: `build/css/`,
    files: [
      {
        destination: `variables-${theme}.css`,
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }
    ]
  },

  scss: {
    transformGroup: 'scss',
    buildPath: `build/scss/`,
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
    buildPath: `build/js/`,
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
    buildPath: `build/json/`,
    files: [
      {
        destination: `tokens-${theme}.json`,
        format: 'json/flat'
      }
    ]
  },

  // iOS Objective-C Header
  [`ios-objc-${theme}`]: {
    buildPath: `build/ios/`,
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
    buildPath: `build/ios/`,
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
    buildPath: `build/ios-swift/`,
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
    buildPath: `build/ios-swiftui/`,
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
    buildPath: `build/android/`,
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
    buildPath: `build/compose/`,
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
