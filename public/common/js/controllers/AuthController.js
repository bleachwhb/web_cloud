angular.module('app')
  .controller('AuthController', ['$rootScope', '$scope', '$cookies', '$location', 'APIService',
    function ($rootScope, $scope, $cookies, $location, APIService) {
      console.log('Auto login...');
      var sessionToken = $cookies.get("sessionToken");
      if (sessionToken === undefined) {
        $location.path("/login");
      }
      else {
        $rootScope.sessionToken = sessionToken;
        APIService.GetUser()
          .success(function(user) {
            $rootScope.user = user;
            if ($rootScope.beforeURL === undefined) {
              if (user.type%2 === 1) {
                $location.path("/patient/home");
              }
              else if ((user.type/10)%2 === 1) {
                $location.path("/doctor/home");
              }
              else {
                $location.path("/login");
              }
            }
            $location.path($rootScope.beforeURL);
          })
          .error(function () {
            $location.path("/login");
          })
      }
    }]);