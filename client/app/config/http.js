/**
 * Created by dwaldo on 2/26/2015.
 */
var HttpConfig = function($httpProvider){
	$httpProvider.interceptors.push(function($q, $rootScope) {
		return {
			'request': function(config) {
				$rootScope.$broadcast('loading-started');
				return config || $q.when(config);
			},
			'response': function(response) {
				$rootScope.$broadcast('loading-complete');
				return response || $q.when(response);
			}
		};
	});
};

HttpConfig.$inject = ['$httpProvider'];

module.exports = HttpConfig;
