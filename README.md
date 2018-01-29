# Overflow Marquee

Angular directive to make text marquee if it overflows its container, in the style of old iOS music app. Instead of fully scrolling off-screen then looping, it only scrolls until the overflowed text is shown (i.e., the entire string has been displayed to its last character). 

Run `npm start` to see the demo. 

## Dependencies

* Angular 1.6
* jQuery 3.3

## Usage

Via NPM: `npm install --save overflow-marquee`

This will also give you the demo and the tests. 

If you simply want to include the code, get the `overflow-marquee.min.js` and `overflow-marquee.min.css` from the `/build` folder, and include it in your page. 

## Example

Rollcall for all options! 

    <html>
        <head>
            <!-- Include jQuery, Angular, and the overflow-marquee code here -->

            <script>
                angular.module('Stuff', ['overflow-marquee']);
                angular.module('Stuff').controller(function($scope) {
                    $scope.woo = false;
                });
            </script>

            <style>
                html, body {
                    margin: 0; padding: 0; background: #E9967A; font-family: Helvetica, Arial, sans-serif;
                }
                #content {
                    width: 400px; height: 40px; line-height: 40px; position: relative; top: calc(50% - 20px); margin: 8px auto; background: #FFF;
                }
            </style>
        </head>

        <body ng-app="Stuff">
            <div id="content">
                <span overflow-marquee
                    overflow-marquee-speed=1
                    overflow-marquee-pause="foo"
                    ng-click="foo = !foo"
                    ng-init="foo = false">Mama just killed a man; put a gun against his head, pulled the trigger now he's dead. 
            </div>
        <body>
    </html>
	
### Options

All options are optional. :wink:

#### overflow-marquee-speed (Integer)

Pixels shifted per 25 milliseconds. Default is 1. 

#### overflow-marquee-pause (Angular Expression)

 Use `overflow-marquee-pause` to pause conditionally. Bind it to a variable or an expression. Go crazy with as many as 50 marquees on one page! 

## Tests

The tests are made with Karma, Mocha, and Chai. Run them with:

`npm test`

## Development

Contributions are welcome! 