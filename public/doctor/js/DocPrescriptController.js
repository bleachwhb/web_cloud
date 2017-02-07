angular.module('app')
  .controller('DoctorPrescriptionController', ['$scope', '$rootScope', '$location', '$uibModal', 'APIService',
		function($scope, $rootScope, $location, $uibModal, APIService) {
  		console.log('reached docprescript controller');
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
          console.log("patient ID is ", patient)
          $scope.togglePatient = patient;
          //Get patients prescription
          APIService.GetPrescription(patient.patientId)
            .success(function(results) {
              $scope.prescriptions = results;
            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            });
        };

        $scope.addPrescription = function(patient) {
          var modalInstance = $uibModal.open({
            templateUrl: 'addPrescription.html',
            controller: 'addPrescriptionCtrl',
            // size: size
            resolve: {
              patient: function () {
                return patient;
              }
            }
          });

          modalInstance.result.then(function () {
            APIService.GetPrescription(patient.patientId)
              .success(function(results) {
                $scope.prescriptions = results;
              })
              .error(function(error) {
                alert(error.code + ' ' + error.message);
              });
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
          });
        };

        $scope.deletePrescription = function(prescriptionId) {
          $scope.prescriptions = $scope.prescriptions.filter(function(prescription) {
            return prescription.id != prescriptionId;
          });
          APIService.DeletePrescription(prescriptionId)
            .success(function(results) {
              APIService.GetPrescription($scope.togglePatient.patientId)
                .success(function(results) {
                  $scope.prescriptions = results;
                })
                .error(function(error) {
                  alert(error.code + ' ' + error.message);
                });
            })
            .error(function(error) {
              alert(error.code + ' ' + error.message);
            })
        }
			}
}]);

angular.module('app')
  .controller('addPrescriptionCtrl', function ($scope, $uibModalInstance, patient, APIService) {
    // $scope.bot = []
    APIService.GetPills()
      .success(function(results) {
        console.log("pills are ",results);
        $scope.pills = results;
      })
      .error(function(error) {
        alert(error.code + ' ' + error.message);
      });
      
    APIService.GetBottles()
      .success(function(results) {
        console.log("bottles are ", results);
        $scope.bottle = []
        $scope.bottles = results;
        console.log("adding that to bottles  scope", results['E4pueXvpfv'].bottle) // for now because issue with sidebar
        for (i=0; i < results['E4pueXvpfv'].bottle.length; i++) {
           $scope.bottle.push(results['E4pueXvpfv'].bottle[i]);
        }

      })
      .error(function(error) {
        alert(error.code + ' ' + error.message);
      })
      // wait(5)

      // console.log("bottle names are", $scope.bottleName)



    // console.log("bottle list is ", $scope.bottles)

  

    $scope.patient = patient;
    $scope.prescriptionName = '';
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.times = [
      {
        index: 1,
        time: undefined,
        days: []
      }
    ];
    days.forEach(function(dayName) {
      $scope.times[0].days.push({
        name: dayName,
        amount: undefined
      })
    });

    $scope.addTime = function() {
      var dayObject = [];
      days.forEach(function(dayName) {
        dayObject.push({
          name: dayName,
          amount: undefined
        })
      });
      $scope.times.push({
        index: $scope.times.length + 1,
        time: undefined,
        days: dayObject
      });

    };

    // $scope.select = function(pill) {
    //   $scope.selected = pill;
    // };

    $scope.selectPill = function(pill) {
      $scope.selectedPill = pill;
    };

    $scope.selectBottle = function(bot) {
      $scope.selectedBottle = bot;
    };



    $scope.deleteTime = function(time) {
      $scope.times = $scope.times.filter(function(t) {
        return t.index != time.index
      });
      console.log($scope.times);
    };

    $scope.ok = function () {
      var prescription = {
        patientId: $scope.patient.patientId,
        pillId: $scope.selectedPill.pillId,
        name: $scope.prescriptionName,
        note: $scope.note,
        pillBottle: $scope.selectedBottle
      };
      // console.log("selected nem is ", $scope.selected.name)
      // console.log("selected pill is ", $scope.selectedPill)

      prescription['times'] = [];
      $scope.times.forEach(function(time) {
        prescription['times'].push({
          time: time.time,
          days: time.days
        })
      });
      APIService.AddPrescription(prescription)
        .success(function (res) {
          console.log("Prescription saved");
          $uibModalInstance.close();
        })
        .error(function (error) {
          alert(error.code + ' ' + error.message);
          $uibModalInstance.close();
        });

    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
