module.exports = {
  root: false,
  plugins: ['detox'],
  env: {
    'jest/globals': true,
    'detox/detox': true,
  },
  rules: {
    'jest/consistent-test-it': [
      'error',
      {
        fn: 'test',
      },
    ],
  },
};
