'use strict';

var injects = ['$state', 'principalService', 'gameService', 'gameQueueService', '$modal'];

var DashboardController = function($state, principalService, gameService, gameQueueService, $modal) {

  var vm = this;
  vm.user = null;
  vm.games = null;
  vm.gameQueue = null;
  vm.fromDate = new Date();
  vm.toDate = new Date();

  init();

  vm.addStories = function(game) {
    var modalInstance = showStoriesModal(game);
    modalInstance.result.then(function(stories) {
      game.stories = stories;
      game.status = "Stories Updated";
      gameService.save(game);
      gameQueueService.updateStatus(game, "Stories Updated - Play" );
    });
  };

  vm.delete = function(game) {
    gameQueueService.delete(angular.copy(game));
    gameService.delete(game);
  };

  vm.getPagedData = function(){
    gameService.getPagedData().then(function(games) {
      vm.games = games;
    });
  };

  vm.fetchByDate = function(){
    var startDate = Date.parse(vm.fromDate);
    var endDate = Date.parse(vm.toDate);
    gameService.fetchByDate(startDate, endDate).then(function(games){
      vm.games = games;
    });
  };

  vm.watchUrl = function(game) {
    game.shareLink = $state.href("app.watch", {gid: game.$id}, {absolute: true});
  }

  function showStoriesModal(game) {
    var opts = {
      size: 'lg',
      templateUrl: 'components/stories/index.html',
      controller: 'StoriesController',
      controllerAs: 'storyCtrl',
      backdrop:false,
      resolve: {
        'stories': function() {
          return game.stories;
        },
        'team': function() {
          return game.team;
        }
      }
    };
    return $modal.open(opts);
  };

  function init() {

    principalService.getUser().then(function(user) {
      vm.user = user;
      gameService.init(user.email);
      gameService.pageSize = 10;
      vm.getPagedData();
      gameQueueService.init(user.email);
      gameQueueService.all().then(function(gq) {
        vm.gameQueue = gq;
      });

    });
  };

  return vm;

}

DashboardController.$injects = injects;

module.exports = DashboardController;
