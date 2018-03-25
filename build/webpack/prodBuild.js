var config = require('./base');
var Path = require('path');
var StringReplacePlugin = require("string-replace-webpack-plugin");

var prodBuildConfig = config.utils.extendConfig(config.base, {
  module: {
    loaders: [{
      test: /.js$/,
      loader: StringReplacePlugin.replace({
        replacements: [{
          pattern: /https:\/\/ari-firepoker-reclus.firebaseio.com/ig,
          replacement: function(match, p1, offset, string) {
            return "https://ari-fire-comm-dev.firebaseio.com/";
          }
        }]
      })
    }]
  },
  plugins: [
    new StringReplacePlugin()
  ],
});

module.exports = prodBuildConfig;
