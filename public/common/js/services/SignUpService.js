angular.module('app')
  .factory('SignUpService', function ($rootScope, APIUtility) {
    console.log('SignUpService!');
    return {
      saveNewUser: function (user, accountType, addtionalInfo) {
        if (accountType === "Patient") {
          APIUtility.POST('/patient', user)
            .success(function (data, status, headers, config) {
              console.log(data);
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
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