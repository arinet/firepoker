var $inject = ['$http'];

function JiraRestService($http) {

	var baseSearchUrl = "/api/v1/search";
	var baseIssueUrl = '/api/v1/issue';
	
	return {
		get : function (jqlQuery) {
			return $http.get(baseSearchUrl + '?jql=' + jqlQuery);
		},
    //Note: Read Docs on Jira Updating Fields for API explanation. .
		putStoryPoints : function(storyId, storyPoints){
			var putData ={
				update : {
				customfield_10004 : [{set : storyPoints}]
			}
			};
			return $http.put(baseIssueUrl + '/'+ storyId, putData);
		},
		
		putComment : function(storyId, comment){
			var putData ={
				update : {
				comment : [{add : {body : comment}}]
			}};
			return $http.put(baseIssueUrl + '/' + storyId, putData)
		}
	}
}

JiraRestService.$inject = $inject;

module.exports = JiraRestService;
