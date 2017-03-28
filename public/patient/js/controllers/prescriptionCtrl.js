angular
.module('app')
.controller('prescriptionCtrl', ['$scope', '$rootScope', '$location', 'APIService','$q',
	function($scope, $rootScope, $location, APIService, $q) {
	bottleUpdateList = []

    if ($rootScope.sessionToken === undefined) {
      $rootScope.beforeURL = $location.path();
      $location.path("/");
    }
    else {
    	$scope.pRetrieved = 0
		function asyncGreet() {
		  return $q(function(resolve, reject) {
		  	APIService.GetRelatedBottles('8FJOGrTheH')
	           .success(function(results) {
	             $scope.bottleInfo = results;
	             console.log("service called ", $scope.bottleInfo)
	           })
	           .error(function(error) {
	             console.log("serviced failed")
	             alert(error.code + ' ' + error.message);
	           });

		  	APIService.GetPatientPrescription()
				.success(function(results) {
					$scope.prescriptions = results;
					console.log("results are ", $scope.prescriptions, " and ", results)
				})
				.error(function(error) {
					alert(error.code + ' ' + error.message);
				});
			

		  	setTimeout(function() {
				if($scope.prescriptions) {
					resolve("succeeded")
				} else {
					reject ("Failed!")
				}
			}, 2000);
		  });
	    }

	    var promise = asyncGreet();
		promise.then(function(greeting) {
		  console.log('Success: ', $scope.prescriptions);
		  $scope.pRetrieved = 1;
		  $scope.retrieveData()
		  console.log("done")
		}, function(reason) {
		  alert('Failed to retrieve prescriptions: ' + reason);
		});


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


	    $scope.retrieveData = function() {
	        var pillData = []
	        $scope.prescriptionPoints = []
	        $scope.prescriptionPts = []
	        var d = new Date()
			var weekday = new Array(7);
			weekday[0] =  "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var todayDay = weekday[d.getDay()];

	        for (i in $scope.prescriptions) {
	        	// console.log("i level are ", $scope.prescriptions[i])
	          for (j in $scope.prescriptions[i].schedule) {
	          	  // console.log("j level are ", $scope.prescriptions[i].schedule)
	              for (k in $scope.prescriptions[i].schedule[j].days) {
	              	// console.log("k level is ", $scope.prescriptions[i].schedule[j].days[k])
	                if ($scope.prescriptions[i].schedule[j].days[k].amount > 0) {
	                	// console.log("pDays are ", $scope.prescriptions[i].schedule[j].days[k].name, " and ", todayDay)
	                	if ($scope.prescriptions[i].schedule[j].days[k].name == todayDay) {
	                		// console.log("time is ", $scope.prescriptions[i].schedule[j].time)
	                		$scope.prescriptionPts.push({
	                			x: $scope.prescriptions[i].pill,
	                			y: getHr($scope.prescriptions[i].schedule[j].time)
	                		})	
	                	}
	                }
	              }
	          }
	        }
	        // $scope.prescriptions[i].schedule[j].time
	        // console.log("prescription points are ", $scope.prescriptionPoints)
	        // retrieve bottle
	        function getBottleDay(date) {
	          var newDate = new Date(date.substring(10,18))
	          return newDate
	        }

	        function getBottleHour(date) {
	          var newHour = date.substring(0, 2)
	          return newHour
	        }
	        // console.log("bottle INFO is ", $scope.bottleInfo)

	        for (bott in $scope.bottleInfo) {
	            for (j in $scope.bottleInfo[bott].updates) {
	                bottleUpdateList.push($scope.bottleInfo[bott].updates[j].timestamp)
	            }
	        }

	        bottleDayList = []
	        bottleHourList = []
	        var bottlePoints = []

	        console.log(bottleUpdateList)
	        for (date in bottleUpdateList) {
	        	var bottleDate = getBottleDay(bottleUpdateList[date])
	        	var bottleDay = bottleDate.setHours(0,0,0,0)
	        	date1 = new Date()
	        	date1.setHours(0,0,0,0)
	        	// var todaysDate = date1.setHours(0,0,0,0)
	        	// console.log("comparing date ", bottleDate.getTime(), " and ", date1.getTime(), " and ", bottleDate == date1)
	        	if (bottleDate.toDateString() == date1.toDateString()) {
	              console.log("prescriptions are ", $scope.prescriptionPts)
	              var bHour = getBottleHour(bottleUpdateList[date])
	              for (i in $scope.prescriptionPts) {
	                 var hDiff = Math.abs(bHour - $scope.prescriptionPts[i].y)
	                 var taken = false
	                 if (hDiff <= 2) {
		              	taken = true
		             }  
		             var stringTaken = taken.toString()
		             $scope.prescriptionPoints.push({
	            		x: $scope.prescriptionPts[i].x,
	            		y: $scope.prescriptionPts[i].y,
	            		z: taken
	               	 })	


	                 // console.log("hdiff is ", hDiff)
	              }
	              
	              // console.log("hr diff is ", hDiff)
	              // if (hDiff <= 2) {
	              // 	taken = true
	              // }  
	              
	              // console.log("taken is ", stringTaken, " and ", stringTaken=="false")
		          bottlePoints.push({
		            x: bottleDate,
		            y: getBottleHour(bottleUpdateList[date])
		          })
		        }
	        }
	       // console.log("end is ", $scope.prescriptionPoints, "and ", $scope.prescriptionPts)
	       if ($scope.prescriptionPoints.length==0) {
	       		// console.log("entered")
	       		$scope.prescriptionPoints = $scope.prescriptionPts.concat()
	       }
	       console.log("new end is ", $scope.prescriptionPoints)

	        console.log("bottle points are ", bottlePoints)
  	    } // retrieveData()
    }


	    
	
 


}]);