// .eslintrc.cjs

const reactPlugin = require('eslint-plugin-react');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');


module.exports = [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // 启用 JSX 支持
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        WeixinJSBridge: 'readonly',
        aplus_queue: 'readonly',
        dd: 'readonly',
        execSync: 'readonly',
        define: 'readonly',
        childProcess: 'readonly',
      }

    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': typescriptPlugin,
    },

    rules: {
      'no-console': 'off',
      'no-undef': 'error', // 检查未定义的变量
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
