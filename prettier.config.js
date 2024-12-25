// Must reload window to apply config

/** @type {import("prettier").Config} */
const config = {
  // Standard prettier options
  // Override options of prettier extension
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  // Since prettier 3.0, manually specifying plugins is required
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  // This plugin's options
  importOrder: [
    '^react',
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[.~].*/([A-Z].*)$',
    '',
    '^[.~].*/([a-z].*)$'
  ]
}

export default config
