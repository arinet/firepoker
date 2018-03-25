var inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

//TODO: Check users authorization on route navigation
//http://stackoverflow.com/questions/24960288/angular-js-ui-router-how-to-redirect-to-a-child-state-from-a-parent

function RouteConfig(stateProvider, locationProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'components/app/index.html',
      controller: 'AppController',
      controllerAs: 'appCtrl',
      resolve: {
        authorize: ['autherizationService',
          function(authorization) {
            return authorization.authorize();
          }
        ]
      }
    })
    .state('app.dashboard', {
      url: '/',
      templateUrl: 'components/dashboard/index.html',
      controller: 'DashboardController',
      controllerAs: 'dashboardCtrl'
    })
    .state('app.login', {
      url: '/login',
      anonymous: true,
      templateUrl: 'components/login/index.html',
      controller: 'LoginController',
      controllerAs: 'loginCtrl'
    })
    .state('app.resetPassword', {
      url: '/reset',
      anonymous: true,
      templateUrl: 'components/resetPassword/index.html',
      controller: 'ResetPasswordController',
      controllerAs: 'rstPwrdCtrl'
    })
    .state('app.teams', {
      url: '/teams',
      templateUrl: 'components/teams/index.html',
      controller: 'TeamsController',
      controllerAs: 'teamsCtrl'
    })
    .state('app.create', {
      url: '/games/create',
      templateUrl: 'components/createGame/index.html',
      controller: 'CreateGameController',
      controllerAs: 'createCtrl'
    })
    .state('app.stories', {
      url: '/games/:gid/stories',
      templateUrl: 'components/stories/index.html',
      controller: 'StoriesController',
      controllerAs: 'storyCtrl'
    })
    .state('app.play', {
      url: '/games/:gid/play',
      templateUrl: 'components/playGame/index.html',
      controller: 'PlayGameController',
      controllerAs: 'playCtrl'
    })
    .state('app.watch', {
      url: '/games/:gid/watch',
      anonymous: true,
      templateUrl: 'components/playGame/index.html',
      controller: 'PlayGameController',
      controllerAs: 'playCtrl'
    })
    .state('app.userProfile', {
      url: '/profile',
      templateUrl: 'components/users/index.html',
      controller: 'UserProfileController',
      controllerAs: 'userCtrl'
    });

  locationProvider.html5Mode(true);
};

RouteConfig.$inject = inject;

module.exports = RouteConfig;
