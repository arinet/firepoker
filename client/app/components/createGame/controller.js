'use strict';

var inject = ['$state', 'principalService', 'gameService', 'teamService', 'gameQueueService', '$modal'];

/**
 * Create Game Controller
 *
 * Creates a new firepoker game, and saves it back to firedb, and saves usesr info cookie.
 *
 * by - Don Waldo
 */
function CreateGameController($state, principalService, gameService, teamService, gameQueueService, $modal) {

  var vm = this;
  vm.user = null;
  vm.decks = null;
  vm.gameDeck = null;
  vm.gameDescription = "";
  vm.gameName = "";
  vm.stories = [];
  vm.teams = [];
  vm.team = null;

  init();

  vm.addStories = function() {
    var modalInstance = showStoriesModal();
    modalInstance.result.then(function(stories) {
      vm.stories = stories;
    });
  };

  vm.createGame = function() {
    var newGame = getNewGame();
    newGame.stories = vm.stories;
    saveGame(newGame);
    return newGame;
  };

  function showStoriesModal() {
    var opts = {
      size: 'lg',
      templateUrl: 'components/stories/index.html',
      controller: 'StoriesController',
      controllerAs: 'storyCtrl',
      backdrop:false,
      resolve: {
        'stories': function() {
          return vm.stories;
        },
        'team': function() {
          return vm.team;
        }
      }
    };
    return $modal.open(opts);
  };

  function getNewGame() {
    return {
      owner: vm.user.email,
      createdOn: new Date().getTime(),
      status: 'Queue',
      deck : vm.gameDeck,
      name : vm.gameName,
      description : vm.gameDescription,
      team: angular.copy(vm.team),
      $priority: vm.user.email.toLowerCase()
    };
  };

  function saveGame(newGame) {
    gameService.add(newGame).then(function(ref) {
      var gameId = ref.key();
      gameQueueService.add(newGame, gameId)
      $state.go('app.dashboard');
    });
  };

  function init() {
    principalService.getUser().then(function(user) {
      vm.user = user;
      teamService.init(user.email);
      gameService.init(user.email);
      gameQueueService.init(user.email);
      teamService.all(user.email).then(function(teams) {
        vm.teams = teams;
      });
      vm.decks = gameService.getPokerDecks();
    });
  };

  return vm;

}

CreateGameController.$inject = inject;

module.exports = CreateGameController;
