'use strict';
var _ = require('underscore');
var inject = ['team'];

/**
 * Create Teams Controller
 *
 * Creates a team for firepoker games, and saves it back to firedb.
 *
 * by - Don Waldo
 */
var TeamModalController = function(team) {

  var vm = this;
  vm.team = team;
  vm.player = {
    name: "",
    email: ""
  };

  init();

  vm.addPlayer = function() {
    if (!vm.team.players) {
      vm.team.players = [];
    }
    vm.player.email = vm.player.email.toLowerCase();
    vm.team.players.push(angular.copy(vm.player));
    clearPlayerInput();
  };

  vm.deletePlayer = function(index) {
    vm.team.players.splice(index, 1);
  };


  function clearPlayerInput() {
    vm.player.name = "";
    vm.player.email = "";
  }

  function init(){
    vm.team = team;
  }

  return vm;
}


TeamModalController.$inject = inject;

module.exports = TeamModalController;
