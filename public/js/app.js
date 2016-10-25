'use strict';

// Server for Dinar Dirham backend
var SERVER_PORT = "139.59.244.237:3000";


// Declare app level module which depends on filters, and services

var ngapp = angular.module('UBW', ['ngCookies']);

ngapp.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

ngapp.controller('SimpleController', function($scope){
  $scope.name = "Parag";
});

ngapp.controller('LoginController', ['$http', '$scope', '$cookieStore', function($http, $scope, $cookieStore){
  console.log($cookieStore.get("testToken"));
  console.log(SERVER_PORT);
  $scope.name = "Parag";

  $scope.login = function() {
    // console.log($scope.email);
    // console.log($scope.pwd);

    $http({
      method: 'GET',
      url: (SERVER_PORT+'/api/v1/util/countries')
    }).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    if($scope.email) {
      if($scope.pwd) {

        $cookieStore.put('testToken','monkeyshine');
      } else {
        $scope.errorMessage = "Please enter your password";
      }
    } else {
      $scope.errorMessage = "Please enter your email address";
    }
  }
}]);

ngapp.controller('RegisterController', function($scope){
  $scope.register = function() {
    // Check name input
    var firstName = $('#form-firstname-input');
    var lastName = $('#form-lastname-input');
    var email = $('#form-email-input');
    var dob = $('#form-dob-input');
    var phone = $('#form-phone-input');
    var pwd = $('#form-password-input');
    var pwdc = $('#form-password-input-confirm');

    if(firstName.val() == "") {
      $('.registration-message.name-error').html("<h4 class='text-danger font-weight-bold'> Please Enter your Full Name </h4>");
      firstName.addClass("invalid");
    }
    else {
      if( firstName.val() != "" && lastName.val() != "" ) {
        $('.registration-message.name-error').html("");
      }
      firstName.val(capitalizeFirstLetter(firstName.val()));
      if(firstName.hasClass("invalid")){
        firstName.removeClass("invalid");
      }
    }

    if(lastName.val() == "") {
      $('.registration-message.name-error').html("<h4 class='text-danger font-weight-bold'> Please Enter your Full Name </h4>");
      lastName.addClass("invalid");
    }
    else {
      if( firstName.val() != "" && lastName.val() != "" ) {
        $('.registration-message.name-error').html("");
      }
      lastName.val(capitalizeFirstLetter(lastName.val()));
      if(lastName.hasClass("invalid")){
        lastName.removeClass("invalid");
      }
    }

    // Check email input
    if( !(isEmail(email.val())) ) {
      $('.registration-message.email-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a Valid Email Address </h4>");
      email.addClass("invalid");
    }
    else {
      if( isEmail($('#form-email-input').val()) ) {
        $('.registration-message.email-error').html("");
      }
      if(email.hasClass("invalid")){
        email.removeClass("invalid");
      }
    }

    // Check dob input
    $('#dob-resolver').val(dob.val());
    if( !(isValidDate(dob.val())) ) {
      $('.registration-message.date-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a Valid Date of Birth </h4>");
      dob.addClass("invalid");
    }
    else {
      if( isValidDate(dob.val()) ) {
        $('.registration-message.date-error').html("");
      }
      if(dob.hasClass("invalid")){
        dob.removeClass("invalid");
      }
    }

    // Check phone input
    if(phone.val() == "") {
      $('.registration-message.phone-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a Phone Number</h4>");
      phone.addClass("invalid");
    }
    else {
      if( phone.val() != "") {
        $('.registration-message.phone-error').html("");
      }
      if(phone.hasClass("invalid")){
        phone.removeClass("invalid");
      }
    }

    // Check password input
    if( !(isValidPassword(pwd.val())) ) {
      $('.registration-message.password-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a password that is 8 characters long, with 1 capital letter, 1 number and 1 special character </h4>");
      pwd.addClass("invalid");
    } else {
      if( isValidPassword(pwd.val()) ) {
        if(pwdc.val() != pwd.val()){
          $('.registration-message.password-error').html("<h4 class='text-danger font-weight-bold'> Passwords must match </h4>");
          pwdc.addClass("invalid");
        } else {
          $('.registration-message.password-error').html("");
          if(pwdc.hasClass("invalid")){
            pwdc.removeClass("invalid");
          }
        }
      }
      if(pwd.hasClass("invalid")){
        pwd.removeClass("invalid");
      }
    }

    if($('.invalid').length > 0 ) {
      console.log("INVALID FORM!");
    } else {
      console.log("FORM VALID! Registering");
      $scope.dob = $('#form-dob-input').val();

      var postObject = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email,
        dob: $scope.dob,
        address: ($scope.address?$scope.address:""),
        address2: ($scope.address2?$scope.address2:""),
        city: ($scope.city?$scope.city:""),
        state: ($scope.state?$scope.state:""),
        country: ($scope.country?$scope.country:""),
        postalCode: ($scope.postalCode?$scope.postalCode:""),
        mobile: $scope.mobile,
        password: $scope.pwd,
        passwordc: $scope.pwdc
      }
      console.log(postObject);
      console.log(SERVER_PORT);
    }
  }
});

ngapp.controller('BitcoinController', function($scope){
  $scope.register = function() {

  }
});

ngapp.controller('EthereumController', function($scope){
  $scope.register = function() {
    console.log($scope.email);
    console.log($scope.firstName);
  }
});

ngapp.controller('DinarcoinController', function($scope){
  $scope.register = function() {
    console.log($scope.email);
    console.log($scope.firstName);
  }
});
// 'UBW.controllers',
// 'UBW.filters',
// 'UBW.services',
// 'UBW.directives'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return regex.test(password);
}

function isValidDate(date) {
  var isValid = true;

  var bits = date.split('/');
  var y = bits[2], m  = bits[1], d = bits[0];
  // Assume not leap year by default (note zero index for Jan)
  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

  // If evenly divisible by 4 and not evenly divisible by 100,
  // or is evenly divisible by 400, then a leap year
  if ( (!(y % 4) && y % 100) || !(y % 400)) {
    daysInMonth[1] = 29;
  }
  isValid = (d <= daysInMonth[--m] ? true : false);

  if(isValid){
    // Return today's date and time
    var currentTime = new Date();
    // returns the month (from 0 to 11)
    var month = currentTime.getMonth() + 1
    // returns the day of the month (from 1 to 31)
    var day = currentTime.getDate()
    // returns the year (four digits)
    var year = currentTime.getFullYear()

    m = m+1;
    // Check if date is in the future
//            console.log(d,m,y);
//            console.log(day,month,year);

//            console.log(y,year);
    if(y > year) {
      isValid = false;
    } else if(y == year) {
//                console.log(m,month);
      if(m > month){
        isValid = false;
      } else if(m == month) {
//                    console.log(d,day);
        if(d > day) {
          isValid = false;
        }
      }
    }
  }

  return isValid;
  console.log(isValid);
}
