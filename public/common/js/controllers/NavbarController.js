angular.module('app')
  .controller('NavbarController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location, $cookies) {
    console.log($rootScope.user);
    $scope.logOut = function () {
        APIService.LogOut()
            .success(function() {
                $rootScope.sessionToken = null;
                $cookies.remove("sessionToken");
                $location.path('/login').replace();
                $rootScope.currentUser = null;
            })
            .error(function(error) {
                alert('Error:' + error.code + ' ' + error.message);
                $location.path('/login').replace();
                $rootScope.currentUser = null;
            });
    };

  }]);
