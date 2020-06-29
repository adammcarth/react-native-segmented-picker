module.exports = {
  root: false,
  plugins: ['detox'],
  env: {
    'jest/globals': true,
    'detox/detox': true,
  },
  rules: {
    'no-console': 0,
    'jest/consistent-test-it': [
      'error',
      {
        fn: 'test',
      },
    ],
  },
};
