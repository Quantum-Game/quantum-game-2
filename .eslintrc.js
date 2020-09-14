module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'prettier/@typescript-eslint',
    '@vue/standard',
    '@vue/typescript',
    '@vue/prettier',
    'plugin:vue-scoped-css/recommended',
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // TODO: once we are ready to start force-migrating away from `I` prefix, enable this rule
    // '@typescript-eslint/naming-convention': [
    //   'warn',
    //   {
    //     selector: 'interface',
    //     format: ['PascalCase'],
    //     custom: {
    //       regex: "^I[A-Z]",
    //       match: false
    //     }
    //   }
    // ],
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-useless-constructor': 'off', // better covered by @typescript-eslint/no-useless-constructor
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
