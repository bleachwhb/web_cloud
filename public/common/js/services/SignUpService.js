angular.module('app')
  .factory('SignUpService', function($rootScope, APIUtility){
      console.log('SignUpService!');
      return {
          saveNewUser: function(user, accountType, addtionalInfo) {
              APIUtility.POST('/user', user)
                  .success(function (data, status, headers, config) {
                      console.log(data);
                  })
                  .error(function (data, status, header, config) {
                      console.log(data);
                  });
              return 1;

          }
      }

});