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
  //            console.log("one prescription is", $scope.prescriptions)
            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            });
        };

    };

    function getHr(element) {
          var n = element.indexOf('T')
          return Number(element.substring(n+1,n+3))
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


    $scope.retrieveData = function(patient) {

        patientName = patient.firstName + " " + patient.lastName
        //console.log("patient name is ", patientName)

        var pillData = []
        var prescriptionPoints = []

        $scope.getPatientPrescription(patient)
        //console.log($scope.prescriptions)
        for (i in $scope.prescriptions) {

          // RETRIEVE THE CORRECT DATA
          for (j in $scope.prescriptions[i].times) {
              for (k in $scope.prescriptions[i].times[j].days) {
                if ($scope.prescriptions[i].times[j].days[k].amount > 0) {
                  //console.log("name is ", $scope.prescriptions[i].times[j].days[k].name)
                  var pList = getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name])
                  var hr = getHr($scope.prescriptions[i].times[j].time)
  //                console.log(hr)
                  for (x in pList) {
                      prescriptionPoints.push({
                          x: pList[x],
                          y: hr
                      })
                  }

                  pillData.push(getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name]))
                  pillData = pillData.concat.apply([], pillData)
                }
              }
          }


          // CREATE THE GRAPH
          var chartID = "myChart" + i.toString()

/*
          $scope.data = [{
              type: "line",
              dataPoints: prescriptionPoints
          }]
*/
          $scope.chart = new CanvasJS.Chart(chartID, {
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
              data: [{type: "line",
                      dataPoints: prescriptionPoints.slice(0,10)},
                     {type: "line",
                     dataPoints: prescriptionPoints.slice(prescriptionPoints.length - 14)}]
          });
          $scope.chart.render()

          // clear out fields
          var pillData = []
          var prescriptionPoints = []
          chartI = i
    //      console.log("chartI updated to ", chartI, " from ", i)
          // begin next iteration

      }



    }

/*
    var chartList = ""
    console.log("chartI is", chartI)
    for (i=0; i < chartI+1; i++) {
      var curr = '<div id="myChart' + i.toString() + '"></div>'
      chartList = chartList + curr
    }
    console.log("chartlist is ", chartList)

    $scope.myHTML = chartList
*/




}]);
