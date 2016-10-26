'use strict';

// Server for Dinar Dirham backend
var SERVER_PORT = "http://139.59.244.237:3000";


// Declare app level module which depends on filters, and services

var ngapp = angular.module('UBW', ['ngCookies']);

ngapp.config(function ($interpolateProvider, $httpProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With']
});

ngapp.factory('clientFactory', function () {
  var factory = {};
  var appVersion = "0.2.0";
  var authToken;
  var email;
  var clientBTCAddress;
  var clientETHAddress;
  var clientDNCAddress;
  var transactions = [];
  // Getters and Setters for Client Factory
  factory.getAppVersion = function () { return appVersion; };
  factory.getAuthToken = function () { return authToken; };
  factory.getEmail = function () { return email; };
  factory.getClientBTCAddress = function () { return clientBTCAddress; };
  factory.getClientETHAddress = function () { return clientETHAddress; };
  factory.getClientDNCAddress = function () { return clientDNCAddress; };
  factory.getTransactions = function() { return transactions; };

  factory.setAuthToken = function (newAuthToken) { authToken = newAuthToken; };
  factory.setEmail = function (newEmail) { email = newEmail; };
  factory.setClientBTCAddress = function (newClientBTCAddress) { clientBTCAddress = newClientBTCAddress; };
  factory.setClientETHAddress = function (newClientETHAddress) { clientETHAddress = newClientETHAddress; };
  factory.setClientDNCAddress = function (newClientDNCAddress) { clientDNCAddress = newClientDNCAddress; };
  factory.addTransactions = function(newTransactions) {
    newTransactions.sort(function(a,b){
      a = a.requestedAt;
      b = b.requestedAt;
      return a>b? -1 : a<b ? 1 : 0;
    });
    newTransactions.forEach(function(txn){
      console.log(txn.requestedAt);
      transactions.push(txn);
    });
  };

  return factory;
});


ngapp.controller('LoginController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  console.log('ClientFactory successfully loaded: v',clientFactory.getAppVersion());
  console.log($cookieStore.get("testToken"));
  console.log(SERVER_PORT);
  $scope.name = "Parag";

  $scope.login = function() {
    // console.log($scope.email);
    // console.log($scope.pwd);

    $http.get(SERVER_PORT+'/api/v1/util/countries').
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }
}]);

ngapp.controller('RegisterController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  console.log('ClientFactory successfully loaded: v',clientFactory.getAppVersion());

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
}]);

ngapp.controller('DashboardController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  console.log('ClientFactory successfully loaded: v',clientFactory.getAppVersion());

  var txns = [
    {
      hash: "txn-hash",
      mined: true,
      executed: true,
      typeOf: "burn",
      metadata: {
        fromAddress: "fromAddressExample",
        toAddress: "toAddressExample",
        fromCurrency: "BTC",
        toCurrency: "DNC",
        xRate: 1234,
        fromAmount: 200,
        toAmount: 200
      },
      requestedAt: new Date(1437425381235)
    },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "BTC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1437425331235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434425332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "ETH", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434325332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "ETH", toCurrency: "ETH", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434321332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "BTC", toCurrency: "BTC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434325302235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1430325332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "ETH", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434025332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1409325332235) },
    { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1400325332235) }
  ];

  clientFactory.addTransactions(txns);

  $scope.modalActivate = function(modal, modalTab) {
    console.log("modalActivate called with: ", modal, modalTab);

    $('.'+modal+'.nav-tabs>li').each( function(){
      $(this).removeClass('active');
      if($(this).attr('id') == (modalTab+'-tab')){
        $(this).addClass('active');
      }
    });

    $('.'+modal+'.tab-content>div').each( function(){
      $(this).removeClass('active');
      if($(this).attr('id') == (modalTab)){
        $(this).addClass('active');
      }
    });
  };

  $scope.logout = function () {
    console.log("USER WANTS TO LOGOUT! QUICK, THINK OF SOMETHING!");
  }

}]);

