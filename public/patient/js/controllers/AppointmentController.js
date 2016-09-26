// 'use strict';
angular.module('app')
.controller('AppointmentController', ['$scope', '$rootScope', 'Patient', function($scope, $rootScope, Patient) {

    $scope.name = "";
    $scope.date = "";
	var timesAvailable = [];

    // $scope.getPrescriptions = function(user) {
    function getPrescriptions(user) {
        console.log(user);

	//reset html
	var pd = document.getElementById("patient_descriptions");
	pd.innerHTML = "<button type='button' id='addBtn' class='btn btn-primary'><i class='fa fa-plus'></i> Add Prescription</button><br/>";


	var patientID = user.get("patientPointer");
	//error checking - make sure it is a patient
	if (typeof patientID == "undefined") {
		console.log(user.get("firstname") + " " + user.get("lastname") + " is not a patient. Is this user a doctor?")
		return;
	}


	//create query that will find the prescriptions of desired patient
	var prescriptionQuery = new Parse.Query(Parse.Object.extend("Prescription"));

	prescriptionQuery.equalTo("patientID", {
		__type: "Pointer",
		className: "Patient",
		objectId: patientID["id"]
	});


	prescriptionQuery.find().then(function(results) {

		//if they have no prescriptions associated with them
		// if (results.length == 0) {
		// 	noPrescriptionDiv(patientID);
		// 	return;
		// }
		console.log(results);

		//otherwise, go through each of their prescriptions
		for (var p = 0; p < results.length; p++) {

			var curr = results[p];

			var drugName = curr.get("pillName");
			var schedule = curr.get("schedule");

			if (typeof schedule == "undefined") {
				console.log("Schedule has not been set for " + drugName + " for patient " + user.get("firstname") + " " + user.get("lastname") + ".");
				return;
			}
			//get each prescription's schedule
			getSchedule(schedule["id"], drugName, curr["id"], user, p);
		}

	});
    
}
    // $scope.getPrescriptions($rootScope.currentUser);

	//getSchedule()
//parameters: scheduleID, drugName, prescriptionID, patient
//function: gets schedule for certain perscription, along with its drug name
function getSchedule(scheduleID, drugName, prescriptionID, patient, prescriptionNum) {

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
		timesAvailable = [];
		for (var d = 0; d < days.length; d++) {
			var times = Object.keys(days[d]);
			for (var t = 0; t < times.length; t++) {
				if (timesAvailable.indexOf(times[t]) == -1) {
					timesAvailable.push(times[t]);
				}
			}
		}
		//prescriptionNum is to make id unique in createPrescriptionDiv
		createPrescriptionDiv(drugName, prescriptionID, days, scheduleID, patient, prescriptionNum);
	});

}


//createPrescriptionDiv()
//parameters: drugName, prescriptionID, days, scheduleID, patient, prescriptionNum
//function: creates the html div of this prescription along with its schedule
function createPrescriptionDiv(drugName, prescriptionID, days, scheduleID, patient, prescriptionNum) {

	//Add info to div id="patient_prescriptions"
	var pd = document.getElementById("patient_descriptions");


	var newA = document.createElement("a");
	// newA.href = "#";
	newA.className = "list-group-item";
	newA.id = drugName + "" + prescriptionID;

	var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	var newP = "<h3 class='drug'>" + drugName + "</h3>" +
	"<div class='table-responsive'>" +
	"<table class='table table-responsive'>" +
	"<thead>" +
	"<tr>" +
	"<th></th>" +
	"<th>" + daysOfWeek[0] + "</th>" +
	"<th>" + daysOfWeek[1] + "</th>" +
	"<th>" + daysOfWeek[2] + "</th>" +
	"<th>" + daysOfWeek[3] + "</th>" +
	"<th>" + daysOfWeek[4] + "</th>" +
	"<th>" + daysOfWeek[5] + "</th>" +
	"<th>" + daysOfWeek[6] + "</th>" +
	"<tr>" +
	"</thead>" +
	"<tbody>";

	// timesAvailable.sort(function(a, b) {
	// 	return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
	// });


	for (var t = 0; t < timesAvailable.length; t++) {
		newP += "<tr>" +
		"<th>" + timesAvailable[t] + "</th>";
		for (var d = 0; d < days.length; d++) {
			var times = Object.keys(days[d]);

			//sort from earliest to latest time
			times.sort(function(a, b) {
				return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
			});

			//unique id is weekday + time
			var currDay = days[d];
			var index = times.indexOf(timesAvailable[t]);
			var currTime = times[index];
			var thisID = scheduleID + ":" + daysOfWeek[d] + "-" + timesAvailable[t] + "_" + prescriptionNum;

			if (times.indexOf(timesAvailable[t]) > -1) {
				newP += "<td><a href='#' id='" + thisID + "' class='doses'>" + currDay[currTime] + "</a></td>";
			} else {
				//isn't defined in database
				newP += "<td><a href='#' id='" + thisID + "' class='doses'>0</a></td>";
			}
		}
		newP += "</tr>";
	}


	var deleteBtnName = "deleteBtn" + prescriptionID;

	newP += "</tbody>" +
	"</table>" +
	"</div>" +
	"<div class='btn-group' id='" + drugName + "btnGroup' role='group'>" +
	// "<button type='button' id='" + deleteBtnName + "' class='btn btn-default'>Delete</button>" +
	"</div>";

	newA.innerHTML += newP;
	pd.appendChild(newA);

	//delete description button
	//  document.getElementById(deleteBtnName).addEventListener("click", function() {
	//  deletePrescription(prescriptionID, patient);
	// });

	//add prescription button
	document.getElementById("addBtn").addEventListener("click", function() {
		addPrescription(patient);
	});

	// startUpdateDosage(scheduleID, drugName);


}


//noPrescriptionDiv()
//parameters: patient
//function: creates div for when patient has no prescriptions
function noPrescriptionDiv(patient) {
	var pd = document.getElementById("patient_descriptions");
	pd.innerHTML = "<button type='button' id='addBtn' class='btn btn-primary'><i class='fa fa-plus'></i> Add Prescription</button>";


	var newA = document.createElement("a");
	newA.href = "#";
	newA.className = "list-group-item";
	newA.innerHTML = "<h3 class='drug'>No Prescriptions On Record</h3>";
	pd.appendChild(newA);

	//add prescription button
	document.getElementById("addBtn").addEventListener("click", function() {
		addPrescription(patient);
	});
}

    getPrescriptions($rootScope.currentUser);
    // console.log("give me some info");


}])