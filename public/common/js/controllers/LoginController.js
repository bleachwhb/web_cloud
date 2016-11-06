angular.module('app')
  .controller('LoginController', ['$rootScope', '$scope', '$cookies', 'User', 'UI', '$location', 'APIService',
    function ($rootScope, $scope, $cookies, User, UI, $location, APIService) {
      $scope.accType = "Patient";
      $scope.logIn = function () {
        console.log('called');
        APIService.Login($scope.email, $scope.password)
          .success(function(res) {
            $rootScope.sessionToken = res.sessionToken;
            $cookies.put("sessionToken", res.sessionToken);
            APIService.GetUser()
              .success(function(user) {
                console.log(user);
                $rootScope.user = user;
                if (user.type % 2 === 1) {
                  $location.path('/patient/home');
                }
                else if ((user.type/10) % 2 === 1) {
                    $location.path('/doctor/home');
                }
                else {
                  alert("Unknown user type: " + user.type);
                }
              })
              .error(function(error) {
                console.log(error);
                alert('Invalid username/password combination' + error.code + ' ' + error.message);
              })
          })
          .error(function(error) {
            console.log(error);
            alert('Invalid username/password combination' + error.code + ' ' + error.message);
          });
      };


  }]);
