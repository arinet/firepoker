'use strict';
var _ = require('underscore');
var inject = ['principalService', 'teamService', '$modal'];

/**
 * Create Teams Controller
 *
 * Creates a team for firepoker games, and saves it back to firedb.
 *
 * by - Don Waldo
 */
var TeamsController = function(principalService, teamService, $modal) {

  var vm = this;
  vm.user = null;
  vm.teams = null;

  init();

  vm.add = function() {
    var team = {
      name: '',
      desc: '',
      owner : vm.user.email.toLowerCase(),
      $priority : vm.user.email.toLowerCase()
    };

    var modalInstance = showEditModal(team);
    modalInstance.result.then(function(newTeam) {
      teamService.add(newTeam);
    });
  };

  vm.delete = function(team) {
    teamService.delete(team);
  };

  vm.edit = function(team) {
    var modalInstance = showEditModal(team);
    modalInstance.result.then(function(editedTeam) {
      teamService.save(editedTeam);
    })
  };

  function showEditModal(selectedTeam) {
    var opts = {
      size: 'lg',
      templateUrl: 'components/teams/modal.html',
      controller: 'TeamModalController',
      controllerAs: 'teamModalCtrl',
      resolve: {
        'team': function() {
          return selectedTeam;
        }
      }
    };
    return $modal.open(opts);
  }

  function init() {
    principalService.getUser().then(function(user) {
      vm.user = user;
      teamService.init(user.email);
      teamService.all().then(function(result) {
        vm.teams = result;
      });
    });
  }

  return vm;

}

TeamsController.$inject = inject;

module.exports = TeamsController;
