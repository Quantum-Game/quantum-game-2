module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript',
    '@vue/prettier',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
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
    'no-undef': 'off', // interferes with typescript `as const`
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-useless-constructor': 'off', // better covered by @typescript-eslint/no-useless-constructor
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-extra-semi': 'off', // sometimes in conflict with prettier
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    'vue/attribute-hyphenation': [
      'warn',
      'never',
      { ignore: ['text-anchor', 'clip-rule', 'clip-path-units', 'stroke-width'] },
    ],
    'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
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
