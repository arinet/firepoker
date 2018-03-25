'use strict';

var inject = ['accountService'];

/**
 * Reset Password Controller
 *
 * Resets a users password in firebase via email.
 *
 * by - Don Waldo
 */
 var ResetPwordController = function(accntService){

   var vm = this;
   vm.failMessage = null;
   vm.successMessage = null;
   vm.email = null;

   vm.resetPassword = function() {
      accntService.resetPassword(vm.email).then(function(result){
        if (result) {
          vm.successMessage = "You will be sent an email with instruction on resetting your password!";
        }
        else{
          vm.failMessage = "Failed to find a matching email! You are hosed!";
        }
      });
   }
   return vm;
 }

 ResetPwordController.$inject = inject;

 module.exports = ResetPwordController;
