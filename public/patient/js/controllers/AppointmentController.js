// 'use strict';
angular.module('app')
.controller('AppointmentController', ['$scope', '$rootScope', '$location', '$uibModal', 'APIService',
	function($scope, $rootScope, $location, $uibModal, APIService) {
		if ($rootScope.sessionToken === undefined) {
			$rootScope.beforeURL = $location.path();
			$location.path("/");
		}
		else {
		  APIService.GetAppointment()
        .success(function(results) {
          $scope.appointments = results;
        })
        .error(function(error) {
          alert(error.code + ' ' + error.message);
        });
      APIService.GetDoctors()
        .success(function(results) {
          $scope.items = results;
          $scope.openModal = function() {
            var modalInstance = $uibModal.open({
              templateUrl: 'addAppointment.html',
              controller: 'addAppointmentCtrl',
              // size: size
              resolve: {
                items: function () {
                  return $scope.items;
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
              console.log($scope.selected);
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          }
        })
        .error(function(error) {
          alert(error.code + ' ' + error.message);
        });
    }
		$scope.now = $location.path();


}]);


angular.module('app')
.controller('addAppointmentCtrl', function ($scope, $uibModalInstance, items, APIService) {

  $scope.items = items;
  $scope.selected = {
    doctor: items[0],
    date: new Date()
  };

  $scope.select = function(item) {
    $scope.selected.doctor = item;
  };
  $scope.ok = function () {
    var appointment = {
      doctorId: $scope.selected.doctor.objectId,
      date: $scope.selected.date
    };
    APIService.AddAppointment(appointment)
      .success(function (res) {
        console.log("Appointment saved");
        $uibModalInstance.close($scope.selected);
      })
      .error(function (error) {
        alert(error.code + ' ' + error.message);
      });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


  $scope.openCalendar = function() {
    $scope.isOpen = true;
  }
});