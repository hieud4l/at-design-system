/**
 * Style Dictionary v5 Configuration
 * @see https://styledictionary.com/versions/v5/
 */
export default {
  // Source token files
  source: ['tokens/**/*.json'],

  // Preprocessors (v5 feature)
  preprocessors: ['tokens-studio'],

  // Platform-specific outputs
  platforms: {
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

    // iOS Platform
    ios: {
      transformGroup: 'ios',
      buildPath: 'build/ios/',
      files: [
        {
          destination: 'StyleDictionary.h',
          format: 'ios/macros',
          options: {
            className: 'StyleDictionary'
          },
          filter: (token) => token.type !== 'fontFamily' // Exclude web font stacks
        },
        {
          destination: 'StyleDictionary.plist',
          format: 'ios/plist',
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
          filter: (token) => token.type !== 'fontFamily' // Exclude web font stacks
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
    }
  }
};
