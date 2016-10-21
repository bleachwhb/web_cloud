angular.module('app')
  .factory('APIService', function ($rootScope, APIUtility) {

    return {
      SignUp: function (user, accountType, addtionalInfo) {
        var deferred = APIUtility.defer();
        if (accountType === "Patient") {
          APIUtility.POST('/patient', user)
            .then(function (data, status, headers, config) {
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
        else if (accountType === "Doctor") {
          APIUtility.POST('/doctor', user)
            .success(function (data, status, headers, config) {
              console.log(data);
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
        }
        else if (accountType === "Pharmacy") {
          APIUtility.POST('/pharmacy', user)
            .success(function (data, status, headers, config) {
              console.log(data);
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
        }

      },
      Login: function (username, password) {
        var deferred = APIUtility.defer();
        var loginInfo = {
          username: username,
          password: password
        };
        APIUtility.POST('/login', loginInfo)
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
      },
      GetUser: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/user')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      }
    }

  });
