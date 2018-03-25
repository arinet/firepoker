/**
 * Created by dwaldo on 2/28/2015.
 */
var inject = ['loginService', 'accountService', '$state'];

var LoginController = function(loginService, accntService, $state) {

  var vm = this;

  vm.loginForm = {
    message: null,
    email: null,
    pword: null,
  }

  vm.registerForm = {
    failMessage: null,
    successMessage: null,
    userName: null,
    email: null,
    emailConfirm: null,
    pword: null,
    pwordConfirm: null
  };

  vm.login = login.bind(vm.loginForm)
  vm.createAccount = register.bind(vm.registerForm)

  function login() {
    var form = this;
    loginService.loginUser(form.email, form.pword).then(function(user) {
      if (!user) {
        form.message = "Login failed!  Email or password is incorrect, or account does not exist";
      } else {
        $state.go('app.dashboard', {
          reload: true
        });
      }
    });
  }

  function register() {
    var form = this;
    if (form.email !== form.emailConfirm) {
      form.failMessage = "Email addresses do not match!";
      return;
    }
    if (form.pword !== form.pwordConfirm) {
      form.failMessage = "Password does not match!";
      return;
    }
    accntService.createNewUser(form.email, form.pword, form.userName).then(function(response) {
      if (response.message) {
        form.failMessage = "Failed to create account! " + response.message;
      } else {
        login.call(form);
      }
    });
  }

  return vm;

};

LoginController.$inject = inject;

module.exports = LoginController;
