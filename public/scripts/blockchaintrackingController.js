'use strict';
angular.module('LOCUseCase')
  .controller('blockchaintrackingController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {

    
    $("#trace").click(function(){
      $('#track').removeClass('active');
      $('#trace').addClass('active');
      $('#dash').removeClass('active');
      $('.dashboard-icon').css('background-image' ,'url(../image/dashboard_normal.png)');
      $('.trace-shipment-icon').css('background-image' ,'url(../image/trace_shipment_hover.png)');
      $('.track-shipment-icon').css('background-image' , 'url(../image/track_shipment_normal.png)');
    });
    var socket = io();
    //setTimeout(myfunction, 5000);
      socket.on('realtime message', function (msg) {
        if (msg == 'yes') {
          $('#tx4').attr("src","/image/Dot_red.png");
          $('#tranaction4').attr("src","/image/Dot_red.png");
          //document.getElementById("imgarrow2").src="/Images/redarrow.png";
        }
        else if (msg == 'almost') {
          $('#tx4').attr("src","/image/Dot_amber.png"),
          $('#tranaction4').attr("src","/image/Dot_amber.png");
         // document.getElementById("divTx4").style.backgroundColor = "orangered";
         // document.getElementById("imgarrow2").src="/Images/orangearrow.png";
        }
        else
         {
          $('#tx4').attr("src","/image/Dot_green.png"), 
          $('#tranaction4').attr("src","/image/Dot_green.png"); 
        }
      });
  }]);

