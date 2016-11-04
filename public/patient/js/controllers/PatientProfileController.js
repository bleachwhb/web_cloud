angular.module('app')
    .controller('PatientProfileController',
    ['$scope', '$rootScope', '$cookies', '$location', '$cookies', 'APIService',
    function($scope, $rootScope, $cookies, $location, $cookies, APIService) {
        if ($rootScope.sessionToken) {
            APIService.GetUser()
                .success(function(user) {
                    console.log(user);
                    $rootScope.user = {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        gender: user.gender,
                        email: user.email,
                        phone: user.phone,
                        type: user.type
                    }
                })
                .error(function(error) {
                    alert(error.code + ' ' + error.message);
                });
        } else {
            $rootScope.sessionToken = null;
            $cookies.remove("sessionToken");
            $location.path('/login').replace();
        }
    }]);
