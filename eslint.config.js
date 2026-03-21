// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig, {
    ignores: ['dist/*', 'node_modules/*', 'expo-env.d.ts'],

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // Imports
      // Enforces a consistent import order across all files:
      // 1. React  2. React Native  3. Expo packages  4. Internal (@/)
      // Blank lines are required between each group
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: 'react-native', group: 'external', position: 'before' },
            { pattern: 'expo*', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          // 'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Prevents importing the same module twice in the same file
      'import/no-duplicates': 'error',

      // TypeScript
      // Warns when a variable is declared but never used.
      // Variables prefixed with _ are intentionally ignored (e.g. _unused)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Off - TypeScript infers return types well enough without forcing
      // you to write them on every single function
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Off - React Native sometimes requires non-null assertions (!)
      // and forcing this off avoids constant false positives
      '@typescript-eslint/no-non-null-assertion': 'off',

      // React
      // Off - TypeScript interfaces already handle prop type checking,
      // so the React prop-types system is redundant here
      'react/prop-types': 'off',
      'react/display-name': 'off', // crashes ESLint v10 via getFilename bug in eslint-plugin-react

      // General
      // Warns on console.log (clean up before demo/submission)
      // but allows console.warn and console.error for legitimate debugging
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);