module.exports = {
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
  ],
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'global-require': 'error',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'typescript/no-var-requires': 'off',
        'unicorn/prevent-abbreviations': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/camelcase': 'off',
        'unicorn/prefer-exponentiation-operator', 'off'
        'unicorn/no-zero-fractions', 'off'
      },
    },
  ],
};
