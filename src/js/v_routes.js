var setPinApp = angular.module('setPinApp', [
  'ngRoute',
  'setPinController'
]);

setPinApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/step-one', {
    templateUrl:'set-pin/step-one',
	replace: 'true',
    controller: 'Step_one'
  }).
  when('/step-two', {
    templateUrl:'set-pin/step-two',
	replace: 'true',
    controller: 'Step_two'
  }).
  when('/step-three', {
    templateUrl:'set-pin/step-three',
	replace: 'true',
    controller: 'Step_three'
  }).
  when('/step-four', {
    templateUrl:'set-pin/step-four',
	replace: 'true',
    controller: 'Step_four'
  }).
  when('/step-five', {
    templateUrl:'set-pin/step-five',
	replace: 'true',
    controller: 'Step_five'
  }).
  otherwise({
    redirectTo: '/step-one'
  });
}]);