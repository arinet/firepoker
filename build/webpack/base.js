var Path = require('path');
var webpack = require('webpack');
var _ = require('underscore');
_.mixin({ deepExtend: require('deepextend') });

var unprocessedAliases =  require('./aliases');
var npmAliases = _(unprocessedAliases.npm).reduce(resolveFolder('node_modules'), {});
var aliases = _.extend({},  npmAliases, unprocessedAliases.other);

var baseConfig = {
  entry: "./client/app/appEntry",
  output: {
      path: Path.join(process.cwd(), 'dist', 'js'),
      filename: "[name].bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.coffee', '.json'],
    alias: aliases
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee?bare' },
	    { test: /angularfire\.js$/, loader: 'imports?Firebase=firebase' },
	    { test: /angular\.js$/, loader: 'imports?jQuery=jquery!exports?window.angular' },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      FIREBASE_URL: JSON.stringify(process.env.FIREBASE_URL),
      JIRA_URL: JSON.stringify(process.env.JIRA_URL)
    }),
    new webpack.ProvidePlugin({
        angular: 'angular',
        jQuery: 'jquery',
	      Firebase : 'firebase',
        'window.jQuery': 'jquery'
    }),
  ],
	devtool:  'source-map' //: 'eval'
};

module.exports = {
  base: baseConfig,
  utils: {
    extendConfig: extendConfig
  }
};

function extendConfig(conf) {
  var args = _(arguments).toArray();
  args.unshift({});
  return _.deepExtend.apply(_, args);
}

function resolveFolder(folder) {
  return function(memo, file, key) {
    memo[key] = Path.join(process.cwd(), folder, file);
    return memo;
  }
}
