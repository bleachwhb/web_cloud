'use strict';
angular
.module('app')
.controller('prescriptionCtrl', ['$scope', '$rootScope', '$location', 'APIService',
	function($scope, $rootScope, $location, APIService) {
    $scope.checked = false;// if the patient have taken this pill: showing checked span
    $scope.unchecked = !$scope.checked;// else showing unchecked;

    if ($rootScope.sessionToken === undefined) {
    	$rootScope.beforeURL = $location.path();
			$location.path("/");
		}
		else {
			APIService.GetPatientPrescription()
				.success(function(results) {
					console.log(results);
					$scope.prescription = results;
				})
				.error(function(error) {
					alert(error.code + ' ' + error.message);
				});
		}
}]);
