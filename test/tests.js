describe('OverflowMarquee', function() {
	var $rootScope, $scope, $compile, $interval, $timeout;
	var VALUES, span, parent; 
	var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
	
	// Base template: 300px wide div, containing a span (with variable contents)
	var template = '<div style="width: 300px"><span ###>%%%</span></div>';
	
	// Compile function, to be used for each test
	var compileDirective = function(spanContent, options) {
		var parsedTemplate = template.replace("%%%", spanContent);
		parsedTemplate = parsedTemplate.replace('###', 'overflow-marquee ###');
		for (var key in options) {
			parsedTemplate = parsedTemplate.replace('###', key + '=' + options[key] + " ###");
		}
		parsedTemplate = parsedTemplate.replace(' ###', '');
		
		// Add to DOM tree to be able to calculate widths
		$('body').append(parsedTemplate);
		
		// Compile and return
		var directive = $compile($('[overflow-marquee]').last()[0])($scope);
		
		// The directive waits for one digest cycle to ensure complete layouting before it checks for overflow. 
		$timeout.flush();
		
		return directive;
	};
	
	// Check if child's width is bigger than parent, in which case the directive activates
	var childOverflows = function(parent, child) {
		return parent.width() < child.width();
	};
	
	// Initialize module, get $rootScope, $compile, and the static values used by the directive
	beforeEach(module('overflow-marquee'));
	beforeEach(inject(['$compile', '$interval', '$timeout', '$rootScope', 'OverflowMarqueeValues', 
					   function(_$compile_, _$interval_, _$timeout_, _$rootScope_, OverflowMarqueeValues) {
		$compile = _$compile_;
		$interval = _$interval_;
		$timeout = _$timeout_;
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new(null, $rootScope);
		VALUES = OverflowMarqueeValues;
	}]));
	
	describe('No overflow behavior', function() {
		it('should do nothing if there is no overflow', function() {
			var span = compileDirective("I FIT"),
				parent = span.parent();
			expect(childOverflows(parent, span)).to.equal.false;
			expect(parent.hasClass(VALUES.parentMarqueeClass)).to.equal.false;
			expect(span.hasClass(VALUES.overflowMarqueeClass)).to.equal.false;
		});
	});
	
	describe('Basic function', function() {
		it('should get marquee class if there is overflow, and start moving', function() {
			var span = compileDirective(LOREM_IPSUM),
				parent = span.parent();
			var isolateScope = span.isolateScope();
			
			expect(childOverflows(parent, span)).to.equal.true;
			expect(parent.hasClass(VALUES.parentMarqueeClass)).to.equal.true;
			expect(span.hasClass(VALUES.overflowMarqueeClass)).to.equal.true;
			
			// Initial position should be left: 0
			var first = $(span).css("left");
			expect($(span).css("left")).to.equal("0px");
			
			// Move forward by one unit of time
			$interval.flush(VALUES.intervalDuration);
			
			// Element should have a different css left value
			expect($(span).css("left")).to.not.equal("0px");
		});
	});
	
	describe('overflowMarqueeSpeed option', function() {
		it('should move at default speed of 1px / 25ms when no speed given', function() {
			var span = compileDirective(LOREM_IPSUM),
				parent = span.parent();
			var isolateScope = span.isolateScope();
			expect(childOverflows(parent, span)).to.equal.true;
			
			// Initial
			expect($(span).css("left")).to.equal("0px");
			
			// Move forward by one unit of time
			$interval.flush(VALUES.intervalDuration);
			
			// Expect to move by (1px * OverflowMarquee.defaultMarqueeSpeed (1) ) per OverflowMarqueeValues.intervalDuration 
			expect($(span).css("left")).to.equal("-" + VALUES.defaultMarqueeSpeed + "px");
		});
		
		it('should move at 5px / 25ms when overflow-marquee-speed is set to 5', function() {
			var span = compileDirective(LOREM_IPSUM, {"overflow-marquee-speed": 5}),
				parent = span.parent();
			var isolateScope = span.isolateScope();
			expect(childOverflows(parent, span)).to.equal.true;
			
			// Initial 
			expect($(span).css("left")).to.equal("0px");
			
			// Move forward by one unit of time
			$interval.flush(VALUES.intervalDuration);
			
			// Expect to move by (1px * overflowMarqueeSpeed (5) ) per OverflowMarqueeValues.intervalDuration 
			expect($(span).css("left")).to.equal("-5px");
		});
	});
	
	describe('overflowMarqueePause option', function() {
		// Set some value to true, TEST, then set that value to false, TEST
		// var pause = element(by.id('pause'));
		it('should toggle pause when clicked', function() {
			$scope.woo = false;
			var span = compileDirective(LOREM_IPSUM, {
					"overflow-marquee-pause": '"woo"',
					"ng-click": '"woo = !woo"'
				}),
				parent = span.parent();
			var isolateScope = span.isolateScope();
			expect(childOverflows(parent, span)).to.equal.true;
			
			// Move forward by one unit of time
			$interval.flush(VALUES.intervalDuration);
			
			// We have moved
			expect($(span).css("left")).to.not.equal("0px");
			
			span.triggerHandler('click');
			$scope.$apply();
			
			// Allow the animations to finish
			$timeout.flush();
			
			// Ensure reset happened
			expect($(span).css("left")).to.equal("0px");
			
			// Ensure not moving
			$interval.flush(VALUES.intervalDuration);
			expect($(span).css("left")).to.equal("0px");
		});
		
		it('should pause based on expression', function() {
			$scope.value = 0;
			var span = compileDirective(LOREM_IPSUM, {
					"overflow-marquee-pause": '"value % 2 == 1"',
					"ng-click": '"value = value + 1"'
				}),
				parent = span.parent();
			var isolateScope = span.isolateScope();
			expect(childOverflows(parent, span)).to.equal.true;
			
			// Move forward by one unit of time
			$interval.flush(VALUES.intervalDuration);
			
			// We have moved
			expect($(span).css("left")).to.not.equal("0px");
			
			span.triggerHandler('click');
			$scope.$apply();
			
			// Allow the animations to finish
			$timeout.flush();
			
			// Ensure reset happened
			expect($(span).css("left")).to.equal("0px");
			
			// Ensure not moving
			$interval.flush(VALUES.intervalDuration);
			expect($(span).css("left")).to.equal("0px");
		});
	});
});