angular.module('app')
  .controller('patient_graphCtrl', ['$scope', '$rootScope', '$location', 'APIService',
    function($scope, $rootScope, $location, APIService) {

    function getDays(day) {
      var d = new Date(),
        month = d.getMonth(),
        dayList = [];
      d.setDate(day);
      // Get the first Monday in the month
      while (d.getDay() !== day) {
        d.setDate(d.getDate() + 1);
      }
      // Get all the other Mondays in the month
      while (d.getMonth() === month) {
        dayList.push(new Date(d.getTime()));
        d.setDate(d.getDate() + 7);
      }
      return dayList;
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
            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            });
        };

    };

    function getHr(element) {
          var n = element.indexOf('T')
          return Number(element.substring(n+1,n+3)) - 5
    }

    var dateToNum = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6
    }

    var chartI = 0

    var prescriptionPoints;

    $scope.retrieveData = function(patient) {

        patientName = patient.firstName + " " + patient.lastName

        var pillData = []



        var prescriptionPoints = new Array();

        for (m =0; m < $scope.prescriptions.length; m++) {
          prescriptionPoints[m] = new Array();
          for (n = 0; n < $scope.prescriptions[m].times.length; n++) {
              prescriptionPoints[m][n] = new Array();
          }
        }


        $scope.getPatientPrescription(patient)
        for (i in $scope.prescriptions) {

          // RETRIEVE THE CORRECT DATA
          for (j in $scope.prescriptions[i].times) {
              for (k in $scope.prescriptions[i].times[j].days) {
                if ($scope.prescriptions[i].times[j].days[k].amount > 0) {
                  var pList = getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name])
                  var hr = getHr($scope.prescriptions[i].times[j].time)
                  for (x in pList) {
                      prescriptionPoints[i][j].push({
                          x: pList[x],
                          y: hr
                      })
                  }

                  pillData.push(getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name]))
                  pillData = pillData.concat.apply([], pillData)
                }
              }
          }

      }
         $scope.data = []

          for (i in prescriptionPoints) {
            for (j in prescriptionPoints[i]) {
              $scope.data.push({
                type: "line",
                dataPoints: prescriptionPoints[i][j]
              })
            }
          }



              $scope.chart = new CanvasJS.Chart("myChart0", {
                    title:{
                        text: patientName + "'s Graph"
                    },
                    axisX:{
                        title: "Date",
                        gridThickness: 2
                    },
                    axisY: {
                        title: "Time"
                    },
                    data: $scope.data
                });
                $scope.chart.render()



    }





}]);
