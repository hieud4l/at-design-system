/**
 * Style Dictionary v5 Configuration - Dark Theme
 * @see https://styledictionary.com/versions/v5/
 */

export default {
    // Source token files - includes dark overrides
    source: [
        'tokens/blur.json',
        'tokens/color.json',
        'tokens/dimension.json',
        'tokens/gradient.json',
        'tokens/shadows.json',
        'tokens/strings.json',
        'tokens/typography.json',
        'tokens-dark/color.json'
    ],

    // Logging configuration
    log: {
        warnings: 'warn',
        verbosity: 'default',
        errors: {
            brokenReferences: 'warn'
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
                    return `  --${token.name}: ${token.value};`;
                }).join('\n') + `\n}`;
            }
        }
    },

    // Platform-specific outputs
    platforms: {
        css: {
            transformGroup: 'css',
            buildPath: 'build/css/',
            files: [
                {
                    destination: 'variables-dark.css',
                    format: 'css/variables-themed',
                    options: {
                        outputReferences: true,
                        selector: '[data-theme="dark"]'
                    }
                }
            ]
        },

        scss: {
            transformGroup: 'scss',
            buildPath: 'build/scss/',
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
                    destination: 'tokens-dark.js',
                    format: 'javascript/es6'
                },
                {
                    destination: 'tokens-dark.d.ts',
                    format: 'typescript/es6-declarations'
                }
            ]
        },

        json: {
            transformGroup: 'js',
            buildPath: 'build/json/',
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
                    destination: 'StyleDictionary-dark.h',
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
                    destination: 'StyleDictionary-dark.plist',
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
                    destination: 'StyleDictionary-dark.swift',
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
                    destination: 'StyleDictionary+Color-dark.swift',
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
                    destination: 'StyleDictionary+Size-dark.swift',
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
                    destination: 'colors-dark.xml',
                    format: 'android/colors'
                },
                {
                    destination: 'dimens-dark.xml',
                    format: 'android/dimens'
                },
                {
                    destination: 'font_dimens-dark.xml',
                    format: 'android/fontDimens'
                },
                {
                    destination: 'integers-dark.xml',
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
                    destination: 'StyleDictionaryColor-dark.kt',
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
                    destination: 'StyleDictionarySize-dark.kt',
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
