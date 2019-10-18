module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/recommended',
		'plugin:prettier/recommended',
		'@vue/airbnb',
		'@vue/typescript',
		'prettier',
		'prettier/@typescript-eslint',
		'prettier/babel',
		'prettier/unicorn',
		'prettier/vue'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		'import/no-extraneous-dependencies': [
			'error',
			{ devDependencies: true, optionalDependencies: false, peerDependencies: false }
		],
		'lines-between-class-members': [0, 'always', { exceptAfterSingleLine: true }]
	},
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		ecmaVersion: 2018
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}
		}
	}
};
