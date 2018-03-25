var angular = require('angular');
require('truncate');
require('angular-animate');
require('angular-ui-router');
require('angular-cookies');
require('angularfire');
require('ari-ui-core');
require('./templates');
require('angulartics');
require('angulartics/src/angulartics-ga');

var app = angular.module('app', [
  'ngAnimate',
  'ui.router',
  'ari.ui.core',
  'ngCookies',
  'templates',
  'firebase',
  'angulartics',
  'angulartics.google.analytics'])
  .config(require('./routes'))
  .config(require('./config/analytics'))
  .config(require('./config/http'))
  .config(require('./config/sce'))
  .service('accountService',              require('./core/services/accountService'))
  .service('autherizationService',        require('./core/services/autherizationService'))
  .service('gameService',                 require('./core/services/gameService'))
  .service('gameQueueService',            require('./core/services/gameQueueService'))
  .service('jiraRestService',             require('./core/services/jiraRestService'))
  .service('loginService',                require('./core/services/loginService'))
  .service('principalService',            require('./core/services/principalService'))
  .service('teamService',                 require('./core/services/teamService'))
  .controller('AppController',            require('./components/app/controller'))
  .controller('DashboardController',      require('./components/dashboard/controller'))
  .controller('LoginController',          require('./components/login/controller'))
  .controller('ResetPasswordController',  require('./components/resetPassword/controller'))
  .controller('TeamsController',          require('./components/teams/controller'))
  .controller('TeamModalController',      require('./components/teams/modalController'))
  .controller('CreateGameController',     require('./components/createGame/controller'))
  .controller('PlayGameController',       require('./components/playGame/controller'))
  .controller('StoriesController',        require('./components/stories/controller'))
  .controller('UserProfileController',    require('./components/users/controller'))
  .directive('busyIndicator',             require('./directives/busyindicator'))
  .directive('selectText',             require('./directives/selectText'))
  .run(['$rootScope', '$state', '$stateParams', 'autherizationService', 'principalService',
    function($rootScope, $state, $stateParams, authorizationService, principalService) {

      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        // Track the state the user wants to go to, for authorization service
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (!principalService.isAuthenticated() && !toState.anonymous) {
          $state.transitionTo('app.login')
          event.preventDefault();
        }

        // If the principal is resolved, do an authorization check immediately.
        // Otherwise, it'll be done when the state it resolved.
        if (principalService.isIdentityResolved()) {
          authorizationService.authorize();
        }
      });
    }
  ]);

module.exports = app;
