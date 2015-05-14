'use strict';

angular.module('mysqlJanitorApp')
  .controller('ManagerCtrl', function ($scope, $http, socket) {
    
    $scope.jobs = [];

    $http.get('/api/jobs').success(function(awesomeJobs) {
      $scope.jobs = awesomeJobs;
      socket.syncUpdates('job', $scope.jobs);
    });

    // $scope.addJob = function() {
    //   if($scope.newJob === '') {
    //     return;
    //   }
    //   $http.post('/api/jobs', { name: $scope.newJob });
    //   $scope.newJob = '';
    // };

    // $scope.deleteJob = function(job) {
    //   $http.delete('/api/jobs/' + job._id);
    // };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('job');
    });

    $scope.run = function(id)
    {
      $http.get('/api/manager/run/' + id).success(function(res) {
        console.log(res);
      });
    }

  });