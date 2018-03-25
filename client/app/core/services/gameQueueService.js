var _ = require('underscore');
/**
 *
 *
 * Created by dwaldo on 2/26/2015.
 */

var inject = ['Firebase', '$firebaseArray', '$firebaseObject', '$q'];

var GameQueueService = function(Firebase, $firebaseArray, $firebaseObject, $q) {

  var ref = new Firebase('https://' + FIREBASE_URL).child('gameQueue');
  var gameQueueList = null;
  var service = this;

  service.init = function(userEmail) {
    var email = userEmail.toLowerCase();
    gameQueueList = $firebaseArray(ref.startAt(email).endAt(email));
  }

  //Get all games qued for user...
  service.all = function() {
    if (!gameQueueList) {
      throwNotInitialized();
    }
    return gameQueueList.$loaded();
  }

  //Adds the game to all the game's players queues.
  service.add = function(game, gameId) {
    var gameInfo = {
      name: game.name,
      createdOn: game.createdOn,
      gameId: gameId,
      status: game.status
    };
    for (var i = 0; i < game.team.players.length; i++) {
      var player = game.team.players[i];
      gameInfo.player = player.email; //For analytics
      gameInfo.$priority = player.email.toLowerCase(); // so we can retrieve by this...
      gameQueueList.$add(gameInfo);
    }
  };

  service.updateStatus = function(game, status) {
    var promises = getPlayerQueues(game);
    $q.all(promises).then(function(playerQs) {
      angular.forEach(playerQs, function(pq) {
        var gameInfo = _.find(pq, function(x) {
          return x.gameId === game.$id;
        });
        gameInfo.status = status;
        pq.$save(gameInfo);
      });
    });
  };

  //Removes the game from all the games's players queues.
  service.delete = function(game) {
    var promises = [];
    for (var i = 0; i < game.team.players.length; i++) {
      var player = game.team.players[i];
      var playersQ = $firebaseArray(ref.startAt(player.email).endAt(player.email));
      promises.push(playersQ.$loaded());
    }

    $q.all(promises).then(function(playerQs) {
      angular.forEach(playerQs, function(pq) {
        var gameInfo = _.find(pq, function(x) {
          return x.gameId === game.$id;
        });
        pq.$remove(gameInfo);
      });
    });
  };

  service.get = function(gameQueueId) {
    return $firebaseObject(ref.child(gameQueueId)).$loaded();
  }

  service.save = function(gameQueueInfo) {
    if (!gameQueueList) {
      throwNotInitialized();
    }
    return gameQueueList.$save(gameQueueInfo);
  }

  function getPlayerQueues(game) {
    var promises = [];
    for (var i = 0; i < game.team.players.length; i++) {
      var player = game.team.players[i];
      var playersQ = $firebaseArray(ref.startAt(player.email).endAt(player.email));
      promises.push(playersQ.$loaded());
    }
    return promises;
  }

  function throwNotInitialized() {
    throw new Error('Game Queue service not initialized');
  }


  return service;

};

GameQueueService.$inject = inject;

module.exports = GameQueueService;
