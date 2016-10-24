angular.module('app')
  .controller('DoctorHomeController', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
      console.log('reached home controller');

      if ($rootScope.sessionToken === undefined) {
        $rootScope.beforeURL = $location.path();
        $location.path("/");
      }
	    $scope.getPatientsInfo2 = function() {
        Parse.initialize("BDo39lSOtPuBwDfq0EBDgIjTzztIQE38Fuk03EcR", "ox76Y4RxB06A69JWAleRHSercHKomN2FVu61dfu3");

        $scope.sortedName = []

        console.log("AAAA")
        var patientList = Parse.Object.extend("Patient");
        var query = new Parse.Query(patientList);

        // Include user account info so we don't have to do another query
        query.include('userAccount').ascending('firstname');

        // Use a dict to save name/user pairs and sort later
        var unsortedNames = [];

        query.find({
            success: function(patients) {

            $scope.$apply(function() {
                for (var i = 0; i < patients.length; i++) {
                    var user = patients[i].get("userAccount");
                    // console.log(user);

                    if (user != undefined) {
                        var firstname = user.get("firstname");
                        var lastname = user.get("lastname");
                        var age = user.get("age");
                        var gender = user.get("gender");
                        var email = user.get("email");
                        var phone = user.get("phone");
                        // var imageURL = user.get("photo");

                        if (firstname != undefined && lastname != undefined) {
                            var name = firstname + " " + lastname + " " + age + " " +
                                        gender + " " + email + " " + phone;
                            var userAndName = {
                                lastName: lastname,
                                name: name,
                                user: user
                            };
                            unsortedNames.push(userAndName);
                        }
                    }
                }

                // sortedNames.push.apply(sortedNames, Object.keys(unsortedUsers));
                // Ascending, for descending, use sortedNames.sort().reverse()
                // Or, use a customized rule. There is no out-of-box sorting for a nested query.
                unsortedNames.sort(function(a, b) {
                    if (a['lastName'] < b['lastName']) return -1;
                    if (a['lastName'] > b['lastName']) return 1;
                    return 0;
                });
                for (var i = 0; i < unsortedNames.length; i++) {
                    var sortedUser = unsortedNames[i]["user"];
                    $scope.sortedName.push(unsortedNames[i]["name"]);
                }

                // console.log($scope.sortedName)
              });
            },
            error: function(error) {
                alert(error.message);
            }
        });
    }

    $scope.getPatientsInfo2();

}]);