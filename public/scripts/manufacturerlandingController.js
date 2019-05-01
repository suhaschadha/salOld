'use strict';
angular.module('LOCUseCase')
    .controller('manufacturerlandingController', ['$scope', '$http', '$location','$rootScope', function ($scope, $http, $location,$rootScope) {


        //Maps and chart controller

        
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    //[28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };

  $scope.labelsDoughnut = ["Out of time limit", "Within time limit"];
  $scope.dataDoughnut = [49, 628];



        $http.get('/LOC').then(function (response) {
          
                $scope.shipmentlist = response.data;
                $scope.Expoter = {};
                
                //maps code
   
        var myLatLng = {lat: 20.5937, lng:78.9629};  

        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 1,
          mapTypeId: 'satellite'
        });

        var marker = new google.maps.Marker({
         position: myLatLng,
           map: $scope.map,
          
         });
 
         //end of maps 

            }, function (response)
                { return "Something went wrong." });

 
      
    }]);

