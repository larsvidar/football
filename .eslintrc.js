module.exports = {
	env: {
		'browser': true,
		'es2021': true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals'
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	plugins: [
		'react',
		'@typescript-eslint'
	],
	rules: {
		indent: ['warn', 'tab'],
		quotes: ['warn', 'single'],
		semi: ['warn', 'always'],
		'linebreak-style': ['warn', 'unix'],
		'react-hooks/exhaustive-deps': ['off'],
		'@next/next/no-img-element': ['off'],
		'@typescript-eslint/explicit-function-return-type': ['warn'],
		'no-mixed-spaces-and-tabs': ['warn'],
		'prefer-const': ['warn'],
	}
};
