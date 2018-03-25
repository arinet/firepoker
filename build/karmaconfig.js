var Path = require('path');
var _ = require('underscore');
var args = BUILD_ARGS;

var filePatterns = [
  Path.join(process.cwd(), 'node_modules/angular/angular.js'),
  Path.join(process.cwd(), 'node_modules/angular-mocks/angular-mocks.js'),
  Path.join(process.cwd(), 'test/spec/setup.coffee'),
  Path.join(process.cwd(), 'test/spec/**/*.spec.coffee')
]

var filePreprocessors = _(filePatterns).reduce(function (memo, val) {
  var prep = ['webpack'];
  memo[val] = prep;
  return memo;
}, {});

module.exports = function(config) {
  config.set({

    singleRun: true,

    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'sinon-chai'
    ],

    browsers: ['PhantomJS'],

    files: filePatterns,

    preprocessors: filePreprocessors,

    webpack: require('./webpack/test'),

    reporters: args.reporter.split(','),

    coverageReporter: {
      dir: './client/test/reports/coverage',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ]
    },

    webpackMiddleware: { noInfo: true },

    colors: (args.color === false || args.colors === false) ? false : true,

    plugins: [
      'karma-webpack',
      'karma-chai-plugins',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-nyan-reporter',
      'karma-notify-reporter',
      'karma-coverage',
    ]
  });
}
