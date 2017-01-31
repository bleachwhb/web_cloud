angular.module('app')
  .factory('APIService', function ($rootScope, APIUtility) {

    return {
      SignUp: function (user, accountType, addtionalInfo) {
        var deferred = APIUtility.defer();
        if (accountType === "Patient") {
          APIUtility.POST('/patient', user)
            .then(function (data, status, headers, config) {
              return deferred.resolve(data.data);
            }, function (data, status, header, config) {
              return deferred.reject(data.data);
            });
          return deferred.promise;
        }
        else if (accountType === "Doctor") {
          user['hospitalName'] = addtionalInfo.hospitalName;
          user['hospitalAddress'] = addtionalInfo.hospitalAddress;
          user['hospitalCity'] = addtionalInfo.hospitalCity;
          APIUtility.POST('/doctor', user)
            .then(function (data, status, headers, config) {
              return deferred.resolve(data.data);
            }, function (data, status, header, config) {
              return deferred.reject(data.data);
            });
          return deferred.promise;
        }
        else if (accountType === "Pharmacy") {
          APIUtility.POST('/pharmacy', user)
            .then(function (data, status, headers, config) {
              return deferred.resolve(data.data);
            }, function (data, status, header, config) {
              return deferred.resolve(data.data);
            });
          return deferred.promise;
        }

      },
      Login: function (username, password) {
        var deferred = APIUtility.defer();
        var loginInfo = {
          username: username,
          password: password
        };
        APIUtility.POST('/login', loginInfo)
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve({
              sessionToken: data.data.sessionToken
            });
          }, function (data, status, header, config) {
            console.log(data);
            return deferred.reject({
              code: data.data.code,
              message: data.data.message
            })
          });
        return deferred.promise;
      },
      GetUser: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/user')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetDoctors: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetDoctorPatients: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor/patients')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetDoctorAppointments: function () {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor/appointments')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      AddDoctorAppointment: function(data) {
        var deferred = APIUtility.defer();
        APIUtility.POST('/doctor/appointment', data)
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetPatientPrescription: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/patient/prescription')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetPrescription: function(patientId) {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor/patient/prescription' + '?patientId=' + patientId)
          .then(function (data, status, headers, config) {
            // console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetAllPrescriptions: function(patientId) {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor/patients/prescriptions')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      AddPrescription: function(prescription) {
        var deferred = APIUtility.defer();
        APIUtility.POST('/doctor/patient/prescription', prescription)
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      DeletePrescription: function(prescriptionId) {
        var deferred = APIUtility.defer();
        APIUtility.DELETE('/doctor/patient/prescription' + '?prescriptionId=' + prescriptionId)
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetPills: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/pharmacy/pills')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      AddAppointment: function(appointment) {
        var deferred = APIUtility.defer();
        APIUtility.POST('/patient/appointment', appointment)
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      },
      GetAppointment: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/patient/appointment')
            .then(function (data, status, headers, config) {
              console.log(data);
              return deferred.resolve(data.data);
            }, function (data, status, header, config) {
              return deferred.reject(data.data)
            });
        return deferred.promise;
      },
      LogOut: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/logout')
            .then(function (data, status, headers, config) {
              console.log(data);
              return deferred.resolve(data.data);
            }, function (data, status, header, config) {
              return deferred.reject(data.data)
            });
        return deferred.promise;
      },
      ForgotPass: function(email) {
        var deferred = APIUtility.defer();
        var data = {
          email: email
        };
        console.log(data);
        APIUtility.POST('/account/password', data)
          .then(function (data, status, headers, config) {
            console.log('data is ', data);
            return deferred.resolve({
              sessionToken: data.data.sessionToken
            });
          }, function (data, status, header, config) {
            console.log(data);
            return deferred.reject({
              code: data.data.code,
              message: data.data.message
            })
          });
        return deferred.promise;
      },
      GetBottles: function() {
        var deferred = APIUtility.defer();
        APIUtility.GET('/doctor/patients/prescriptions')
          .then(function (data, status, headers, config) {
            console.log(data);
            return deferred.resolve(data.data);
          }, function (data, status, header, config) {
            return deferred.reject(data.data)
          });
        return deferred.promise;
      }
    }
 
  });
