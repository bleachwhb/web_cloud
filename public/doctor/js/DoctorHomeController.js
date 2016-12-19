angular.module('app')
  .controller('DoctorHomeController', ['$scope', '$rootScope', '$location', 'APIService',
    function($scope, $rootScope, $location, APIService) {
    if ($rootScope.sessionToken === undefined) {
        $rootScope.beforeURL = $location.path();
        $location.path("/");
      }
    else {
      console.log("hi");
      APIService.GetDoctorAppointments()
        .success(function(results) {
          console.log(results);
          $scope.appointments = [];
          results.forEach(function(appointmet) {
            var newtime =  changetime2(appointmet.time);
            $scope.appointments.push({
              time: newtime,
              patientId: appointmet.patient.id,
              name: appointmet.patient.firstname + ' ' + appointmet.patient.lastname,
              age: _calculateAge(appointmet.patient.dateOfBirth),
              gender: appointmet.patient.gender,
              nexttime: new Date()
            })
          }); //forEach
        })
        .error(function(error) {
          alert(error.code + ' ' + error.message);
        })
    }
    // client.set('framework', 'AngularJS');
    // client.get('framework', function(err, reply) {
    //     console.log(reply);
    // });

    $scope.addNewAppointment = function(appointment) {
      var data = {
        date: writePatientsInfo(item), // NEED TO CHANGE!!!!!!!!!!!
        patientId: appointment.patientId
      };
      APIService.AddDoctorAppointment(data)
        .success(function(result){
          APIService.GetDoctorAppointments()
            .success(function(results) {
              console.log(results);
              $scope.appointments = [];
              results.forEach(function(appointmet) {
                $scope.appointments.push({
                  time: newtime,
                  patientId: appointmet.patient.id,
                  name: appointmet.patient.firstname + ' ' + appointmet.patient.lastname,
                  age: _calculateAge(appointmet.patient.dateOfBirth),
                  gender: appointmet.patient.gender,
                  nexttime: new Date()
                })
              }); //forEach

            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            })
        })
        .error(function(error) {
          alert(error.code + ' ' + error.message);
        })
    }

}]);


function _calculateAge(dateOfBirth) {
  var birthday = new Date(dateOfBirth);
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function writePatientsInfo (item) {
        var NextAppointment = Parse.Object.extend("Appointment");
        var nextappointment = new NextAppointment;
        nextappointment.save({
            time: $scope.thistime
        },{
            success:function(nextappointment) {
                alert('success');
            },
            error: function(nextappointment,error) {
                alert(error.message);
            }
        });
}
function changetime2(element) {
   var time_string = element.toString(); 
   var n = time_string.indexOf('T'); 
   var res1 = time_string.substring(0,n);
   var res2 = time_string.substring(n+1,n+6);
   var res = res1 +' '+ res2;
   //var res = res_temp.concat(res2); 
   return res;
};