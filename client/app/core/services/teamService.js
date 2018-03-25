var inject = ['Firebase', '$firebaseArray', '$firebaseObject'];

var TeamService = function(Firebase, $firebaseArray, $firebaseObject) {

  var service = this;
  var ref = new Firebase('https://' + FIREBASE_URL).child('teams');
  var teamList = false;

  service.init = function(userEmail) {
    return  teamList = $firebaseArray(ref);
  };

  //TODO: Paging?
  service.all = function() {
    if (!teamList) {
      throwNotInitialized();
    }
    return teamList.$loaded();
  }

  service.get = function(teamId) {
    return $firebaseObject(ref.child(teamId)).$loaded();
  }

  service.add = function(team) {
    if (!teamList) {
      throwNotInitialized();
    }
    return teamList.$add(team);
  }

  service.delete = function(team) {
    if (!teamList) {
      throwNotInitialized();
    }
    return teamList.$remove(team);
  }

  service.save = function(team) {
    if (!teamList) {
      throwNotInitialized();
    }
    return teamList.$save(team);
  }

  function throwNotInitialized() {
    throw new Error('Team service not initialized');
  }

  return service;

}

TeamService.$inject = inject;

module.exports = TeamService;
