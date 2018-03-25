

/**
 * Created by dwaldo on 2/26/2015.
 */

var inject = ['Firebase', '$firebaseArray', '$firebaseObject'];

var GameService = function(Firebase, $firebaseArray, $firebaseObject) {

  var ref = new Firebase('https://' + FIREBASE_URL).child('games');
  var gameList = null;
  var service = this;
  var count = 0;
  service.userEmail = "";
  service.pageSize = 5;
  service.jiraUrl = JIRA_URL;

  service.init = function(userEmail) {
    service.userEmail =  userEmail.toLowerCase();
  };

  service.add = function(game) {
    return gameList.$add(game);
  };

  service.delete = function(game) {
    return gameList.$remove(game);
  };

  service.get = function(gameId) {
    return $firebaseObject(ref.child(gameId)).$loaded();
  };

  service.getPokerDecks = function() {
    return [
      [0, 1, 2, 4, 8, 16, 32, 64, 128, '?'],
      [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?']
    ];
  };

  service.save = function(game) {
    ('$save' in game.__proto__) ? game.$save() : gameList.$save(game);
  };

  service.getPagedData = function() {
    return getGameListByPriority(service.pageSize).$loaded();
  };

  service.fetchByDate = function(startDate, endDate) {
    return getGameListByCreatedOnDate(startDate, endDate).$loaded();
  };

  function checkForInitialization(){
    if (!service.userEmail || !gameList) {
      throw new Error('Game service not initialized.');
    }
  };

  // NOTE: Returns games from all users, must be filtered in the view
  // due to limitations of querying in firebase.
  function getGameListByCreatedOnDate(startDate, endDate){
    var email = service.userEmail;
    gameList = $firebaseArray(ref.orderByChild("createdOn").startAt(startDate).endAt(endDate));
    return gameList;
  };

  function getGameListByPriority(pageSize){
    count += pageSize;
    var email = service.userEmail;
    gameList = $firebaseArray(ref.startAt(email).endAt(email).limitToLast(count));
    return gameList;
  };

  return service;

};

GameService.$inject = inject;

module.exports = GameService;
