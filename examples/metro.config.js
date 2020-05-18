/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: process.env.RN_BUNDLE_TYPE === 'E2E'
      ? ['e2e.ts', 'e2e.js', 'ts', 'js', 'tsx', 'jsx', 'json']
      : ['ts', 'js', 'tsx', 'jsx', 'json'],
  },
};
