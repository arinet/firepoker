var SceConfig = function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://arinet*.atlassian.net/**'
  ]);
};

SceConfig.$inject = ['$sceDelegateProvider'];

module.exports = SceConfig;
