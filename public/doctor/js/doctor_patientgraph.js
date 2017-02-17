angular.module('app')
  .controller('patient_graphCtrl', ['$scope', '$rootScope', '$location', 'APIService',
    function($scope, $rootScope, $location, APIService) {
    bottleUpdateList = []

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
                // console.log($scope.prescriptions.name);
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
        // APIService.GetPatientBottles('H6RNuGEzgw')
        // .success(function(results) {
        //   $scope.bottleInfo = results;
        //   // console.log("patient bottles are ", $scope.bottleInfo)
        // })
        // .error(function(error) {
        //   alert(error.code + ' ' + error.message);
        // });

        APIService.GetRelatedBottles('8FJOGrTheH')
          .success(function(results) {
            $scope.bottleInfo = results;
            console.log("service called ", $scope.bottleInfo)
          })
          .error(function(error) {
            console.log("serviced failed")
            alert(error.code + ' ' + error.message);
          });

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

    // $scope.retrieveData = function(patient) {

    //     patientName = patient.firstName + " " + patient.lastName

    //     var pillData = []



    //     var prescriptionPoints = new Array();

    //     for (m =0; m < $scope.prescriptions.length; m++) {
    //       prescriptionPoints[m] = new Array();
    //       for (n = 0; n < $scope.prescriptions[m].times.length; n++) {
    //           prescriptionPoints[m][n] = new Array();
    //       }
    //     }


    //     $scope.getPatientPrescription(patient)
    //     for (i in $scope.prescriptions) {

    //       // RETRIEVE THE CORRECT DATA
    //       for (j in $scope.prescriptions[i].times) {
    //           for (k in $scope.prescriptions[i].times[j].days) {
    //             if ($scope.prescriptions[i].times[j].days[k].amount > 0) {
    //               var pList = getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name])
    //               var hr = getHr($scope.prescriptions[i].times[j].time)
    //               for (x in pList) {
    //                   prescriptionPoints[i][j].push({
    //                       x: pList[x],
    //                       y: hr
    //                   })
    //               }

    //               pillData.push(getDays(dateToNum[$scope.prescriptions[i].times[j].days[k].name]))
    //               pillData = pillData.concat.apply([], pillData)
    //             }
    //           }
    //       }
    //     }

    //    $scope.data = []

    //     for (i in prescriptionPoints) {
    //       for (j in prescriptionPoints[i]) {
    //         console.log("prescription points are ", prescriptionPoints[i][j])
    //         $scope.data.push({
    //           type: "line",
    //           dataPoints: prescriptionPoints[i][j]
    //         })
    //       }
    //     }


    //     // retrieve bottle
    //     function getBottleDay(date) {
    //       var newDate = new Date(date.substring(10,18))
    //       return newDate
    //     }

    //     function getBottleHour(date) {
    //       var newHour = date.substring(0, 2)
    //       return newHour
    //     }
    //     for (bott in $scope.bottleInfo) {
    //         for (j in $scope.bottleInfo[bott].updates) {
    //             bottleUpdateList.push($scope.bottleInfo[bott].updates[j].timestamp)
    //         }
    //     }
    //     bottleDayList = []
    //     bottleHourList = []
    //     var bottlePoints = []

    //     console.log(bottleUpdateList)
    //     for (date in bottleUpdateList) {
    //       bottlePoints.push({
    //         x: getBottleDay(bottleUpdateList[date]),
    //         y: getBottleHour(bottleUpdateList[date])
    //       })
    //     }
    //     // console.log(bottlePoints)
    //     console.log("data is ", $scope.data)
    //     // $scope.data.push({
    //     //     type: "line",
    //     //     dataPoints: bottlePoints
    //     //   })




    // $scope.chart = new CanvasJS.Chart("myChart0", {
    //       title:{
    //           text: patientName + "'s Graph"
    //       },
    //       axisX:{
    //           title: "Date",
    //           gridThickness: 2
    //       },
    //       axisY: {
    //           title: "Time"
    //       },
    //       data: $scope.data
    //   });
    //   $scope.chart.render()
    // }

    $scope.retrievePrescription = function(prescription) {

        // FIRST DEAL WITH PRESCRIPTIONS

        prescName = prescription.name
        $scope.data = []

        var pillData = []

        var prescriptionPoints = new Array();

      
        for (n = 0; n < prescription.times.length; n++) {
            prescriptionPoints[n] = new Array();
        }
    

        // RETRIEVE THE CORRECT DATA
        for (j in prescription.times) {
            for (k in prescription.times[j].days) {
              if (prescription.times[j].days[k].amount > 0) {
                var pList = getDays(dateToNum[prescription.times[j].days[k].name])
                var hr = getHr(prescription.times[j].time)
                for (x in pList) {
                    prescriptionPoints[j].push({
                        x: pList[x],
                        y: hr
                    })
                }

                pillData.push(getDays(dateToNum[prescription.times[j].days[k].name]))
                pillData = pillData.concat.apply([], pillData)
              }
            }
        }
    


        for (i in prescriptionPoints) {
            console.log("prescription points are ", prescriptionPoints[i])
            $scope.data.push({
              type: "scatter",
              color: "#778899",
              dataPoints: prescriptionPoints[i]
            })
        }

        // SECOND DEAL WITH BOTLES

        APIService.GetRelatedBottles(prescription)
          .success(function(results) {
            $scope.bottleInfo = results;
            console.log("service called ", $scope.bottleInfo)
          })
          .error(function(error) {
            console.log("serviced failed")
            alert(error.code + ' ' + error.message);
          });

        function getBottleDay(date) {
          var newDate = new Date(date.substring(10,18))
          return newDate
        }

        function getBottleHour(date) {
          var newHour = date.substring(0, 2)
          return Number(newHour)
        }
        for (bott in $scope.bottleInfo) {
            for (j in $scope.bottleInfo[bott].updates) {
                bottleUpdateList.push($scope.bottleInfo[bott].updates[j].timestamp)
            }
        }
        bottleDayList = []
        bottleHourList = []
        var bottlePoints = []

        for (date in bottleUpdateList) {
          bottlePoints.push({
            x: getBottleDay(bottleUpdateList[date]),
            y: getBottleHour(bottleUpdateList[date])
          })
        }


        // console.log("bottle points are ", bottlePoints)
        $scope.data.push({
            type: "scatter",
            color: "#4271f4",
            dataPoints: bottlePoints
          })

        console.log('diff is bottle is ', bottlePoints, ' and  presc is ', prescriptionPoints[0])

        console.log("data loaded to graph is ", $scope.data)
        $scope.chart = new CanvasJS.Chart("myChart0", {
              title:{
                  text: prescName + "'s Graph"
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
