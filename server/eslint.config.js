import js from '@eslint/js';

export default [
  { ignores: ['uploads'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        setInterval: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  }
];
