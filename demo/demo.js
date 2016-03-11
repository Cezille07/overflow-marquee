angular.module('OverflowMarqueeDemo', ['overflow-marquee'])
	.controller('DemoController', ['$scope', '$interval', function($scope, $interval) {
		console.log("I am demo controller!");
		
		$scope.enteredNumber = 10;
		
		$scope.$on('$destroy', function() {
			$interval.cancel(interval);
		})
	}])
;