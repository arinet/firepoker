var inject = ['Firebase', '$q'];

/**
 * Firebase authorization service, to register and athenticate with firebase.
 * @param {object} Firebase
 * @param {object} $q (anuglar's q)
 */
var PrincipalService = function(Firebase, $q) {

  var service = this;
  var identity = undefined;
  var ref = new Firebase('https://' + FIREBASE_URL);

  service.isIdentityResolved = function() {
    return angular.isDefined(identity);
  };

  service.isAuthenticated = function() {
    return getAuth();
  };

  /**
   * Retrieves a user account by user id.
   * @param {bool} force (optional), ensures user data is reloaded from the server.
   * @return {object} user data object if success, error if failure
   */
  service.getUser = function(force) {
    var deferred = $q.defer();
    if (force === true) identity = undefined;
    if (service.isIdentityResolved()) {
      deferred.resolve(identity);
    } else {
      ref.child("users").child(getAuth().uid)
        .once("value", function(snapshot) {
          identity = snapshot.val();
          deferred.resolve(identity);
        }, function(error) {
          deferred.resolve(error);
        });
    }
    return deferred.promise;
  };

  function getAuth(){
    return ref.getAuth();
  }

  return service;

}

PrincipalService.$inject = inject;

module.exports = PrincipalService;
