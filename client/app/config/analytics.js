function analyticsConfig($analyticsProvider) {
  // $analyticsProvider.withAutoBase(true);
}

analyticsConfig.$inject = ['$analyticsProvider'];

module.exports = analyticsConfig
