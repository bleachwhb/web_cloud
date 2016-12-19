angular.module('app')
  .controller('patient_graphCtrl', ['$scope', '$rootScope', '$location', 'APIService',
    function($scope, $rootScope, $location, APIService) {


    function getMondays(date) {
      var d = date || new Date(),
        month = d.getMonth(),
        mondays = [];
      d.setDate(1);
      // Get the first Monday in the month
      while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
      }
      // Get all the other Mondays in the month
      while (d.getMonth() === month) {
        mondays.push(new Date(d.getTime()));
        d.setDate(d.getDate() + 7);
      }
      return mondays;
    }

 
    if ($rootScope.sessionToken === undefined) {
      $rootScope.beforeURL = $location.path();
      $location.path("/");
    }
    else {
      APIService.GetDoctorPatients()
          .success(function(results) {
            $scope.togglePatient = results[0];
            $scope.patients = results;
            APIService.GetPrescription(results[0].patientId)
              .success(function(results) {
                $scope.prescriptions = results;
                // $scope.prescTimes = 
              })
              .error(function(error) {
                alert(error.code + ' ' + error.message);
              });
          })
          .error(function(error) {
            alert(error.code + ' ' + error.message);
          });

        $scope.getPatientPrescription = function(patient) {
          $scope.togglePatient = patient;
          APIService.GetPrescription(patient.patientId)
            .success(function(results) {
              $scope.prescriptions = results;
              // console.log("one prescription is", $scope.prescriptions)
            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            });
        };

    };



    $scope.retrieveData = function(patient) {
    // Parse.initialize("BDo39lSOtPuBwDfq0EBDgIjTzztIQE38Fuk03EcR", "ox76Y4RxB06A69JWAleRHSercHKomN2FVu61dfu3");

      // $scope.chart.options.data = [];
      // $scope.chart.options.title.text = patientName + "'s Weekly Graph Report";
      // pill_times_data = [];
      // $scope.getPatientPrescription

      // var perscription = Parse.Object.extend("Perscription");
      // var query = new Parse.Query(Perscription);
      // console.log(patientName)
      patientName = patient.firstName + " " + patient.lastName
      // console.log("patient name is ", patientName)

      $scope.getPatientPrescription(patient)
      console.log($scope.prescriptions)
      for (i in $scope.prescriptions) {
            for (j in $scope.prescriptions[i].times) {
                for (k in $scope.prescriptions[i].times[j].days) {
                  if ($scope.prescriptions[i].times[j].days[k].amount != null) {
                    console.log("name is ", $scope.prescriptions[i].times[j].days[k].name)
                    console.log("time is ", ISODate($scope.prescriptions[i].times[j].time))
                    console.log("hour is ", $scope.prescriptions[i].times[j].time.getHours())

                  }
                  // else {
                  //   console.log("name doesn't exist")
                  // }
                }
              console.log($scope.prescriptions[i].times[j].days)
              console.log($scope.prescriptions[i].times[j])
            }
            // prescriptionPoints.push({
            //     x: pillData[i],
            //     y: pillData[i].getHours()
            // })
      }



      pillData = getMondays()
      dateX = []
      timeY = []
      var prescriptionPoints = []
      for (i in pillData) {
            prescriptionPoints.push({
                x: pillData[i],
                y: pillData[i].getHours()
            })
      }

      // console.log("data points is ", prescriptionPoints)
      $scope.data= [{
            type: "line",
            dataPoints: prescriptionPoints
      }]


      $scope.data = [
      {        
        type: "line",
        dataPoints: prescriptionPoints
      }
      ]
      // console.log("data  is ", $scope.data)
      $scope.chart = new CanvasJS.Chart("myChart", {
          title:{
              text: patientName + "'s Graph"
          },
          axisX:{
              title: "Date",
              gridThickness: 2
          },
          axisY: {
              title: "Hour"
          },
          data: $scope.data
      });

      $scope.chart.render()
    }



}]);