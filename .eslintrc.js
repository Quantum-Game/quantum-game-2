module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/airbnb', '@vue/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-tabs': 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
