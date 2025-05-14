import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      semi: 'off',
      'babel/optional-chaining': 0,
      'no-restricted-globals': ['error', 'name', 'length'],
      'prefer-arrow-callback': 'error',
      'object-curly-spacing': 0,
      'comma-dangle': 0,
      'max-len': 0,
      'operator-linebreak': 0,
      'valid-jsdoc': 0,
      'require-jsdoc': 0,
      quotes: 0,
      'quote-props': 0,
      'new-cap': 0,
      'space-before-function-paren': 0,
      indent: 0,
    },
  },
])
