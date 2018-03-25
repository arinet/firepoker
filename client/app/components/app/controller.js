/**
 * Created by dwaldo on 2/28/2015.
 */
var inject = ['principalService', '$state'];

var AppController = function(principalService, $state) {

  var vm = this;
  vm.user = null;

  vm.getPageClasses = function() {
     var classes = [];
     classes.push($state.current.name.replace('.', '-'))
     return classes;
   }

  vm.isAuthenticated = function() {
    var isAuth = principalService.isAuthenticated();
    if (isAuth && vm.user === null){
      fetchIdent();
    }
    return isAuth;
  };

  vm.logOff = function() {
    vm.user = null;
    $state.go('app.login')
  };

  function fetchIdent(){
    principalService.getUser().then(function(user) {
      vm.user = user;
    });
  }

  return vm;

}

AppController.$inject = inject;

module.exports = AppController;