ngapp.controller('BitcoinController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  $scope.transactions = clientFactory.getTransactions();

  $scope.bitcoinFilter = function (txn) {
    if(txn.metadata.fromCurrency == "BTC" || txn.metadata.toCurrency == "BTC") {
      return txn;
    }
  };

  $scope.sendBitcoin = function() {
    console.log("Sending Bitcoin");
    // Check if Address is valid
    if($scope.sendAddress){
      if($('#BTC-send-address').hasClass('invalid')){
        $('#BTC-send-address').removeClass('invalid');
      }
      // Check if amount is valid
      if($scope.sendAmount && $scope.sendAmount > 0 ){
        if($('#BTC-send-amount').hasClass('invalid')){
          $('#BTC-send-amount').removeClass('invalid');
        }
        // Send the amount


      } else {
        $scope.errorMessage = "Please specify a valid amount";
        if(!($('#BTC-send-amount').hasClass('invalid'))){
          $('#BTC-send-amount').addClass('invalid');
        }
      }

    } else {
      $scope.errorMessage = "Please specify a recipient address";
      if(!($('#BTC-send-address').hasClass('invalid'))){
        $('#BTC-send-address').addClass('invalid');
      }
    }
  }
}]);

ngapp.controller('EthereumController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  $scope.transactions = clientFactory.getTransactions();

  $scope.ethereumFilter = function (txn) {
    if(txn.metadata.fromCurrency == "ETH" || txn.metadata.toCurrency == "ETH") {
      return txn;
    }
  };

  $scope.sendEthereum = function() {
    console.log("Sending Ethereum");
    // Check if Address is valid
    if($scope.sendAddress){
      if($('#ETH-send-address').hasClass('invalid')){
        $('#ETH-send-address').removeClass('invalid');
      }
      // Check if amount is valid
      if($scope.sendAmount && $scope.sendAmount > 0 ){
        if($('#ETH-send-amount').hasClass('invalid')){
          $('#ETH-send-amount').removeClass('invalid');
        }
        // Send the amount


      } else {
        $scope.errorMessage = "Please specify a valid amount";
        if(!($('#ETH-send-amount').hasClass('invalid'))){
          $('#ETH-send-amount').addClass('invalid');
        }
      }

    } else {
      $scope.errorMessage = "Please specify a recipient address";
      if(!($('#ETH-send-address').hasClass('invalid'))){
        $('#ETH-send-address').addClass('invalid');
      }
    }
  }
}]);

ngapp.controller('DinarcoinController', ['$http', '$scope', '$cookieStore', 'clientFactory', function($http, $scope, $cookieStore, clientFactory){
  $scope.transactions = clientFactory.getTransactions();

  $scope.dinarcoinFilter = function (txn) {
    if(txn.metadata.fromCurrency == "DNC" || txn.metadata.toCurrency == "DNC") {
      return txn;
    }
  };

  $scope.sendDinarcoin = function() {
    console.log("Sending Dinarcoin");
    // Check if Address is valid
    if($scope.sendAddress){
      if($('#DNC-send-address').hasClass('invalid')){
        $('#DNC-send-address').removeClass('invalid');
      }
      // Check if amount is valid
      if($scope.sendAmount && $scope.sendAmount > 0 ){
        if($('#DNC-send-amount').hasClass('invalid')){
          $('#DNC-send-amount').removeClass('invalid');
        }
        // Send the amount


      } else {
        $scope.sendErrorMessage = "Please specify a valid amount";
        if(!($('#DNC-send-amount').hasClass('invalid'))){
          $('#DNC-send-amount').addClass('invalid');
        }
      }

    } else {
      $scope.sendErrorMessage = "Please specify a recipient address";
      if(!($('#DNC-send-address').hasClass('invalid'))){
        $('#DNC-send-address').addClass('invalid');
      }
    }
  }
}]);
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
