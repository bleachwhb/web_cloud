angular.module('app')
  .controller('NavbarController', ['$rootScope', '$scope', '$location', '$cookies', 'APIService', function ($rootScope, $scope, $location, $cookies, APIService) {
    // console.log($rootScope.user);
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

    $scope.isActive = function(viewLocation) {
        locationPath = "/#".concat($location.path())
        // console.log('comparing ', viewLocation, ' and ', locationPath)
        // console.log('isactive is ', viewLocation === locationPath)
        return viewLocation === locationPath
    }

  }]);
