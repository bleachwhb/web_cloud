angular.module('app')
  .controller('ForgotPassController',
    ['$rootScope', '$scope', '$cookies', 'User', 'UI', '$location', 'APIService',
      function ($rootScope, $scope, $cookies, User, UI, $location, APIService) {
        // $scope.forgotPass = 
        // $scope.sendEmail = function() {

        //   console.log('receive send email')
        //   console.log($scope.userEmail)
        //   // APIUtility.


        // } 
        $scope.sendEmail = function (email) {
          console.log('forgot')
          console.log($scope.userEmail);
        APIService.ForgotPass($scope.userEmail)
            .success(function(msg) {
              console.log('msg is ', msg)
                // $rootScope.sessionToken = null;
                // $cookies.remove("sessionToken");
                // $location.path('/login').replace();
                // $rootScope.currentUser = null;
            })
            .error(function(error) {
                // alert('Error:' + error.code + ' ' + error.message);
                // $location.path('/login').replace();
                // $rootScope.currentUser = null;
            });
    };
        

}]);

  // encoding URL
  // 