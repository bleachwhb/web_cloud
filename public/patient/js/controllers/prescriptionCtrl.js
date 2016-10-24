'use strict';
angular
.module('app')
.controller('prescriptionCtrl', ['$scope', '$rootScope', '$location', 'Patient',
	function($scope, $rootScope, $location, Patient) {
    $scope.checked = false;// if the patient have taken this pill: showing checked span
    $scope.unchecked = !$scope.checked;// else showing unchecked;
    // console.log($scope.unchecked);

    if ($rootScope.sessionToken === undefined) {
    	$rootScope.beforeURL = $location.path();
			$location.path("/");
		}
    // funtion: addZero
    // add 0 to one digit numbers to modify the format of time
    var addZero = function(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	};

    $scope.month = "";
    $scope.date = "";
    var currentdate = new Date();

    $scope.month = addZero(currentdate.getMonth()+1);
    $scope.date = addZero(currentdate.getDate());
	// console.log(currentdate.getHours());
    // console.log($scope.month);
    // console.log(currentdate.getDate());
    // get the abbrevation of day_of_week

    var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

    $scope.day_of_week = weekday[currentdate.getDay()];

    var query = new Parse.Query(Parse.Object.extend("Prescription"));

    var patientID = "zRHovNfcMv";
	query.equalTo("patientID", {
		__type: "Pointer",
		className: "Patient",
		objectId: patientID["id"],
	});

	var timesAvailable = [];

	var prescriptions = [[], [], [], []];

	function showPrescription() {
		// for (var i = 0; i < 4; i++) {
		// 	createPrescriptionDiv(i);
		// }
		query.find({
			success: function(res) {
				$scope.$apply(function() {
					for (var p = 0; p < res.length; p++) {
						handlePrescription(res[p]);
					}
				})
			},
			error: function(err) {
				console.log(err);
			}
		});

		return 1;
	}
	
    showPrescription();  

    function handlePrescription(item) {
		var schedule = item.get("schedule");
		var scheduleID = schedule["id"];

		var scheduleList = Parse.Object.extend("Schedule");
		var scheduleQuery = new Parse.Query(scheduleList);

		scheduleQuery.get(scheduleID).then(function(schedule) {

			var mon = schedule.get("Monday");
			var tues = schedule.get("Tuesday");
			var wed = schedule.get("Wednesday");
			var thurs = schedule.get("Thursday");
			var fri = schedule.get("Friday");
			var sat = schedule.get("Saturday");
			var sund = schedule.get("Sunday");

			var days = [mon, tues, wed, thurs, fri, sat, sund];

			//keep track of all available times, will make table consistent
			var currentdate = new Date();
			var d = (currentdate.getDay() + 6) % 7;

			var times = Object.keys(days[d]);
			// console.log(times);

			for (var t = 0; t < times.length; t++) {
				var temp = times[t];
				var hour = parseInt(temp.substr(0, 2));
				// console.log("handlePrescription", t, hour);
				if (0 <= hour && hour < 6) {insertRow(0, item.get("pillName"), days[t], times[t]);}
				if (6 <= hour && hour < 10) {insertRow(1, item.get("pillName"), days[t], times[t]);}
				if (10 <= hour && hour < 14) {insertRow(2, item.get("pillName"), days[t], times[t]);}
				if (14 <= hour && hour < 18) {insertRow(3, item.get("pillName"), days[t], times[t]);}
				if (18 <= hour && hour < 24) {insertRow(4, item.get("pillName"), days[t], times[t]);}
			}
			
			//prescriptionNum is to make id unique in createPrescriptionDiv
			// createPrescriptionDiv(item.get("pillName"), item["id"], days, schedule["id"], $rootScope.currentUser, 0);

		});
	}



function insertRow(periodID, name, amount, time) {
	// console.log("insertRow", periodID, time);
	var ids = ["period0", "period1", "period2", "period3", "period4"];
	var table = document.getElementById(ids[periodID]);

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(table.length);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	// var cell3 = row.insertCell(2);

	var color = "<font color='ff0000'>";

	// Parse.initialize("BDo39lSOtPuBwDfq0EBDgIjTzztIQE38Fuk03EcR", "ox76Y4RxB06A69JWAleRHSercHKomN2FVu61dfu3");

	// var query1 = new Parse.Query(Parse.Object.extend("TestXZ"));

	

	// // Add some text to the new cells:
	cell1.innerHTML = color + name+ '</font>';
	// cell3.innerHTML = color + time + '</font>';
	cell2.innerHTML = color + amount[time]  + '</font>';
	cell1.id = name;
	return;
}

// $scope.test = "wtf";
var nameList = [];
var timeList = [];
function showTestXZ() {

	var scheduleList = Parse.Object.extend("TestXZ");
	var query1 = new Parse.Query(scheduleList);

	// Include user account info so we don't have to do another query
	// query1.include('TIME');

	query1.find({
		success: function(res) {
			$scope.$apply(function() {
				// console.log(res);
				for (var p = 0; p < res.length; p++) {
					console.log(res[p].get("TIME"), res[p].get("NAME"));
					nameList.push(res[p].get("NAME"));
					timeList.push(res[p].get("TIME"));
				}
			})
		},
		error: function(err) {
			console.log(err);
		}
	});

}

showTestXZ();


setTimeout(function(){
	var ids = ["period0", "period1", "period2", "period3", "period4"];
	var times = [0, 6, 10, 14, 18, 24];

	for (var index = 0; index < 5; index++) {

		var oTable = document.getElementById(ids[index]);

		//gets rows of table
		var rowLength = oTable.rows.length;

		//loops through rows    
		for (var temp_i = 0; temp_i < rowLength; temp_i++){

		//gets cells of current row
		var oCells = oTable.rows.item(temp_i).cells;

		//gets amount of cells of current row
		var cellLength = oCells.length;

		//loops through each cell in current row
		// for(var j = 0; j < cellLength; j++){
		console.log(oCells[0].innerText);

		var exist = false;
		var temp = nameList.indexOf(oCells[0].innerText);
		if (temp >= 0) {
			var hour = parseInt(timeList[temp].substr(2, 4));
			if (times[index] <= hour && hour <= times[index+1]) 
				document.getElementById(oCells[0].innerText).innerHTML = "<font color='00ff00'>" + oCells[0].innerText + "</font>";
			else
				document.getElementById(oCells[0].innerText).innerHTML = "<font color='ffff00'>" + oCells[0].innerText + "</font>";
		}
		}
	}
	

	console.log("nameList = " + nameList);
}, 10000);


}]);
