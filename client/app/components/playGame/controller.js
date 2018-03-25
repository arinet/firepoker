var _ = require('underscore');
var inject = ['$state', 'principalService', 'gameService', 'gameQueueService', 'jiraRestService'];

/**
 * Play Game Controller
 *
 * Allows users to start playing the planning poker game.
 *
 * by Don W.
 */
function PlayGameController($state, principalService, gameService, gameQueueService, jiraApi) {

  var vm = this;
  vm.activeStory = null; //Note: Always update before using, firebase save() disassociates this obj.
  vm.activeStoryIdx = -1;
  vm.activeStoryPlayer = null;
  vm.activeStoryPlayerIdx = -1;
  vm.user = {};
  vm.decks = {};
  vm.isOwner = false;
  vm.showCards = false;
  vm.userComment = '';
  vm.name = '';
  vm.jiraUrl = gameService.jiraUrl;

  init();

  /**
   * Allows the game owner to accept the game.
   * Saves game story pointings back to Jira.
   * Sets appropriate queue statuses.
   */
  vm.acceptGame = function () {
    if (!vm.isOwner) {
      return;
    }
    haveAllPlayersPlayedAllStories();
    vm.game.status = "Accepted";
    vm.game.endedAt = new Date().getTime();
    angular.forEach(vm.game.stories, function (story) {
      if (isJiraStory(story)) {
        jiraApi.putStoryPoints(story.jiraKey, story.avgEstimate);
      }
    });
    gameService.save(vm.game);
    gameQueueService.delete(vm.game); //Remove from player queues...
    $state.go('app.dashboard');
  };

  vm.addComment = function (commentTxt) {
    vm.activeStory = getActiveStory();
    if (!vm.activeStory.comments) {
      vm.activeStory.comments = [];
    }
    var commentObj = {
      email: !vm.user.email ? "superAwesome@example.com" : vm.user.email,
      name: !vm.user.name ? vm.name.substr(0, 20) : vm.user.name,
      comment: commentTxt
    };
    vm.activeStory.comments.push(commentObj);
    if (isJiraStory(vm.activeStory)) {
      jiraApi.putComment(vm.activeStory.jiraKey, vm.user.name + " : " + commentTxt);
    }
    gameService.save(vm.game);
    vm.userComment = '';
  }

  /**
   * Sets the users estimate for the current story.
   * @param {points} story points
   */
  vm.estimate = function (points) {
    vm.activeStory = getActiveStory();
    vm.activeStoryPlayerIdx = getActiveStoryPlayerIdx(vm.activeStory);
    vm.activeStoryPlayer = vm.activeStory.players[vm.activeStoryPlayerIdx];
    vm.activeStoryPlayer.estimate = points;
    vm.activeStoryPlayer.played = true;
    vm.activeStory.avgEstimate = getActiveStoryAverageEstimate(vm.activeStory);
    gameService.save(vm.game);
    vm.refreshGame();
  };

  /**
   * Allows the game owner to accept a story.
   */
  vm.acceptStory = function () {
    if (!vm.isOwner) {
      return;
    }
    hasPlayerPlayedAllStories();
    vm.activeStory = getActiveStory();
    vm.activeStory.accepted = true;
    gameService.save(vm.game);
    vm.refreshGame();
  };

  vm.setActiveStory = function (idx) {
    vm.activeStoryIdx = idx;
    vm.refreshGame();
  };

  vm.refreshGame = function () {
    setShowCards();
  };

  function getActiveStory() {
    return vm.game.stories[vm.activeStoryIdx];
  };

  function getActiveStoryPlayerIdx(activeStory) {
    for (var i = 0; i < activeStory.players.length; i++) {
      if (activeStory.players[i].email === vm.user.email) {
        return i;
      }
    }
  };

  function getActiveStoryAverageEstimate(activeStory) {
    if (!activeStory) {
      return;
    }
    var averageEst = getResultsMode(activeStory);
    return getEstimateClosestToCardInDeck(averageEst, vm.decks[vm.game.deck]);
  };

  function getResultsMode(activeStory) {
    var points = activeStory.players.map(function (a) {
      return angular.isNumber(a.estimate) ? a.estimate : 0
    });
    var mode = _(points).chain().groupBy(function (i) {
      return i;
    }).max(function (grp) { return grp.length; }).first().value();
    return mode;
  }

  function getEstimateClosestToCardInDeck(averageEstimate, cardDeck) {
    var copiedDeck = angular.copy(cardDeck);
    copiedDeck.pop();
    var closest = copiedDeck.reduce(function (prev, curr) {
      return (Math.abs(curr - averageEstimate) < Math.abs(prev - averageEstimate) ? curr : prev);
    });
    return closest;
  }

  function haveAllPlayersPlayedAllStories() {
    var allPlayersPlayed = _.every(vm.game.stories, function (story) {
      return _.every(story.players, function (player) {
        return player.played === true;
      });
    });
    if (allPlayersPlayed) {
      vm.game.status = 'Played';
      gameService.save(vm.game);
    }
  }

  function hasPlayerPlayedAllStories() {
    var playedAll = true;
    var allStoriesPlayed = _.each(vm.game.stories, function (story) {
      var player = _.find(story.players, function (player) {
        return player.email === vm.user.email;
      });
      if (player && !player.played) {
        playedAll = false;
        return;
      }
    });
    (playedAll) ? setGameQueStatus('Finished Play') : setGameQueStatus('Partially Played');
  }

  function setGameQueStatus(gameStatus) {
    gameQueueService.all().then(function (qued) {
      var quedGame = _.find(qued, function (gameInfo) {
        return gameInfo.gameId === vm.game.$id;
      });
      if (quedGame) { // Won't be qued game if game owner isn't on the team...
        quedGame.status = gameStatus;
        gameQueueService.save(quedGame);
      }
    });
  }

  function isJiraStory(story) {
    return story.hasOwnProperty('jiraKey');
  }

  function setShowCards() {
    vm.showCards = false;
    vm.activeStory = getActiveStory();
    if (vm.activeStory && vm.activeStory.accepted) {
      vm.showCards = true;
    }
  };

  function init() {
    if ($state.current.name === 'app.play') {
      principalService.getUser().then(function (user) {
        vm.user = user;
        gameService.init(user.email);
        gameQueueService.init(user.email);
        gameService.get($state.params.gid).then(function (game) {
          vm.game = game;
          vm.isOwner = (vm.game.owner === vm.user.email) ? true : false;
          vm.refreshGame();
        });
        vm.decks = gameService.getPokerDecks();
      });
    }
    if ($state.current.name === 'app.watch') {
      gameService.get($state.params.gid).then(function (game) {
        vm.game = game;
        vm.isOwner = false;
        vm.showCards = true;
        vm.refreshGame();
      });
    }

  };

}

PlayGameController.$inject = inject;

module.exports = PlayGameController;
