angular.module('app')
  .factory('APIUtility', function ($rootScope, $http, $q) {

    var host = $rootScope.apiServer;

    function createConfig() {
      var appId = $rootScope.appId;
      var sessionToken = $rootScope.sessionToken;
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': appId
        }
      };
      if (sessionToken) {
        config.headers['X-Parse-Session-Token'] = sessionToken;
      }
      return config;
    }

    return {
      GET: function (path) {
        var config = createConfig();
        return $http.get(host + path, config)
      },
      POST: function (path, data) {
        var config = createConfig();
        return $http.post(host + path, data, config)
      },
      DELETE: function (path) {
        var config = createConfig();
        return $http.delete(host + path, config)
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
