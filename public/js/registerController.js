/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('RegisterController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', function($http, $scope, $cookies, $window, dataStorage){
    if(testing) { console.log('dataStorage successfully loaded: v',dataStorage.getAppVersion()); }

    $scope.countries = COUNTRIES;
    
    /**
     * REGISTER CLIENT FUNCTION
     * Sends a register user request to server backend
     * 
     * TIME: 01/01/2017 00:54
     * STATUS:  
     * - Receiving all information correctly from browser
     * - Validation of required input complete
     * - Post Object is in correct format at current time
     * - Posting to correct URL
     * - Handling all Post Responses
     */
    $scope.register = function() {
        // Check name input
        var firstName = $('#form-firstname-input');
        var lastName =  $('#form-lastname-input');
        var email =     $('#form-email-input');
        // var dob =       $('#form-dob-input');
        var phone =     $('#form-phone-input');
        var country =   $('#form-country-input');
        var pwd =       $('#form-password-input');
        var pwdc =      $('#form-password-input-confirm');

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

        // // Check dob input
        // $('#dob-resolver').val(dob.val());
        // if( !(isValidDate(dob.val())) ) {
        //     $('.registration-message.date-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a Valid Date of Birth </h4>");
        //     dob.addClass("invalid");
        // }
        // else {
        //     if( isValidDate(dob.val()) ) {
        //         $('.registration-message.date-error').html("");
        //     }
        //     if(dob.hasClass("invalid")){
        //         dob.removeClass("invalid");
        //     }
        // }

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

        // Check country input
        if(country.val() == null) {
            $('.registration-message.country-error').html("<h4 class='text-danger font-weight-bold'> Please Select a Country </h4>");
            country.addClass("invalid");
        }
        else {
            if(country.hasClass("invalid")){
                country.removeClass("invalid");
            }
        }

        // Check password input
        if( !(isValidPassword(pwd.val())) ) {
            $('.registration-message.password-error').html("<h4 class='text-danger font-weight-bold'> Please Enter a password that is 8 characters long, with 1 capital letter, 1 number and 1 special character </h4>");
            pwd.addClass("invalid");
        }
        else {
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
            if(testing) { console.log("INVALID FORM!"); }
        } else {
            if(testing) { console.log("FORM VALID! Registering"); }
            $scope.dob = $('#form-dob-input').val();

            var postObject = {
                firstName:   $scope.firstName,
                lastName:    $scope.lastName,
                email:       $scope.email,
                dob:         $scope.dob,
                country:    ($scope.country?$scope.country:""),
                phoneNumber: $scope.mobile,
                password:    $scope.pwd
            };

            // console.log(postObject);
            // console.log(SERVER_PORT);

            $http.post(SERVER_PORT+'/api/v1/userops/create_new_user', postObject).then(
                function(response){
                    // success callback
                    if(testing) { console.log(response); }
                    $(function(){
                        new PNotify({
                            title: 'Registering User',
                            text: 'Currently creating user. This may take a few minutes. You will be redirected once you have been successfully registered',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                    if(response.data.success){
                        window.location.href = '/login#?registered';

                        $http.post('/registration-success-sms', {number:$scope.mobile});
                        $http.post('/registration-success-email', {email:$scope.email});
                    }
                    else {
                        if(response.data.message = "userExists") {
                            $('.registration-message.name-error').html("<h4 class='text-danger font-weight-bold'> User with this Email Address already exists </h4>");
                        }
                    }
                },
                function(response){
                    // failure callback
                    if(testing) { console.log(response); }
                }

            );
        }
    }
}]);

ngapp.controller('ProfileController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', function($http, $scope, $cookies, $window, dataStorage){
    if(testing) { console.log('dataStorage successfully loaded: v',dataStorage.getAppVersion()); }

    $scope.authToken = $cookies.get("ubwAuthToken");
    $scope.countries = COUNTRIES;

    $scope.getUserMetadata = function(){
        if (testing) {
            console.log("GETTING USER METADATA");
        }
        dataStorage.setAuthToken($scope.authToken);

        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_metadata', postObject).then( // valid API url
            function (response) {
                // success callback
                if(testing) {
                    console.log("GETTING USER METADATA");
                    console.log(response);
                }

                if(response.data.success) {
                    $scope.user = {};

                    // User's particulars
                    $scope.user = response.data.body;

                    dataStorage.setAuthToken($scope.authToken);
                    dataStorage.setUser($scope.user);
                    function findHelper(country) { 
                        return country.code === $scope.user.country;
                    }

                    $scope.user.countryname = COUNTRIES.find(findHelper ).name;
                    // console.log("COUNTRY", $scope.user.country);
                    // console.log("COUNTRYNAME", $scope.user.countryname );
                }
                else {
                    if(redirect){
                        if(testing){
                            window.location.href = '/login#?sessExpired&SuperController&GetUserData';
                        } else {
                            window.location.href = '/login#?sessExpired';    
                        }
                    }
                }
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
                $(function(){
                    new PNotify({
                        title: 'Data Request Error',
                        text: 'Could not fetch User data from server. Please check your connection',
                        stack: stack_topright,
                        type: "error"
                    })
                });
            }
        );
    };

    $scope.getUserMetadata();

    /**
     * MODIFY PROFILE FUNCTION
     * Sends a user profile modification request to server backend
     * 
     * STATUS:  
     * - Receiving all information correctly from browser
     * - Validation of required input complete
     * - Post Object is in correct format at current time
     * - Posting to correct URL
     * - Handling all Post Responses
     */
    $scope.update = function() {
        // Check name input
        var firstName = $('#form-firstname-input');
        var lastName =  $('#form-lastname-input');
        var email =     $('#form-email-input');
        var dob =       $('#form-dob-input');
        var phone =     $('#form-phone-input');
        var pwd =       $('#form-password-input');
        var address =   $('#form-address-input');
        var address2 =  $('#form-address-two-input');
        var city =      $('#form-city-input');
        var state =     $('#form-state-input');
        var country =   $('#form-country-input');
        var postal =    $('#form-postal-code-input')


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

        // Check country input
        if(country.val() == null) {
            $('.registration-message.country-error').html("<h4 class='text-danger font-weight-bold'> Please Select a Country </h4>");
            country.addClass("invalid");
        }
        else {
            if(country.hasClass("invalid")){
                country.removeClass("invalid");
            }
        }

        // Check password input
        if( !(isValidPassword(pwd.val())) ) {
            $('.registration-message.password-error').html("<h4 class='text-danger font-weight-bold'> Please Enter Your Password </h4>");
            pwd.addClass("invalid");
        }
        else {
            if(pwd.hasClass("invalid")){
                pwd.removeClass("invalid");
            }
        }

        if($('.invalid').length > 0 ) {
            if(testing) { console.log("INVALID FORM!"); }
        } else {
            if(testing) { console.log("FORM VALID! Registering"); }
            $scope.dob = $('#form-dob-input').val();

            var postObject = {
                authToken:   $scope.authToken,
                firstName:   $scope.firstName,
                lastName:    $scope.lastName,
                email:       $scope.email,
                dob:         $scope.dob,
                country:     $scope.country,
                phoneNumber: $scope.mobile,
                password:    $scope.pwd,
                address:     $scope.address,
                address2:    $scope.address2,
                city:        $scope.city,
                state:       $scope.state,
                postalCode:  $scope.postal
            };

            // console.log(postObject);
            // console.log(SERVER_PORT);

            $http.post(SERVER_PORT+'/api/v1/userops/modify_user', postObject).then(
                function(response){
                    // success callback
                    if(testing) { console.log(response); }
                    $(function(){
                        new PNotify({
                            title: 'Registering User',
                            text: 'Updating KYCAML Information',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                },
                function(response){
                    // failure callback
                    if(testing) { console.log(response); }
                }

            );
        }
    }
}]);