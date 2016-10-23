angular.module('app')
  .controller('SignupController',
    ['$rootScope', '$scope', '$cookies', 'User', 'UI', '$location', 'APIService',
      function ($rootScope, $scope, $cookies, User, UI, $location, APIService) {


      $scope.register = function () {
        if ($scope.password !== $scope.password_confirm) {
          alert('Passwords do not match!');
        }
        var user = {
          email: $scope.email,
          password: $scope.password,
          firstname: $scope.firstname,
          lastname: $scope.lastname,
          phone: $scope.phone,
          gender: $scope.gender,
          dob: $scope.dt
        };

        var additionalInfo = {
          hospitalName: $scope.hospitalName,
          hospitalAddress: $scope.hospitalAddress,
          hospitalCity: $scope.hospitalCity
        };

        APIService.SignUp(user, $scope.accountType, additionalInfo)
          .success(function(res) {
            console.log(res.sessionToken);
            $rootScope.sessionToken = res.sessionToken;
            $cookies.put("sessionToken", res.sessionToken);
            //Get user information
            APIService.GetUser()
              .success(function(user) {
                console.log(user);
                $rootScope.user = user;
                if ($scope.accountType === "Patient") {
                  $location.path("/patient/home");
                }
                else if ($scope.accountType === "Doctor") {
                  $location.path("/doctor/home");
                }
                else {
                  //Go To Login Page
                  $location.path("/login");
                }
              })
              .error(function(error) {
                alert(error.code + ' ' + error.message);
              });
          })
          .error(function(error) {
            alert(error.code + ' ' + error.message);
          });
      };
      $scope.reset = function () {
          $scope.firstname = '';
          $scope.lastname = '';
          $scope.sex = '';
          $scope.dt = null;
          $scope.phone = '';
          $scope.accountType = '';
          $scope.hospitalName = '';
          $scope.hospitalAddress = '';
          $scope.hospitalCity = '';
          $scope.email = '';
          $scope.password = '';
          $scope.password_confirm = '';
      };
      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function() {
        console.log($scope.dt);
        $scope.dt = null;
      };

      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yyyy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      // Disable weekend selection
      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }

      $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
      };

      $scope.toggleMin();

      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };
      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      }

      // Save the new user to Parse
      function saveNewUser(user, accountType, additionalInfo) {
        var newUser = new Parse.User();
        newUser.set("username", user.email);
        newUser.set("password", user.password);
        newUser.set("email", user.email);
        newUser.set("phone", user.phone);
        newUser.set("firstname", user.firstname);
        newUser.set("lastname", user.lastname);
        newUser.set("gender", user.gender);

        console.log(newUser)
        var query = new Parse.Query(Parse.User);
        query.equalTo("email", user.email);
        query.first({
          success: function (foundUser) {
            if (foundUser) {
              var pp = foundUser.get("patientPointer");
              var dp = foundUser.get("doctorPointer");
              if ((pp !== null) && (accountType == "Patient")) {
                alert("There already exists a patient profile registered to this email");
              }
              else if ((dp !== null) && (accountType == "Doctor"))
                alert("There already exists a doctor profile associated with this email");
              else if (accountType == "Doctor" & (dp === null)) {
                var r = confirm("This email already has a patient profile. Would you also like to create a doctor profile for this email?");
                if (r === true) {
                  var doctor = new Parse.Object("Doctor");
                  doctor.set("address", additionalInfo.hospitalAddress);
                  doctor.set("hospitalCity", additionalInfo.hospitalCity);
                  doctor.set("hospitalName", additionalInfo.hospitalName);
                  doctor.set("userAccount", foundUser);
                  doctor.save(null, {
                    success: function (doc) {
                      Parse.Cloud.run('saveUserWithNewPointer', {
                        user: foundUser.id,
                        pointer: doc.id,
                        newRole: "Doctor"
                      }, {
                        success: function (s) {
                          alert("user saved, " + s);
                        },
                        error: function (e) {
                          alert("error: " + e.message);
                        }
                      });
                    }
                  });
                }
              }
              else if (accountType == "Patient" & (pp === null)) {
                var r = confirm("This email already has a doctor profile. Would you also like to create a patient profile for this email?");
                if (r === true) {
                  var patient = new Parse.Object("Patient");
                  patient.set("userAccount", foundUser);
                  patient.save(null, {
                    success: function (pat) {
                      Parse.Cloud.run('saveUserWithNewPointer', {
                        user: foundUser.id,
                        pointer: pat.id,
                        newRole: "Patient"
                      }, {
                        success: function (s) {
                          alert("user saved, " + s);
                        },
                        error: function (e) {
                          alert("error: " + e.message);
                        }
                      });
                    }
                  });
                }
              }

            }
            else {
              newUser.signUp(user, {
                success: function (newUser) {
                  setUR(newUser, user, accountType, additionalInfo);
                },
                error: function (newUser, error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });

            }
          },
          error: function () {
            console.log('wtf')
          }
        });

      }


      function setUR(newUser, user, accountType, additionalInfo) {
        Parse.Cloud.run('setUserRole', {accountType: accountType}, {
          success: function (role) {
            alert("The user role has been successfully set to " + accountType);
            if (accountType.toLowerCase() == "patient") {
              Parse.Cloud.run('setPatient', {username: newUser.getUsername()}, {
                success: function (newUser) {
                  alert("The patient is successfully set");
                },
                error: function (error) {
                  alert("Failed to set patient " + error.code + " " + error.message);
                }
              });
            } else if (accountType.toLowerCase() == "doctor") {
              var doctor = new Parse.Object("Doctor");
              doctor.set("address", additionalInfo.hospitalAddress);
              doctor.set("hospitalCity", additionalInfo.hospitalCity);
              doctor.set("hospitalName", additionalInfo.hospitalName);
              doctor.set("userAccount", newUser);
              doctor.save(null, {
                success: function (doc) {
                  newUser.set("doctorPointer", doc);
                  newUser.save();
                }
              });

            } else if (accountType.toLowerCase() == "pharmacy") {
              newUser.set("userType", ["PharmacyStuff"]);
            }
          },
          error: function (error) {
            alert("Failed to set user role to " + accountType + " " + error.code + " " + error.message);
          }
        });
        alert("Successfully registered");
      }
    }]);
