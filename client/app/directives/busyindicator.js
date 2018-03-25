/**
 * Created by dwaldo on 2/26/2015.
 */

var BusyIndicator = function(){
	return {
		restrict : "A",
		template: "<div>Loading...</div>",
		link : function($scope, element, attrs) {
			//Initial State = Display None!
			element.css({"display" : "none"});
			$scope.$on("loading-started", function(e) {
				element.css({"display" : ""});
			});
			$scope.$on("loading-complete", function(e) {
				element.css({"display" : "none"});
			});
		}
	}
};

module.exports = BusyIndicator;
