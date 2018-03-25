var config = require('./base');
var Path = require('path');

var testConfig = config.utils.extendConfig(config.base, {
  externals: [{
    angular: true,
    'angular-mocks': true
  }],
  module :  {postLoaders: [ {
                test: /\.js$/,
                exclude: /(build|node_modules|vendor|test)/,
                loader: 'istanbul-instrumenter'
            } ]}
});

// Don't minify test output, (even on deploy)
testConfig.plugins.pop();

delete testConfig.output;
delete testConfig.devtool;

module.exports = testConfig;
