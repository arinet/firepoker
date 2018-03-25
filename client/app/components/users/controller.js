/**
 * Created by dwaldo on 4/25/2015.
 */
var inject = ['principalService','accountService'];

var UserProfileController = function(principalService, accntService) {

  var vm = this;
  vm.user = null;

  init();

  vm.passwordForm = {
    failMessage: null,
    successMessage: null,
    oldPword: null,
    pword: null,
    pwordConfirm: null
  };

  vm.profileForm = {
    failMessage: null,
    successMessage: null,
    userName: null,
    jobTitle : null
  };

  vm.updateProfile = updateUserProfile.bind(vm.profileForm);
  vm.updatePassword = updateUserPassword.bind(vm.passwordForm);

  function updateUserProfile() {
    var form = this;
    var userInfo = {
      uid : principalService.isAuthenticated().uid,
      userName : form.userName,
      jobTitle : form.jobTitle
    };
    accntService.updateUserInfo(userInfo).then(function(response) {
      if (response) {
        form.failMessage = "Failed to update profile info! " + response;
      }
      else{
        form.successMessage = "Profile info updated";
      }
    });
  };

  function updateUserPassword(){
    var form = this;
    if (form.pword !== form.pwordConfirm) {
      form.failMessage = "Password does not match!";
      return;
    }
    else{
      accntService.changePassword(vm.user.email, form.oldPword, form.pword).then(function(response) {
        if (response == false) {
          form.failMessage = "Failed to change password!";
        }
        else{
          form.successMessage = "Password updated";
          form.oldPword = "";
          form.pword = "";
          form.pwordConfirm = "";
        }
      });
    }
  };

  function init() {
    principalService.getUser().then(function(user) {
      vm.user = user;
      vm.profileForm.userName = user.name;
      vm.profileForm.jobTitle = user.jobTitle;
    });
  };

  return vm;

};

UserProfileController.$inject = inject;

module.exports =  UserProfileController;
