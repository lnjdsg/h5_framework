const reactPlugin = require('eslint-plugin-react');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['**/app.jsx', '**/modal.jsx'], // 忽略指定文件
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
        wx: 'readonly',
        getUrlParam: 'readonly',
        AMap: 'readonly',
        pagehidden: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': typescriptPlugin,
      'import': require('eslint-plugin-import'), // 加载 eslint-plugin-import 插件
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'error', // 检查未定义的变量
      'import/no-unresolved': 'error', // 检查导入的文件路径是否有效
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        alias: {
          map: [
            ['@src', './src'], // 映射 @src 到 ./src
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // 支持的文件扩展名
        },
      },
    },
  },
];
