'use strict';

var inject = ['jiraRestService', 'stories', 'team', 'gameService'];

/**
 * Stories Controller
 *
 * Controller to add stories to an in progress game!
 *
 */
function StoriesController(jiraApi, stories, team, gameService) {

  var vm = this;
  vm.stories = stories;
  vm.team = team;
  vm.jqlQuery = '';
  vm.bulkLoadStories = '';
  vm.freeFormStory = getFreeFormStory();
  vm.structuredStory = getStructuredStory();
  vm.errorMsg = '';
  vm.jiraUrl = gameService.jiraUrl;

  init();

  vm.addBulkLoadStories = function() {
    angular.forEach(vm.bulkLoadStories.split('\n'), function(storyTitle) {
      if (storyTitle === "") {
        return;
      }
      vm.stories.push({
        title: storyTitle,
        accepted: false,
        players: vm.team.players
      });
    });
  };

  vm.addFreeFormStory = function() {
    vm.freeFormStory.players = vm.team.players;
    vm.stories.push(vm.freeFormStory);
    vm.freeFormStory = getFreeFormStory();
  };

  vm.addStructuredStory = function() {
    var title = 'As a/an ' +
      vm.structuredStory.asA +
      ' I would like to ' +
      vm.structuredStory.iWouldLikeTo +
      ' so that ' +
      vm.structuredStory.soThat;
    vm.structuredStory.title = title;
    vm.structuredStory.players = vm.team.players;
    vm.stories.push(vm.structuredStory);
    vm.structuredStory = getStructuredStory();
  };

  vm.deleteStory = function(index) {
    vm.stories.splice(index, 1);
  };

  vm.loadJiraStories = function() {
    jiraApi.get(vm.jqlQuery).then(function(result) {
      return result;
    }).then(function(queryResults) {
      vm.errorMsg = '';
      if (!queryResults.data.issues){
        vm.errorMsg = queryResults.data;
        return;
      }
      for (var iz = 0; iz < queryResults.data.issues.length; iz++) {
        var issueKey = queryResults.data.issues[iz].key;
        var summary = queryResults.data.issues[iz].fields.summary;
        vm.stories.push(createNewJiraStory(summary, issueKey));
      }
    });
  };

  function createNewJiraStory(title, jiraKey) {
    return {
      title: title,
      href: "https://" + vm.jiraUrl + "/browse/" + jiraKey,
      jiraKey: jiraKey,
      accepted: false,
      players: vm.team.players
    };
  };

  function getFreeFormStory() {
    return {
      title: '',
      notes: '',
      accepted: false
    };
  }

  function getStructuredStory() {
    return {
      title: '',
      asA: '',
      iWouldLikeTo: '',
      soThat: '',
      notes: '',
      accepted: false
    };
  }

  function init() {
    vm.stories = stories;
    vm.team = team;
  };

  return vm;

}

StoriesController.$inject = inject;

module.exports = StoriesController;
