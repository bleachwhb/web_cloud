angular.module('app')
    .factory('APIUtility', function($rootScope, $http){
        var appId = $rootScope.appId;
        var host = $rootScope.apiServer;
        var config = {
            headers : {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id': appId
            }
        };
        return {
            GET: function(path, data) {
                return $http.post(host+path, data, config)
            },
            POST: function(path, data) {
                return $http.post(host+path, data, config)
            }
        }

    });