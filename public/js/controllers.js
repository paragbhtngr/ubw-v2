'use strict';

/* Controllers */

ngapp.controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  });

ngapp.controller('MyCtrl1', function ($scope) {
    // write Ctrl here

  });

ngapp.controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
