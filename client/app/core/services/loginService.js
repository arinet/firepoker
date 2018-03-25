var inject = ['Firebase', '$q'];

/**
 * Firebase authorization service, to register and athenticate with firebase.
 * @param {object} Firebase
 * @param {object} $q (anuglar's q)
 */
var LoginService = function(Firebase, $q) {

  var service = this;
  var ref = new Firebase('https://' + FIREBASE_URL);

  /**
   * Logs in an existing firebase user.
   * @param {string} email address
   * @param {pword} password
   * @param {uName} user name
   * @return {bool, string} user auth data if success, false if failure
   */
  service.loginUser = function(email, pword) {
    var deferred = $q.defer();
    ref.authWithPassword({
      email: email.toLowerCase(),
      password: pword
    }, function(error, authData) {
      if (error) {
        deferred.resolve(false);
      } else {
        deferred.resolve(authData);
      }
    });
    return deferred.promise;
  };

  /**
   * Invalidates the users token, logging them out of the application.
   * @param {bool} returns true
   */
  service.logOff = function() {
    ref.unauth();
    return true;
  };

  return service;

}

LoginService.$inject = inject;

module.exports = LoginService;
