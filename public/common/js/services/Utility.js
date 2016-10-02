angular.module('app')
  .factory('APIUtility', function ($rootScope, $http, $q) {
    var appId = $rootScope.appId;
    var host = $rootScope.apiServer;
    var config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': appId
      }
    };
    return {
      GET: function (path, data) {
        return $http.post(host + path, data, config)
      },
      POST: function (path, data) {
        return $http.post(host + path, data, config)
      },
      decorate: function(promise) {
        promise.success = function(callback) {
          promise.then(callback);
          return promise;
        };
        promise.error = function(callback) {
          promise.then(null, callback);
          return promise;
        };
      },
      defer: function() {
        var deferred = $q.defer();
        this.decorate(deferred.promise);
        return deferred;
      }
    }

  });