'use strict';

angular.module('mysqlJanitorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('manager', {
        url: '/manager',
        templateUrl: 'app/manager/manager.html',
        controller: 'ManagerCtrl'
      });
  });