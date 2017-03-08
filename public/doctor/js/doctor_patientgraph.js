angular.module('app')
  .controller('patient_graphCtrl', ['$scope', '$rootScope', '$location', 'APIService',
    function($scope, $rootScope, $location, APIService) {
    bottleUpdateList = []
    var presc

    var monthView = true
    var weekView = false

    $scope.switchMonthView = function(){
      monthView = true
      weekView = false
        $scope.retrievePrescription(presc);
    }

    $scope.switchWeekView = function(){
      weekView = true
      monthView = false
        $scope.retrievePrescription(presc);
    }

    $scope.switchAllTimeView = function() {
        monthView = false
        weekView = false
        $scope.retrievePrescription(presc);
    }

    function datesFallInCurrentWeek(bottleList) {
   //     console.log(bottleList.length);
        selectedDates = []
      for (i = 0 ; i < bottleList.length; i++) {
        if (checkDatesWithinRange(bottleList[i].substring(10), monthView)) {
          selectedDates.push(bottleList[i]);
        }
      }
      return selectedDates;
    }

    function checkDatesWithinRange(day, val) {
      var dateFrom1 = "03/05/2017";
      var dateTo1 = "03/11/2017";
      var dateFrom2 = "03/01/2017";
      var dateTo2 = "03/31/2017";
      var dateCheck = day;

      var from, to
      if (val) {
        from = Date.parse(dateFrom2);
        to   = Date.parse(dateTo2);
      } else {
        from = Date.parse(dateFrom1);
        to   = Date.parse(dateTo1);
      }
      var check = Date.parse(dateCheck);

      return (check <= to && check >= from);
    }

    function getDays(day) {
      var d = new Date(),
        month = d.getMonth(),
        dayList = [];
      d.setDate(day);
      // Get the first Monday in the month
      while (d.getDay() !== day) {
        d.setDate(d.getDate() + 1);
      }

      var today = new Date();

      if (weekView) {
        d.setDate(d.getDate());
          if (today.getTime() >= d.getTime()) {
              dayList.push(new Date(d.getTime()));
          }
      } else if (monthView) {
          while (d.getMonth() === month) {
              if (today.getTime() >= d.getTime()) {
                dayList.push(new Date(d.getTime()));
              }
              d.setDate(d.getDate() - 7);
          }
      } else {
          var slash = "/";
          var dayCreated = presc.pill.createdAt.substring(8, 10).concat(slash);
          var monthCreated = presc.pill.createdAt.substring(5, 7).concat(slash);
          var dateCreated = monthCreated.concat(dayCreated);
          dateCreated = dateCreated.concat(presc.pill.createdAt.substring(0, 4));
          var createdDate = Date.parse(dateCreated);
          while (d >= createdDate) {
              if (today.getTime() >= d.getTime()) {
                  dayList.push(new Date(d.getTime()));
              }
              d.setDate(d.getDate() - 7);
          }
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
 //           console.log("service called ", $scope.bottleInfo)
          })
          .error(function(error) {
 //           console.log("serviced failed")
            alert(error.code + ' ' + error.message);
          });

    };


    function getHr(element) {
          var n = element.indexOf('T')
          return Number(element.substring(n+1,n+3)) - 6
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
        presc = prescription

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
//            console.log("prescription points are ", prescriptionPoints[i])
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

        bottleUpdateList = datesFallInCurrentWeek(bottleUpdateList);
       // console.log(bottleUpdateList.length);

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

       // console.log('diff is bottle is ', bottlePoints, ' and  presc is ', prescriptionPoints[0])

       // console.log("data loaded to graph is ", $scope.data)
        $scope.chart = new CanvasJS.Chart("myChart0", {
              title:{
                  text: prescName + "'s Graph"
              },
              axisX:{
                  title: "Date",
                  gridThickness: 2
              },
              axisY: {
                  title: "Time (hr)"
              },
              data: $scope.data
          });
          $scope.chart.render()
    }








}]);
