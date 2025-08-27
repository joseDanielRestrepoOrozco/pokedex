import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    plugins: { js, '@stylistic': stylistic },
    extends: ['js/recommended', "plugin:vitest-globals/recommended"],
    env: {
      "vitest-globals/env": true
    },
    languageOptions: { globals: globals.browser },
    rules: { '@stylistic/indent': ['error', 2]}
  }
])
