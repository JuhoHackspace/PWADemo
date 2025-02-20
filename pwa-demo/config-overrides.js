const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    assert: require.resolve('assert/'),
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );
  return config;
};