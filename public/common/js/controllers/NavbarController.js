angular.module('app')
  .controller('NavbarController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    console.log($rootScope.user);
    $scope.logOut = function () {
      Parse.User.logOut({
        success: function () {
          $scope.$apply(function () {
          });
        },
        error: function () {
          alert("Error!");
        }
      });
      $location.path('/login').replace();
      $rootScope.currentUser = null;
    };

  }]);
