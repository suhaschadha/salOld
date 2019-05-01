'use strict';
angular.module('LOCUseCase')
  .controller('supplierlandingController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    $scope.origincountry = ["Holland", "USA", "Singapore", "Australia", "India"];
    $scope.originplant = [""];
    $scope.destinationcountry = [""];
    $scope.destinationplant = ["Mumbai", "Chennai", "Delhi", "Karnal"];
    //Maps and chart controller
    $("#dash").click(function () {
      $('#trace').removeClass('active');
      $('#dash').addClass('active');
      $('#track').removeClass('active');
      $('.dashboard-icon').css('background-image', 'url(../image/dashboard_hover.png)');
      $('.trace-shipment-icon').css('background-image', 'url(../image/trace_shipment_normal.png)');
      $('.track-shipment-icon').css('background-image', 'url(../image/track_shipment_normal.png)');
    });
    $('#dash').addClass('active');
    $('.dashboard-icon').css('background-image', 'url(../image/dashboard_hover.png)');
/*old code for google image charts    google.charts.load('current', { 'packages': ['imageareachart'] });
    google.charts.setOnLoadCallback(drawChart1);

    function drawChart1() {

      var data = google.visualization.arrayToDataTable([
        ['2017', 'No. of breaches'],
        ['Jan', 1],
        ['Feb', 1],
        ['Mar', 2],
        ['Apr', 1],
        ['May', 0],
        ['Jun', 2],
        ['Jul', 3],
        ['Aug', 1],
        ['Sep', 0],
        ['Oct', 0],
        ['Nov', 2],
        ['Dec', 1],
      ]);
      var options = {
        curveType: 'function',
        min: 0,
        max: 4,
        width: 500, height: 240,
        color: "#00d0a4",
        format: '0',
        backgroundColor: '#ebeae5'
      };
      var chart = new google.visualization.ImageAreaChart(document.getElementById('chartContainer'));

      chart.draw(data, options);
    }


    google.charts.load("current", { packages: ["imagelinechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['2017', 'Success %'],
        ['Jan', 85],
        ['Feb', 89],
        ['Mar', 80],
        ['Apr', 81],
        ['May', 86],
        ['Jun', 95],
        ['Jul', 91],
        ['Aug', 97],
        ['Sep', 90],
        ['Oct', 94],
        ['Nov', 89],
        ['Dec', 96]
      ]);

      var chart = new google.visualization.ImageLineChart(document.getElementById('chartContainer1'));
      var options = {
        curveType: 'function',
        min: 0,
        legend: { position: 'none' },
        width: 500, height: 240,
        backgroundColor: '#ebeae5',
        color: "#00d0a4"
      };
      chart.draw(data, options);
    }


    $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [[85, 89, 80, 81, 86, 95, 91, 97, 90, 94, 89, 96]];
    //$scope.bardata = [[1, 1, 2, 1, 0, 2, 3, 1, 0, 0, 2, 1]];
    $scope.bar2data = [[5, 5, 7, 5, 6, 5, 5, 6, 7, 7, 5, 7]];
    $scope.colors = [{
      backgroundColor: 'rgba(255,255,255, 0.9)',
      pointBackgroundColor: 'black',
      pointHoverBackgroundColor: 'rgba(255,255,255, 0.9)',
      borderColor: 'rgba(255,255,255, 0.9)',
      pointBorderColor: '#fff',
      pointHoverBorderColor: 'rgba(255,255,255, 0.9)'
    }];

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.baroptions = {

      scales: {
        xAxes: [{
          ticks: {
            fontColor: "white",
          },
        }],
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              fontColor: "white",
              max: 5,
              min: 0
            },
          }
        ]
      }
    };
    $scope.bar2options = {
      scales: {

        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              fontColor: "white",
              max: 10,
              min: 0
            },
          }
        ]
      }
    };
    $scope.options = {
      scales: {
        xAxes: [{
          ticks: {
            fontColor: "white",
          },
        }],
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              fontColor: "white",
              max: 100,
              min: 0
            },
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
*/
//New code below for google charts

    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      google.charts.setOnLoadCallback(drawChart1);

    function drawChart1() {

      var data = google.visualization.arrayToDataTable([
        ['2017', 'No. of breaches'],
        ['Jan', 1],
        ['Feb', 1],
        ['Mar', 2],
        ['Apr', 1],
        ['May', 0],
        ['Jun', 2],
        ['Jul', 3],
        ['Aug', 1],
        ['Sep', 0],
        ['Oct', 0],
        ['Nov', 2],
        ['Dec', 1],
      ]);
      var options = {
        min: 0,
        max: 4,
        hAxis:{slantedText:true,
               slantedTextAngle:45,
              },
         height: 240,
        colors: ['#00d0a4'],
        format: '0',
        chartArea: {
      right: 110,   // set this to adjust the legend width
      left: 60,     // set this eventually, to adjust the left margin
      width:"100%"
   },
        backgroundColor: '#ebeae5'
      };
      var chart = new google.visualization.AreaChart(document.getElementById('chartContainer'));

      chart.draw(data, options);
    }


   

    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['2017', 'Success %'],
        ['Jan', 85],
        ['Feb', 89],
        ['Mar', 80],
        ['Apr', 81],
        ['May', 86],
        ['Jun', 95],
        ['Jul', 91],
        ['Aug', 97],
        ['Sep', 90],
        ['Oct', 94],
        ['Nov', 89],
        ['Dec', 96]
      ]);

      var chart = new google.visualization.LineChart(document.getElementById('chartContainer1'));
      var options = {
        min: 0,
        hAxis:{slantedText:true,
               slantedTextAngle:45,
              },
        legend: { position: 'none' },
        width: 550, height: 240,
        backgroundColor: '#ebeae5',
        colors: ['#00d0a4']
      };
      chart.draw(data, options);
    }


    var myLatLng = [{ lat: -25.2744, lng: 133.7751 }, { lat: 8.7832, lng: 34.5085 },
    { lat: 56.1304, lng: 106.3468 }, { lat: 51.9244, lng: 4.4777 }, { lat: 20.5937, lng: 78.9629 }, { lat: 19.07, lng: 72.8 }];

    //green markers
    var imagegreen = '/Images/greenmarker.png';
    var imagered = '/Images/redmarker.png';
    var imageorange = '/Images/orangemarker.png';
    var originImg = '/Images/origin.png';
    var destinationImg = '/Images/destination.png';
    var marker;
    var origin = 0;
    var destination = 0;
    var zoomlevel = 1;

    function plotMarkers() {

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: zoomlevel
      });

      if (origin != 0) {
        marker = new google.maps.Marker({
          position: origin,
          map: $scope.map,
          icon: originImg
        });
      }
      if (destination != 0) {
        marker = new google.maps.Marker({
          position: destination,
          map: $scope.map,
          icon: destinationImg
        });
      }

      for (var i = 0; i < myLatLng.length; i++) {
        marker = new google.maps.Marker({
          position: myLatLng[i],
          map: $scope.map,
          icon: imagegreen
        });
      }
      //Redirecting on click of marker
      google.maps.event.addListener(marker, 'click', function () {
        $scope.$apply(function () {
          console.log("Marker clicked");
          $location.path('/transitsupplier');
        });
      });

    }

    plotMarkers();

    var socket = io();
    //setInterval(myfunction, 9000);
    socket.on('realtime message', function (msg) {
      if (msg == 'yes') { marker.setIcon({ url: imagered }); }
      else if (msg == 'almost') { marker.setIcon({ url: imageorange }); }
      else { marker.setIcon({ url: imagegreen }); }
    });

    //changing markers on dropdown selection

    $scope.selectedoriginCountry = function (item) {
      myLatLng = [{ lat: -25.2744, lng: 133.7751 }, { lat: 8.7832, lng: 34.5085 }, { lat: 56.1304, lng: 106.3468 }, { lat: 20.5937, lng: 78.9629 }, { lat: 19.7, lng: 70.5 }];
      origin = { lat: 51.9244, lng: 4.4777 };
      plotMarkers();
      //Drop down options
      if (item == "Holland") {
        $scope.originplant = ["Rosenberg"];
        $scope.destinationcountry = ["India", "Pakistan", "Bangladesh", "Sri Lanka"];
      }
      else if (item == "USA") {
        $scope.originplant = ["Texas"];
        $scope.destinationcountry = ["India"];
      }
      else if (item == "Singapore") {
        $scope.originplant = ["Singapore"];
        $scope.destinationcountry = ["India"];
      }
      else if (item == "Australia") {
        $scope.originplant = ["Sydney"];
        $scope.destinationcountry = ["Sri Lanka"];
      }
      else if (item == "India") {
        $scope.originplant = ["Mumbai"];
        $scope.destinationcountry = ["Bangladesh"];
      }

    }

    $scope.selectedoriginPlant = function () {
      myLatLng = [{ lat: 56.1304, lng: 106.3468 }, { lat: 20.5937, lng: 78.9629 }, { lat: 19.07, lng: 72.8 }];
      //origin={lat: 51.9244, lng: 4.4777};
      plotMarkers();
    }

    $scope.selecteddestinationCountry = function () {
      myLatLng = [{ lat: 8.0883, lng: 77.5385 }, { lat: 19.7, lng: 70.5 }];
      destination = { lat: 19.7, lng: 72.8 };
      zoomlevel = 4;
      plotMarkers();
    }

    $scope.selecteddestinationPlant = function () {
      myLatLng = [{ lat: 19.7, lng: 70.5 }];
      plotMarkers();
    }


    $http.get('/LOCFORM').then(function (response) {
      $scope.shipmentlist = response.data;
      $scope.Expoter = {};
    });

  }]);
