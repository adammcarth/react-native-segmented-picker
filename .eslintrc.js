module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  globals: {
    __DEV__: false,
  },
  rules: {
    'no-console': 'error',
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignorePattern: 'Navigation\.registerComponent.+',
        ignoreUrls: true,
      },
    ],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],
    '@typescript-eslint/no-misused-promises': 'off',
    'react/destructuring-assignment': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'lines-between-class-members': 'off',
    'class-methods-use-this': [
      'error',
      {
        'exceptMethods': [
          // React Methods
          'render',
          'componentDidMount',
          'shouldComponentUpdate',
          'getSnapshotBeforeUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch',
        ],
      },
    ],
    'jest/consistent-test-it': 'error',
    'react/static-property-placement': 0,
    'no-async-promise-executor': 0,
  },
};
