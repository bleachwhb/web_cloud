angular.module('app')
  .controller('DoctorHomeController', ['$scope', '$rootScope', 'Patient', '$timeout', '$http', function($scope, $rootScope, Patient,Appointment) {
  console.log('reached home controller');
//   $rootScope.user = {
// 		firstname: $rootScope.currentUser.get('firstname'),
// 		lastname: $rootScope.currentUser.get('lastname'),
// 		age: $rootScope.currentUser.get('age'),
// 		gender: $rootScope.currentUser.get('gender'),
// 		email: $rootScope.currentUser.get('email'),
// 		phone: $rootScope.currentUser.get('phone'),
// 		imageURL: $rootScope.currentUser.get("photo").url(),
// 	};

    $rootScope.user = {
		firstname: $rootScope.currentUser.get('firstname'),
		lastname: $rootScope.currentUser.get('lastname'),
		age: $rootScope.currentUser.get('age'),
		gender: $rootScope.currentUser.get('gender'),
		email: $rootScope.currentUser.get('email'),
		phone: $rootScope.currentUser.get('phone'),
        appointment: $rootScope.currentUser.get('Appointments')
	};

	$scope.getPatientsInfo2 = function() {
        // Parse.initialize("BDo39lSOtPuBwDfq0EBDgIjTzztIQE38Fuk03EcR", "ox76Y4RxB06A69JWAleRHSercHKomN2FVu61dfu3");

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
                        var appointment= user.get("Appointments");

                        if (firstname != undefined && lastname != undefined) {
                            // var name = firstname + " " + lastname + " " + age + " " +
                            //             gender + " " + email + " " + phone;
                            var name = firstname + " " + lastname;
                            var userAndName = {
                                lastName: lastname,
                                name: name,
                                user: user,
                                age : age,
                                gender: gender,
                                appointment: appointment
                            };
                            unsortedNames.push(userAndName);
                            console.log("unsorted names is ", unsortedNames)

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
                     $scope.sortedName.push(unsortedNames[i]); 
                }
                // for (var i = 0; i < unsortedNames.length; i++) {
                //     var sortedUser = unsortedNames[i]["user"];
                //     $scope.sortedName.push(unsortedNames[i]["name"]);
                // }

                // console.log($scope.sortedName)
              });
            },
            error: function(error) {
                alert(error.message);
            }
        });
    //     query.save({
    //         success: function(patients){

    //         },
    //         error: function(error) {
    //             alert(error.message);
    //         }
    //     });
    // }
    // console.log(unsortedNames)
    }
    $scope.getPatientsInfo2();
    
}]);