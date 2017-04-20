angular.module('app')
  .controller('ResetPasswordController', function($scope, $route, $routeParams, $location, $http) {
     //password resetting functionality
     console.log('$http')
 })

.config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
        // route for the home page
      .when('/', {
        templateUrl: 'common/views/loading.html',
        controller: 'AuthController'
      })
      .when('/inbox', {
            templateUrl : 'common/views/inbox.html',
            controller  : 'InboxController',
            css: ['common/css/inboxStyles.css', 'common/assets/web-icons/web-icons.css']
      })
      .when('/login', {
          templateUrl : 'common/views/login.html',
          controller  : 'LoginController'
          // resolve: {
          //     service: ['$ocLazyLoad', function($ocLazyLoad) {
          //         return $ocLazyLoad.load([{
          //             name: 'app',
          //             files: ['/common/js/services/APIService.js']
          //         }]);
          //     }]
          // }
      })
      .when('/home', {
          templateUrl : 'common/views/home.html'
      })
      .when('/signup', {
          templateUrl : 'common/views/signup.html',
          controller: 'SignupController',
          resolve: {
              service: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load([{
                      name: 'app',
                      files: ['/common/js/services/APIService.js']
                  }]);
              }]
          }

      })
      .when('/forgotpassword', {
          templateUrl : 'common/views/forgotpassword.html',
          controller: 'ForgotPassController',
          css: 'common/css/preLogin.css'
      })
      .when('/doctor/profile', {
          templateUrl : 'doctor/views/doctorprofile.html',
          controller: 'DoctorProfileController'
      })
      .when('/patient/profile', {
          templateUrl : 'patient/views/patientprofile.html',
          controller  : 'PatientProfileController',
          css: 'patient/css/patientProfile.css'
      })
      .when('/patient/appointments', {
          templateUrl : 'patient/views/appointments.html',
          controller  : 'AppointmentController'
      })
      .when('/doctor/home', {
          templateUrl : 'doctor/views/Doctorhome.html',
          controller  : 'DoctorHomeController'
        //   css : 'doctor/css/doctor_table.css'
      })
      .when('/doctor/docpatient', {
          templateUrl: 'doctor/views/doctor_patientprescription.html',
          controller  : 'DoctorPrescriptionController'
      })
      .when('/doctor/graph', {
          templateUrl: 'doctor/views/doctor_patientgraph.html',
          controller: 'patient_graphCtrl',
          css: 'doctor/css/doctor_patientgraph.css'
       })
      .when('/patient/home', {
          templateUrl : 'patient/views/PatientHome.html',
          controller : 'prescriptionCtrl',
          css: 'patient/css/patient_prescription.css'
      })
      .when('/patient/MedCabinet', {
          templateUrl: 'patient/views/medCabinet.html',
          controller: 'MedCabinetController',
          css: 'patient/css/medcabinet.css'
      })
      .when('/account/:token', {
          templateUrl: 'common/views/resetPassword.html',
          controller: 'ForgotPassController',
          css: 'common/css/preLogin.css'
          //http://stackoverflow.com/questions/32918788/angularjs-forgot-password

        })
    //   .when('/doctor/patientView', {
    //       templateUrl: 'doctor/views/doctor_patientgraph.html'   
    //   })

      .otherwise({
        redirectTo  : '/'
      });
});
