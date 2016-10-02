angular.module('app')
  .factory('SignUpService', function ($rootScope, APIUtility) {

    return {
      saveNewUser: function (user, accountType, addtionalInfo) {
        var deferred = APIUtility.defer();
        if (accountType === "Patient") {
          APIUtility.POST('/patient', user)
            .then(function (data, status, headers, config) {
              return deferred.resolve({
                token: 'qwqwqe'
              });
            }, function (data, status, header, config) {
              return deferred.reject({
                message: data.mesage
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

      }
    }

  });