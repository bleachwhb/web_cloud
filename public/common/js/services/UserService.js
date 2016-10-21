angular.module('app')
  .factory('LoginService', function ($rootScope, APIUtility) {

    return {
      login: function (username, password) {
        var deferred = APIUtility.defer();
        APIUtility.GET('/user')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve({
              sessionToken: data.data.sessionToken
            });
          }, function (data, status, header, config) {
            return deferred.reject({
              code: data.data.code,
              message: data.data.message
            })
          });
        return deferred.promise;
      }
    }

  });
