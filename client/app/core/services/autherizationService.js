var inject = ['$rootScope', '$state', 'principalService'];

/**
 * Firebase authorization service, to register and athenticate with firebase.
 * Simplified version of this http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
 * @param {object} $rootScope object
 * @param {object} $state (anuglar - ui router)
 */
var AutherizationService = function($rootScope, $state, principalService) {
  var service = this;

  service.authorize = function() {

    if ($rootScope.toState.name === "app.createAccount"
    || $rootScope.toState.name === "app.resetPassword"
    || $rootScope.toState.name === "app.login"
    || $rootScope.toState.name === "app.watch") {
      return; //Don't do any authorization check, or redirects...
    }

    var isAuthenticated = principalService.isAuthenticated();
    // Otherwise if the user is not authenticated, send them to login.
    if (!isAuthenticated) {
      $state.go('app.login');
    }
    return principalService.getUser().then(function(ident) {
      // Do security checks here, user in role etc, none of that for now...
    });
  }

  return service;
}

AutherizationService.$inject = inject;

module.exports = AutherizationService;
