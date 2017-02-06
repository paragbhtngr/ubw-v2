'use strict';

// Server for Dinar Dirham backend
// var SERVER_PORT = "http://139.59.244.237:3000";
// var SERVER_PORT = "http://128.199.237.167";
var SERVER_PORT = "https://node.universalblockchains.com";

var testing = true;
var redirect = false;

// Declare app level module which depends on filters, and services

var ngapp = angular.module('UBW', ['ngCookies']);

ngapp.config(function ($interpolateProvider, $httpProvider, $locationProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];  
});



ngapp.service('dataStorage', function () {
  var appVersion = "0.2.0";
  var user;
  var authToken = "";
  var prices;
  var addresses = [];
  var transactions = [];
  // Getters and Setters for Client Factory
  this.getAppVersion = function () { return appVersion; };
  this.getAuthToken = function () { return authToken; };
  this.getUser = function () { return user; };
  this.getPrices = function () { return prices; };
  this.getTransactions = function() { return transactions; };
  this.setAuthToken = function (newAuthToken) { authToken = (newAuthToken); };
  this.setUser = function (newUser) { user = (newUser); };
  this.setPrices = function (newPrices) { prices = newPrices; };
  this.addTransactions = function(newTransactions) {
    newTransactions.sort(function(a,b){
      a = a.requestedAt;
      b = b.requestedAt;
      return a>b? -1 : a<b ? 1 : 0;
    });

    var wasAdded = false;
    newTransactions.forEach(function(txn){
      // console.log(txn.requestedAt);
      transactions.forEach(function(oldtxn){
        if(oldtxn.hash == txn.hash) {
          wasAdded = true;
        }
      });
      if(testing) {
        // console.log("TRANSACTION:::::: ", wasAdded, txn)
      };

      if(!wasAdded){
        transactions.push(txn);
      }
    });
  };

});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&\.])[A-Za-z\d$@$!%*?&\.]{8,}/;
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
