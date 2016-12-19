// angular.module('app')
// .controller('YourController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
// 	console.log('entered test controller')
//     $scope.value = '';
//     var query;

//     $scope.init = function() {
//         // Check if we already have an active interval in the scope
//         console.log('entered init')
//         if(angular.isDefined(query)) 
//             return;

//         // Setup query interval
//         query = $interval(function() {
//             // Call the endpoint where you will retrieve data from
//             $http.get('/query')
//             .success(function(data) {
//                 // Handle data, you could 
//                 // update one or both values
//                 $scope.value = data;
//                 // console.log($scope.value);
//             })
//             .error(function(err) {
//                 // Handle errors
//             });
//         }, 100); // Execute every 100 milliseconds
//     };

//     // $scope.init()

//     $scope.cancel = function() { 
//         if(angular.isDefined(query)) {
//             $interval.cancel(query);
//             query = undefined;
//         }
//     };

//     $scope.$on('$destroy', function() {
//         // Make sure that the interval is destroyed too
//         $scope.cancel();
//     });
// }]);