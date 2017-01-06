var app = angular.module('app', [
  'ngRoute',
  'xeditable',
  'routeStyles',
  'oc.lazyLoad',
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'ngCookies',
  'ngSanitize'
]);

app.run(['$rootScope', '$location', function($rootScope, $location) {
  // Parse.initialize("BDo39lSOtPuBwDfq0EBDgIjTzztIQE38Fuk03EcR", "ox76Y4RxB06A69JWAleRHSercHKomN2FVu61dfu3");
  Parse.initialize("myAppId", "myMasterKey");
  Parse.serverURL = 'http://localhost:5000/parse';// http://129.105.36.93:5000/parse
  $rootScope.currentUser = Parse.User.current();

  $rootScope.location = $location;
  $rootScope.appId = 'myAppId';
  // $rootScope.apiServer = 'http://localhost:5000';
  $rootScope.apiServer = 'http://localhost:5000';   //Online Server //http://129.105.36.93:5000
}]);

