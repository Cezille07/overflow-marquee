"use strict";

angular.module('overflow-marquee', [])
	.value('OverflowMarqueeValues', {
		overflowMarqueeClass: "overflow-marquee",
		parentMarqueeClass: "overflow-marquee-container",
		intervalDuration: 25,
		defaultMarqueeSpeed: 1,
		statusCodes: {
			STARTING: 1,  
			STARTED: 100,
			PAUSING: 0,
			PAUSED: -1
		},
		opacitySpeed: 500,
		resetSpeed: 400
	})
		
	.directive('overflowMarquee', ['$timeout', '$interval', '$q', 'OverflowMarqueeValues', function($timeout, $interval, $q, OverflowMarqueeValues) {
		return {
			restrict: 'A',
			scope: {
				overflowMarqueePause: '=?',			// Two-way bind, to allow pause and unpause scroll
				overflowMarqueeSpeed: '=?',			// Optional: Pixels per iteration. Default 1.
				overflowMarqueeRepeat: '=?'			// Optional: Number of times to repeat. Set -1 for infinite. Default infinite. 
			},
			link: function($scope, $element, $attrs) {
				// Add marquee classes to simulate overflow (if any)
				$element.addClass(OverflowMarqueeValues.overflowMarqueeClass);
				$element.parent().addClass(OverflowMarqueeValues.parentMarqueeClass);
				
				var loop;
				var resetTimeout1, resetTimeout2, resetTimeout3; 
				var pauseWatcher;
				var stopping = $q.when();
				
				// Allow one digest cycle before start
				var start = $timeout(function() {
					if ($element.width() > $element.parent().width()) {
						$scope.overflowMarqueeSpeed = parseInt($scope.overflowMarqueeSpeed) || OverflowMarqueeValues.defaultMarqueeSpeed;
						$scope.overflowMarqueePause = $scope.overflowMarqueePause || false;
						$scope.status = OverflowMarqueeValues.statusCodes.PAUSED;
						$scope.moved = 0;
						$scope.overflowLength = $element.width() - $element.parent().width();
						
						pauseWatcher = $scope.$watch('overflowMarqueePause', function(pause) {
							if (pause) {
								reset();
							} else {
								// Wait for reset to finish
								if (stopping.$$state.status === 0) {
									stopping.then(displayFullTitle);
								} else {
									displayFullTitle();
								}
							}
						});
					} else {
						$element.removeClass(OverflowMarqueeValues.titleMarqueeClass);
						$element.parent().removeClass(OverflowMarqueeValues.parentMarqueeClass);
					}
				});
				
				function reset() {
					$scope.status = OverflowMarqueeValues.statusCodes.PAUSING;
					$scope.moved = 0;
					$interval.cancel(loop);
					
					if (stopping.$$state.status != 0) {
						var deferred = $q.defer();
						
						$element.css('opacity', 0);
						var resetTimeout1 = $timeout(function() {
							$element.css('left', 0);
							resetTimeout2 = $timeout(function() {
								$element.css('opacity', 1);
								resetTimeout3 = $timeout(function() {
									$scope.status = OverflowMarqueeValues.statusCodes.PAUSED;
									$timeout.cancel(resetTimeout1);
									$timeout.cancel(resetTimeout2);
									$timeout.cancel(resetTimeout3);
									
									deferred.resolve();
									// stopping = null;
								}, OverflowMarqueeValues.resetSpeed);
							}, OverflowMarqueeValues.opacitySpeed);
						}, OverflowMarqueeValues.opacitySpeed);
						
						stopping = deferred.promise;
					}
					return stopping;
				}
				
				function displayFullTitle() {
					if (loop && loop.$$state.status === 0) {
						return;
					}
					$scope.status = OverflowMarqueeValues.statusCodes.STARTING;
					loop = $interval(updateFunction, OverflowMarqueeValues.intervalDuration);
				}
				
				function updateFunction() {
					$scope.status = OverflowMarqueeValues.statusCodes.STARTED;
					if ($scope.moved < $scope.overflowLength) {
						// Continue shifting element
						$scope.moved += $scope.overflowMarqueeSpeed;
						$element.css('left', parseInt($element.css('left')) - $scope.overflowMarqueeSpeed);
					} else {
						// Stop loop. Hide and reset before restarting.
						reset().then(function() {
							if (!$scope.overflowMarqueePause) {
								displayFullTitle();
							}
						});
					}
				}
				
				$element.on('destroy', function() {
					pauseWatcher();
					$timeout.cancel(start);
					$timeout.cancel(resetTimeout1);
					$timeout.cancel(resetTimeout2);
					$timeout.cancel(resetTimeout3);
					$interval.cancel(loop);
					$scope.$destroy();
				});
			}
		}
	}])
;