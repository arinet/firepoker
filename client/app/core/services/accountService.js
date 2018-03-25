var inject = ['Firebase', '$q'];

/**
 * Firebase authorization service, to register and athenticate with firebase.
 * @param {object} Firebase
 * @param {object} $q (anuglar's q)
 */
var AccountService = function(Firebase, $q) {

  var service = this;
  var ref = new Firebase('https://' + FIREBASE_URL);

  /**
   * Creates a new firebase user.
   * @param {string} email address
   * @param {pword} password
   * @return {object} user data object if success, error object if failure
   */
  service.createNewUser = function(email, pword, userName) {
    var deferred = $q.defer();
    ref.createUser({
      email: email.toLowerCase(),
      password: pword
    }, function(error, userData) {
      if (error) {
        deferred.resolve(error);
      } else { //priority set for lookup on email...
        ref.child("users").child(userData.uid).setWithPriority({
          joinDate: Date(),
          email: email.toLowerCase(),
          name: userName
        },email);
        deferred.resolve(userData.uid);
      }
    });
    return deferred.promise;
  }

  /**
   * Update user info of an existing firebase user.
   * @param {userData} User info, with fields uid, userName, and jobTitle.
   * @return {bool} true if success, false if failure
   */
  service.updateUserInfo = function(userData){
    var deferred = $q.defer();
    ref.child("users").child(userData.uid).update({
      name: userData.userName,
      jobTitle : userData.jobTitle
    }, function(error){
      deferred.resolve(error);
    });
    return deferred.promise;
  }

  /**
   * Changes password of an existing firebase user.
   * @param {string} email address
   * @param {oldPword} password
   * @param {newPword} password
   * @return {bool} true if success, false if failure
   */
  service.changePassword = function(email, oldPword, newPword) {
    var deferred = $q.defer();
    ref.changePassword({
      email: email.toLowerCase(),
      oldPassword: oldPword,
      newPassword: newPword
    }, function(error) {
      if (error === null) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    });
    return deferred.promise;
  }

  /**
   * Reset password of an existing firebase user via email.
   * @param {string} email address
   * @return {bool} true if success, false if failure
   */
  service.resetPassword = function(email) {
    var deferred = $q.defer();
    ref.resetPassword({
      email: email.toLowerCase()
    }, function(error) {
      if (error === null) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    });
    return deferred.promise;
  }

  return service;

}

AccountService.$inject = inject;

module.exports = AccountService;
