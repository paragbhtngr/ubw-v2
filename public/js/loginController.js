/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('LoginController', ['$http', '$scope', '$cookies', '$window', '$location', 'dataStorage', function($http, $scope, $cookies, $window, $location, dataStorage){
    if (testing) {
        console.log('dataStorage successfully loaded: v', dataStorage.getAppVersion());
        console.log('dataStorage authtoken: ', dataStorage.getAuthToken());
        console.log($cookies.get("testToken"));
        console.log(SERVER_PORT);
    }

    if($cookies.get("ubwAuthToken")) {
        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', {authToken : $cookies.get("ubwAuthToken")}).then(
            function (response) {
                // success callback
                if (testing) { console.log(response); }
                if(response.data.success) {
                    if (redirect) { window.location.href = '/dashboard'; }
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

    /**
     * LOGIN CLIENT FUNCTION
     * Sends a login request to server backend
     * 
     * TIME: 01/01/2017 01:05
     * STATUS:  
     * - Receiving all information correctly from browser
     * - Validation of required input complete
     * - Post Object is in correct format at current time
     * - Posting to correct URL
     * - Handling all Post Responses
     */
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
                            if (testing) { console.log(response.data.body); }

                            $cookies.put("ubwAuthToken",response.data.body);
                            if (testing) { console.log($cookies.get("ubwAuthToken")); }

                            window.location.href = '/dashboard';

                        } else {
                            if(response.data.msg == "invalidEmail") {
                                $scope.errorMessage = "Invalid Email Address";
                            } else if (response.data.msg == "incorrectPassword") {
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

    $scope.resetPassword = function() {
        if ($scope.resetEmail) {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (re.test($scope.resetEmail)){
                $('#password-reset-modal').modal('toggle');

                var postObject = {
                    email: $scope.email
                };
                
                $http.post(SERVER_PORT + '/api/v1/userops/reset_password', postObject).then(
                    function (response) {
                        // success callback
                        if (testing) { console.log(response); }
                        if(response.data.success) {
                            if (testing) { console.log(response.data.body); }
                            $http.post('/reset-password-success-email', {email:$scope.resetEmail, code:response.data.code});
                            

                        } else {
                            if(response.data.msg == "invalidEmail") {
                                $scope.resetErrorMessage = "Invalid Email Address";
                            } 
                        }

                    },
                    function (response) {
                        // failure callback
                        if (testing) { console.log(response); }
                    }
                );

            } else {
                $scope.resetErrorMessage = "Please enter a valid email address";    
            }
        } else {
            $scope.resetErrorMessage = "Please enter a valid email address";
        }
    }
}]);

ngapp.controller('ResetPasswordController', ['$http', '$scope', '$cookies', '$window', '$location', 'dataStorage', function($http, $scope, $cookies, $window, $location, dataStorage){
    if (testing) {
        console.log('dataStorage successfully loaded: v', dataStorage.getAppVersion());
        console.log('dataStorage authtoken: ', dataStorage.getAuthToken());
        console.log($cookies.get("testToken"));
        console.log(SERVER_PORT);
    }

    if($cookies.get("ubwAuthToken")) {
        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', {authToken : $cookies.get("ubwAuthToken")}).then(
            function (response) {
                // success callback
                if (testing) { console.log(response); }
                if(response.data.success) {
                    if (redirect) { window.location.href = '/dashboard'; }
                }
            },
            function (response) {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }

    $scope.resetConfirm = function() {
        if ($scope.email) {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!re.test($scope.resetEmail)){
                $scope.resetErrorMessage = "Please enter a valid email address";
                return;    
            }
        } else {
            $scope.resetErrorMessage = "Please enter a valid email address";
            return;
        }

        if(!$scope.code) {
            $scope.resetErrorMessage = "Please enter your password reset code";
            return;
        }

        if( !(isValidPassword($scope.pwd)) ) {
            $scope.resetErrorMessage = "Please Enter a password that is 8 characters long, with 1 capital letter, 1 number and 1 special character";
            return;
        }
        
        if( isValidPassword($scope.pwd) && $scope.pwdc != $scope.pwd) {
            $scope.resetErrorMessage = "Passwords must match";
            return;
        }

        var postObject = {
            email: $scope.email,
            code: $scope.code,
            pwd: $scope.pwd

        };
        
        $http.post(SERVER_PORT + '/api/v1/userops/reset_password_confirm', postObject).then(
            function (response) {
                // success callback
                if (testing) { console.log(response); }
                if(response.data.success) {
                    if (testing) { console.log(response.data.body); }
                    
                    $(function(){
                        new PNotify({
                            title: 'Password successfully changed',
                            text: 'You may now proceed to log in with your new password',
                            stack: stack_topright,
                            type: "success"
                        })
                    });
                    

                } else {
                    if(response.data.msg == "invalidEmail") {
                        $scope.resetErrorMessage = "Invalid Email Address";
                        return;
                    } 

                    if(response.data.msg == "invalidCode") {
                        $scope.resetErrorMessage = "Invalid Password Reset Code";
                        return;
                    }
                }

            },
            function (response) {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }


}]);