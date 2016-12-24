/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('LoginController', ['$http', '$scope', '$cookies', '$window', '$location', 'dataStorage', function($http, $scope, $cookies, $window, $location, dataStorage){
    if (testing) {
        console.log('dataStorage successfully loaded: v', dataStorage.getAppVersion());
        console.log($cookies.get("testToken"));
        console.log(SERVER_PORT);
    }

    if($cookies.get("ubwAuthToken")) {
        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', {authToken : $cookies.get("ubwAuthToken")}).then(
            function (response) {
                // success callback
                if (testing) { console.log(response); }
                if(response.data.success) {
                    window.location.href = '/dashboard';
                }
            },
            function (response) {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }
    if(testing) {
        console.log($location.absUrl());
        console.log($location.search());
    }
    if($location.search().registered) {
        $(function(){
            new PNotify({
                title: 'Successfully Registered',
                text: 'You may now login using your email and password',
                stack: stack_topright,
                type: "success"
            })
        });
    }

    if($location.search().sessExpired) {
        $(function(){
            new PNotify({
                title: 'Session Expired',
                text: 'Please log in again',
                stack: stack_topright,
                type: "error"
            })
        });
    }

    if($location.search().loggedOut) {
        $(function(){
            new PNotify({
                title: 'Logged out',
                text: 'You have been successfully logged out',
                stack: stack_topright,
                type: "notice"
            })
        });
    }

    $scope.login = function() {
        // console.log($scope.email);
        // console.log($scope.pwd);
        if($scope.email) {
            if ($scope.pwd) {
                var postObject = {
                    email: $scope.email,
                    password: $scope.pwd
                };

                $http.post(SERVER_PORT + '/api/v1/userops/login', postObject).then(
                    function (response) {
                        // success callback
                        if (testing) { console.log(response); }
                        if(response.data.success) {
                            if (testing) { console.log(response.data.authToken); }

                            $cookies.put("ubwAuthToken",response.data.authToken);
                            if (testing) { console.log($cookies.get("ubwAuthToken")); }

                            window.location.href = '/dashboard';
                        } else {
                            if(response.data.message == "invalidEmail") {
                                $scope.errorMessage = "Invalid Email Address";
                            } else if (response.data.message == "incorrectPassword") {
                                $scope.errorMessage = "Incorrect Password";
                            }
                        }

                    },
                    function (response) {
                        // failure callback
                        if (testing) { console.log(response); }
                    });
            }
            else {
                $scope.errorMessage = "Please enter your password";
            }
        }
        else {
            $scope.errorMessage = "Please enter a valid email address";
        }

    }
}]);
