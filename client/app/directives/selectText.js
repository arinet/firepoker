/**
 * Created on 7/2/2015.
 */

var selectText = function(){
	return {
		restrict : "A",
		link : function($scope, element) {
			var focusedElement = null;
			element.on('click', function (){
				if (focusedElement != this) {
					element.select();
					focusedElement = this;
				}
			});
			element.on('blur', function() {
				focusedElement = null;
			});
		}
	}
};

module.exports = selectText;
