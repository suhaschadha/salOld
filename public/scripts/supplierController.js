'use strict';
angular.module('LOCUseCase')
    .controller('supplierController', ['$scope', '$http', '$location','$rootScope', function ($scope, $http, $location,$rootScope) {
$("#tableone").hide();
$scope.t1load=function()
{
    $("#tableone").show();
}
$scope.t1hide=function()
{
    $("#tableone").hide();
}

var socket = io();
//setInterval(myfunction, 7000);
  socket.on('realtime message', function (msg) {
    if (msg == 'yes') {
    $('#tranaction4').attr("src","/image/Dot_red.png");
    $('#tx4').attr("src","/image/Dot_red.png");
    }
    else if (msg == 'almost') {
      $('#tranaction4').attr("src","/image/Dot_amber.png"); 
      $('#tx4').attr("src","/image/Dot_amber.png");  
    }
    else if (msg == 'no') 
     {
      $('#tranaction4').attr("src","/image/Dot_green.png");  
    }
  });

$('#track').click(function(){
  $('#dash').removeClass('active');
  $('#trace').removeClass('active');
  $('#track').addClass('active');
  $('.dashboard-icon').css('background-image' ,'url(../image/dashboard_normal.png)');
  $('.trace-shipment-icon').css('background-image' ,'url(../image/trace_shipment_normal.png)');
  $('.track-shipment-icon').css('background-image' , 'url(../image/track_shipment_hover.png)');
});

$http.get('/LOCFORM').then(function (response) {          
  $scope.shipmentlist = response.data;
  $scope.Expoter = {};
});

}]);
