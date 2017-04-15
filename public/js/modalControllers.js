/**
 * Created by parag on 11/18/16.
 */



ngapp.controller('BitcoinController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('SuperController', {$scope: $scope});
    $scope.authToken = $cookies.get("ubwAuthToken");

    // $scope.transactions = dataStorage.getTransactions();

    setInterval(function(){
        //code goes here that will be run every 5 seconds.
        $scope.getUserDataFromDataStorage();
        $scope.getPricesFromDataStorage();
        $scope.transactions = dataStorage.getTransactions()[0];
    }, 5000);

    $scope.bitcoinFilter = function (txn) {
        if(txn.metadata.fromCurrency == "BTC" || txn.metadata.toCurrency == "BTC") {
            return txn;
        }
    };

    console.log("BITCOIN MODAL CONTROLLER: ", $scope.user);

    // SEND BITCOIN FUNCTION
    $scope.sendBitcoin = function() {
        if(testing) { 
            console.log("Sending Bitcoin"); 
            console.log($scope.user.KYCAML);
        }

        if (!$scope.user.KYCAML) {

            $('#bitcoin-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

        // Check if Address is valid
        // TODO: Maybe check that the bitcoin address is an actual valid address on the server?=
        if($scope.sendAddress){
            if($('#BTC-send-address').hasClass('invalid')){
                $('#BTC-send-address').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.sendAmount && $scope.sendAmount > 0 ){
                if($('#BTC-send-amount').hasClass('invalid')){
                    $('#BTC-send-amount').removeClass('invalid');
                }
                // Close the modal and clear the values
                $('#bitcoin-info-modal').modal('toggle');

                // if($scope.user.KYCAML) 

                // Send the amount

                var postObject = {
                    authToken: $scope.authToken,
                    toAddress: $scope.sendAddress,
                    amount: $scope.sendAmount
                };

                // PNOTIFY SEND BITCOIN REQUEST PROCESSED BY CLIENT
                if(testing) {
                    $(function(){
                        new PNotify({
                            title: 'Send Bitcoin',
                            text: 'Sent request to server \n Sending '+$scope.sendAmount+' BTC to '+$scope.sendAddress,
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }

                // POST SEND BITCOIN REQUEST TO SERVER
                $http.post(SERVER_PORT + '/api/v1/walletops/send_BTC', postObject).then( // valid API url
                    function (response) {

                        // CLEAR INPUT
                        $scope.sendAddress = null;
                        $scope.sendAmount = null;

                        // success callback
                        if(testing) { console.log("SENT BTC: ", response); }
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();

                            // PNOTIFY SEND BITCOIN REQUEST RECEIVED BY SERVER
                            $(function(){
                                new PNotify({
                                    title: 'Transaction Processing',
                                    text: 'Your transaction was sent and will be completed pending confirmation',
                                    stack: stack_topright,
                                    type: "notice"
                                })
                            });
                        }
                        if(response.data.message == "insufficientFunds") {

                            // PNOTIFY INSUFFICIENT FUNDS FOR TRANSACTION
                            $(function(){
                                new PNotify({
                                    title: 'Insufficient Funds',
                                    text: 'Your bitcoin transaction could not be processed',
                                    stack: stack_topright,
                                    type: "error"
                                })
                            });
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            if(redirect){
                                if(testing){
                                    window.location.href = '/login#?sessExpired&BitcoinController&SendBTC';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                            }
                        }
                    },
                    function (response) {
                        // failure callback
                        if(testing) { console.log(response); }
                        // PNOTIFY SERVER ERROR
                        $(function(){
                            new PNotify({
                                title: 'Server Error',
                                text: 'Request could not be completed. No response from server',
                                stack: stack_topright,
                                type: "error"
                            })
                        });
                    }
                );


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
    };

    // TODO: FINISH CHECKING FOR SERVER RESPONSE ON ADDING ACCOUNT
    $scope.addBtcAccount = function () {
        // Close the modal and clear the values
        $('#bitcoin-info-modal').modal('toggle');

        // Send the amount
        var postObject = {
            authToken: $scope.authToken,
            address: $scope.addedBtcAccount
        };

        // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
        $(function(){
            new PNotify({
                title: 'Adding Account to profile',
                text: 'Adding account '+$scope.addedBtcAccount+' to your user profile',
                stack: stack_topright,
                type: "notice"
            })
        });

        $http.post(SERVER_PORT + '/api/v1/userops/add_btc_address', postObject).then(
            function (response) {
                // success callback
                if(testing) { console.log("ADDING BTC ADDRESS: ", response); }
                if(response.data.success) {
                    // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
                    $(function(){
                        new PNotify({
                            title: 'Successfully added account',
                            text: 'Bitcoin account '+$scope.addedBtcAccount+' has been successfully added to your profile',
                            stack: stack_topright,
                            type: "success"
                        })
                    });
                }
                else if(response.data.message == "invalidAuthToken") {
                    if(redirect){
                        if(testing){
                            window.location.href = '/login#?sessExpired&BitcoinController&AddBTCAccount';
                        } else {
                            window.location.href = '/login#?sessExpired';    
                        }
                    }
                }
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );

    }
}]);

ngapp.controller('EthereumController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('SuperController', {$scope: $scope});
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(function(){
        //code goes here that will be run every 5 seconds.
        $scope.getUserDataFromDataStorage();
        $scope.getPricesFromDataStorage();
        $scope.transactions = dataStorage.getTransactions()[1];
    }, 5000);

    $scope.ethereumFilter = function (txn) {
        if(txn.metadata.fromCurrency == "ETH" || txn.metadata.toCurrency == "ETH") {
            return txn;
        }
    };

    $scope.sendEthereum = function() {
        if(testing) { console.log("Sending Ethereum"); 
        console.log($scope.user.KYCAML);
    }

        if (!$scope.user.KYCAML) {
            
            $('#ethereum-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }
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

                // Close the modal and clear the values
                $('#ethereum-info-modal').modal('toggle');

                // Send the amount
                var postObject = {
                    authToken: $scope.authToken,
                    toAddress: $scope.sendAddress,
                    amount: $scope.sendAmount
                };
                if(testing) {
                    $(function(){
                        new PNotify({
                            title: 'Send Ethereum',
                            text: 'Sent request to server \n Sending '+$scope.sendAmount+' ETH to '+$scope.sendAddress,
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }

                $http.post(SERVER_PORT + '/api/v1/walletops/send_ETH', postObject).then( // valid API url
                    function (response) {
                        // success callback
                        if(testing) { console.log("SENT ETH: ", response); }
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                            $scope.sendAddress = null;
                            $scope.sendAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Transaction Processing',
                                    text: 'Your transaction was sent and will be completed pending confirmation',
                                    stack: stack_topright,
                                    type: "notice"
                                })
                            });
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.sendAddress = null;
                            $scope.sendAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Insufficient Funds',
                                    text: 'Your ethereum transaction could not be processed',
                                    stack: stack_topright,
                                    type: "error"
                                })
                            });
                        }
                        else if(response.data.message == "invalidAuthToken"){
                            if(redirect){
                                if(testing){
                                    window.location.href = '/login#?sessExpired&EthereumController&SendETH';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                            }
                        }
                    },
                    function (response) {
                        // failure callback
                        if(testing) { console.log(response); }
                    }
                );

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
    };

    // TODO: FINISH CHECKING FOR SERVER RESPONSE ON ADDING ACCOUNT
    $scope.addEthAccount = function () {
        // Close the modal and clear the values
        $('#ethereum-info-modal').modal('toggle');

        // Send the amount

        $http.post(SERVER_PORT + '/api/v1/userops/add_eth_address', postObject).then(
            function (response) {
                // success callback
                if(testing) { console.log("ADDING ETH ADDRESS: ", response); }
                if(response.data.success) {

                }
                else if(response.data.message == "invalidAuthToken") {
                    if(redirect){
                        if(testing){
                            window.location.href = '/login#?sessExpired&EthereumController&AddETHAccount';
                        } else {
                            window.location.href = '/login#?sessExpired';    
                        }
                    }
                }
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );

    }
}]);

ngapp.controller('DinarcoinController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('SuperController', {$scope: $scope});
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(function(){
        //code goes here that will be run every 5 seconds.
        $scope.getUserDataFromDataStorage();
        $scope.getPricesFromDataStorage();
        $scope.transactions = dataStorage.getTransactions()[2];
    }, 5000);

    $scope.dinarcoinFilter = function (txn) {
        if(txn.metadata.fromCurrency == "DNC" || txn.metadata.toCurrency == "DNC") {
            return txn;
        }
    };

    $scope.sendDinarcoin = function() {
        if(testing) { console.log("Sending Dinarcoin"); }

        if (!$scope.user.KYCAML) {
            
            $('#dinarcoin-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

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

                // Close the modal and clear the values
                $('#dinarcoin-info-modal').modal('toggle');

                // Send the amount
                var postObject = {
                    authToken: $scope.authToken,
                    toAddress: $scope.sendAddress,
                    amount: $scope.sendAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/send_DNC', postObject).then( // valid API url
                    function (response) {
                        // success callback
                        if(testing) { console.log("SEND DNC: ", response); }
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                            $scope.sendAddress = null;
                            $scope.sendAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Transaction Processing',
                                    text: 'Your transaction was sent and will be completed pending confirmation',
                                    stack: stack_topright,
                                    type: "notice"
                                })
                            });
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.sendAddress = null;
                            $scope.sendAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Insufficient Funds',
                                    text: 'Your dinarcoin transaction could not be processed',
                                    stack: stack_topright,
                                    type: "error"
                                })
                            });
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            if(redirect){
                                if(testing){
                                    window.location.href = '/login#?sessExpired&DinarcoinController&SendDNC';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                            }
                        }
                    },
                    function (response) {
                        // failure callback
                        if(testing) { console.log(response); }
                    }
                );


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

    $scope.mintDinarcoin = function() {
        if(testing) { console.log("Minting Dinarcoin"); }

        if (!$scope.user.KYCAML) {
            
            $('#dinarcoin-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

        // Check if Currency is valid
        if(testing) { console.log("SENDING ", $scope.mintCurrency); }
        if($scope.mintCurrency == "BTC" || $scope.mintCurrency == "ETH"){
            if($('#mint-currency').hasClass('invalid')){
                $('#mint-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.mintAmount && $scope.mintAmount > 0 ){
                if($('#mint-amount').hasClass('invalid')){
                    $('#mint-amount').removeClass('invalid');
                }

                // Close the modal and clear the values
                $('#dinarcoin-info-modal').modal('toggle');

                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    fromCurrency: $scope.mintCurrency,
                    amount: $scope.mintAmount // TODO: Change Amount from BTC/ETH to DNC
                };

                if (testing) {
                    console.log("MINTING DINARCOIN WITH THE FOLLOWING ATTRIBUTES");
                    // console.log(postObject.toString());
                    $(function(){
                        new PNotify({
                            title: 'Minting Dinarcoin',
                            text: 'Sent request to server \n Minting '+$scope.mintAmount+' DNC',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }

                $http.post(SERVER_PORT + '/api/v1/walletops/buy_DNC', postObject).then( // valid API url
                    function (response) {
                        // success callback
                        if(testing) { console.log("BUYING DNC: ", response); }
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                            $scope.mintCurrency = null;
                            $scope.mintAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Transaction Processing',
                                    text: 'Your transaction was sent and will be completed pending confirmation',
                                    stack: stack_topright,
                                    type: "notice"
                                })
                            });
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.mintCurrency = null;
                            $scope.mintAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Insufficient Funds',
                                    text: 'Your dinarcoin transaction could not be processed',
                                    stack: stack_topright,
                                    type: "error"
                                })
                            });
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            if(redirect) {
                                if(testing){
                                    window.location.href = '/login#?sessExpired&DinarcoinController&BuyDNC';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                            }
                        }
                    },
                    function (response) {
                        // failure callback
                        if(testing) { console.log(response); }
                    }
                );

            } else {
                $scope.mintErrorMessage = "Please specify a valid amount";
                if(!($('#mint-amount').hasClass('invalid'))){
                    $('#mint-amount').addClass('invalid');
                }
            }

        } else {
            $scope.mintErrorMessage = "Please Pick a currency";
            if(!($('#mint-currency').hasClass('invalid'))){
                $('#mint-currency').addClass('invalid');
            }
        }
    };

    $scope.burnDinarcoin = function() {
        if(testing) { console.log("burning Dinarcoin"); }

        if (!$scope.user.KYCAML) {
            
            $('#dinarcoin-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

        // Check if Currency is valid
        if(testing) { console.log("SENDING ", $scope.burnCurrency); }
        if($scope.burnCurrency == "BTC" || $scope.burnCurrency == "ETH"){
            if($('#burn-currency').hasClass('invalid')){
                $('#burn-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.burnAmount && $scope.burnAmount > 0 ){
                if($('#burn-amount').hasClass('invalid')){
                    $('#burn-amount').removeClass('invalid');
                }

                // Close the modal and clear the values
                $('#dinarcoin-info-modal').modal('toggle');

                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    toCurrency: $scope.burnCurrency,
                    amount: $scope.burnAmount // TODO: Change currency from BTC/ETH to DNC
                };

                if (testing) {
                    console.log("BURNING DINARCOIN WITH THE FOLLOWING ATTRIBUTES");
                    console.log(postObject.toString());
                    $(function(){
                        new PNotify({
                            title: 'Burning DNC',
                            text: 'Sent request to server \n Burning '+$scope.burnAmount+' DNC',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }

                $http.post(SERVER_PORT + '/api/v1/walletops/sell_DNC', postObject).then( // valid API url
                    function (response) {
                        // success callback
                        if(testing) { console.log("SELL DNC RESPONSE: ", response); }
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                            $scope.burnCurrency = null;
                            $scope.burnAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Transaction Processing',
                                    text: 'Your transaction was sent and will be completed pending confirmation',
                                    stack: stack_topright,
                                    type: "notice"
                                })
                            });

                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.burnCurrency = null;
                            $scope.burnAmount = null;
                            $(function(){
                                new PNotify({
                                    title: 'Insufficient Funds',
                                    text: 'Your dinarcoin transaction could not be processed',
                                    stack: stack_topright,
                                    type: "error"
                                })
                            });
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            if(redirect) {
                                if(testing){
                                    window.location.href = '/login#?sessExpired&DinarcoinController&SellDNC';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                            }
                        }
                    },
                    function (response) {
                        // failure callback
                        if(testing) { console.log(response); }
                    }
                );

            } else {
                $scope.burnErrorMessage = "Please specify a valid amount";
                if(!($('burn-amount').hasClass('invalid'))){
                    $('#burn-amount').addClass('invalid');
                }
            }

        } else {
            $scope.burnErrorMessage = "Please Pick a currency";
            if(!($('#burn-currency').hasClass('invalid'))){
                $('#burn-currency').addClass('invalid');
            }
        }
    }

}]);

ngapp.controller('instrumentsController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('SuperController', {$scope: $scope});
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(function(){
        //code goes here that will be run every 5 seconds.
        $scope.getUserDataFromDataStorage();
        $scope.getPricesFromDataStorage();
        $scope.transactions = dataStorage.getTransactions()[3];
    }, 5000);

    $scope.GSCFilter = function (txn) {
        if(
            txn.metadata.fromCurrency == "GOLD_1G" || txn.metadata.toCurrency == "GOLD_1G" ||
            txn.metadata.fromCurrency == "GOLD_100G" || txn.metadata.toCurrency == "GOLD_100G" ||
            txn.metadata.fromCurrency == "GOLD_1KG" || txn.metadata.toCurrency == "GOLD_1KG" ||
            txn.metadata.fromCurrency == "SILVER100Oz" || txn.metadata.toCurrency == "SILVER100Oz" ||
            txn.metadata.fromCurrency == "SILVER1KG" || txn.metadata.toCurrency == "SILVER1KG"
        ) {
            return txn;
        }
    };

    // $scope.sendGSC = function() {
    //     console.log("Sending GSC");
    //     // Check if Address is valid
    //     if($scope.sendAddress){
    //         if($('#GSC-send-address').hasClass('invalid')){
    //             $('#GSC-send-address').removeClass('invalid');
    //         }
    //         // Check if amount is valid
    //         if($scope.sendAmount && $scope.sendAmount > 0 ){
    //             if($('#GSC-send-amount').hasClass('invalid')){
    //                 $('#GSC-send-amount').removeClass('invalid');
    //             }
    //             // Send the amount
    //             var postObject = {
    //                 authToken: $scope.authToken,
    //                 instrument: "GOLD_1G",
    //                 toAddress: $scope.sendAddress,
    //                 amount: $scope.sendAmount
    //             };
    //
    //             $http.post(SERVER_PORT + '/api/v1/walletops/transfer_GSC', postObject).then(
    //                 function (response) {
    //                     // success callback
    //                     console.log("SEND DNC: ", response);
    //                     if(response.data.success && !response.data.message) {
    //                         $scope.getTransactions();
    //                     }
    //                     if(response.data.message == "insufficientFunds") {
    //                         $scope.errorMessage = "Insufficient Funds"
    //                     }
    //                     else if(response.data.message == "invalidAuthToken") {
    //                         window.location.href = '/login';
    //                     }
    //                 },
    //                 function (response) {
    //                     // failure callback
    //                     console.log(response);
    //                 }
    //             );
    //
    //
    //         } else {
    //             $scope.sendErrorMessage = "Please specify a valid amount";
    //             if(!($('#G1G-send-amount').hasClass('invalid'))){
    //                 $('#G1G-send-amount').addClass('invalid');
    //             }
    //         }
    //
    //     } else {
    //         $scope.sendErrorMessage = "Please specify a recipient address";
    //         if(!($('#G1G-send-address').hasClass('invalid'))){
    //             $('#G1G-send-address').addClass('invalid');
    //         }
    //     }
    // }

    $scope.mintGSC = function() {
        if(testing) { console.log("Minting GSC"); }

        if (!$scope.user.KYCAML) {
            
            $('#GSC-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

        // Check if Instrument is valid
        if(testing) { console.log("SENDING ", $scope.mintCurrency); }
        if(
            $scope.mintInstrument == "GOLD_1G" ||
            $scope.mintInstrument == "GOLD_100G" ||
            $scope.mintInstrument == "GOLD_1KG" ||
            $scope.mintInstrument == "SILVER100Oz" ||
            $scope.mintInstrument == "SILVER1KG"
        ) {

            if($('#mint-instrument').hasClass('invalid')){
                $('#mint-instrument').removeClass('invalid');
            }

            // Check if Currency is valid
            if(
                $scope.mintCurrency == "BTC" ||
                $scope.mintCurrency == "ETH" ||
                $scope.mintCurrency == "DNC"
            ) {

                if($('#mint-currency').hasClass('invalid')){
                    $('#mint-currency').removeClass('invalid');
                }

                // Check if amount is valid and at least 0.1
                if($scope.mintAmount && $scope.mintAmount > 0 && $scope.mintAmount%0.1 == 0 ){
                    if($('#mint-amount').hasClass('invalid')){
                        $('#mint-amount').removeClass('invalid');
                    }

                    // Close the modal and clear the values
                    $('#GSC-info-modal').modal('toggle');

                    // mint the amount
                    var postObject = {
                        authToken: $scope.authToken,
                        instrument: $scope.mintInstrument,
                        fromCurrency: $scope.mintCurrency,
                        amount: $scope.mintAmount // TODO: Change amount from DNC to GSC unit
                    };

                    if (testing) {
                        console.log("MINTING GSC WITH THE FOLLOWING ATTRIBUTES NOW-");
                        console.log(postObject.toString());
                        $(function(){
                            new PNotify({
                                title: 'Minting GSC',
                                // text: postObject,
                                text: 'Sent request to server \n Minting '+$scope.mintAmount+' '+$scope.mintCurrency,
                                stack: stack_topright,
                                type: "notice"
                            })
                        });
                    }

                    $scope.tmp_req = postObject;

                    $http.post(SERVER_PORT + '/api/v1/walletops/buy_GSC', postObject).then( // valid API url
                        function (response) {
                            // success callback
                            if(testing) { console.log("BUYING GSC: ", response); }
                            if(response.data.success && !response.data.message) {
                                $scope.getTransactions();
                                $scope.mintCurrency = null;
                                $scope.mintAmount = null;
                                $(function(){
                                    new PNotify({
                                        title: 'Transaction Processing',
                                        text: 'Your transaction was sent and will be completed pending confirmation',
                                        stack: stack_topright,
                                        type: "notice"
                                    })
                                });
                            }
                            if(response.data.message == "insufficientFunds") {
                                $scope.mintCurrency = null;
                                $scope.mintAmount = null;
                                $(function(){
                                    new PNotify({
                                        title: 'Insufficient Funds',
                                        text: 'Your GSC transaction could not be processed',
                                        stack: stack_topright,
                                        type: "error"
                                    })
                                });
                            }
                            else if(response.data.message == "invalidAuthToken") {
                                if(redirect){
                                    if(testing){
                                    window.location.href = '/login#?sessExpired&InstrumentController&BuyGSC';
                                } else {
                                    window.location.href = '/login#?sessExpired';    
                                }
                                }
                            }
                        },
                        function (response) {
                            // failure callback
                            if(testing) { console.log(response); }
                        }
                    );

                } else {
                    if($scope.mintAmount > 0 && $scope.mintAmount < 0.1){
                        $scope.mintErrorMessage = "Minimum mint amount is 0.1 DNC";
                    }
                    else if($scope.mintAmount > 0 && $scope.mintAmount%0.1 != 0){
                        $scope.mintErrorMessage = "Please enter an amount that is divisible ";
                    }
                    $scope.mintErrorMessage = "Please specify a valid amount";
                    if(!($('#mint-amount').hasClass('invalid'))){
                        $('#mint-amount').addClass('invalid');
                    }
                }



            } else {
                $scope.mintErrorMessage = "Please Pick a currency";
                if(!($('#mint-currency').hasClass('invalid'))){
                    $('#mint-currency').addClass('invalid');
                }
            }
        } else {
            $scope.mintErrorMessage = "Please Pick an instrument";
            if(!($('#mint-instrument').hasClass('invalid'))){
                $('#mint-instrument').addClass('invalid');
            }
        }
    };

    $scope.burnGSC = function() {
        if(testing) { console.log("burning GSC"); }

        if (!$scope.user.KYCAML) {
            
            $('#GSC-info-modal').modal('toggle');

            $(function(){
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }

        // Check if Instrument is valid
        if(testing) { console.log("SENDING ", $scope.burnCurrency); }
        if(
            $scope.burnInstrument == "GOLD_1G" ||
            $scope.burnInstrument == "GOLD_100G" ||
            $scope.burnInstrument == "GOLD_1KG" ||
            $scope.burnInstrument == "SILVER100Oz" ||
            $scope.burnInstrument == "SILVER1KG"
        ) {

            if($('#burn-instrument').hasClass('invalid')){
                $('#burn-instrument').removeClass('invalid');
            }

            // Check if Currency is valid
            if(
                $scope.burnCurrency == "BTC" ||
                $scope.burnCurrency == "ETH" ||
                $scope.burnCurrency == "DNC"
            ) {

                if($('#burn-currency').hasClass('invalid')){
                    $('#burn-currency').removeClass('invalid');
                }

                // Check if amount is valid
                if($scope.burnAmount && $scope.burnAmount > 0 ){
                    if($('#burn-amount').hasClass('invalid')){
                        $('#burn-amount').removeClass('invalid');
                    }

                    // Close the modal and clear the values
                    $('#GSC-info-modal').modal('toggle');

                    // burn the amount
                    var postObject = {
                        authToken: $scope.authToken,
                        instrument: $scope.burnInstrument,
                        toCurrency: $scope.burnCurrency,
                        amount: $scope.burnAmount
                    };

                    if (testing) {
                        console.log("BURNING GSC WITH THE FOLLOWING ATTRIBUTES");
                        console.log(postObject.toString());
                        $(function(){
                            new PNotify({
                                title: 'Burning GSC',
                                text: 'Sent request to server \n Burning '+$scope.burnAmount+' '+$scope.burnCurrency,
                                stack: stack_topright,
                                type: "notice"
                            })
                        });
                    }

                    $http.post(SERVER_PORT + '/api/v1/walletops/sell_GSC', postObject).then( // valid API url
                        function (response) {
                            // success callback
                            if(testing) { console.log("SELLING GSC: ", response); }
                            if(response.data.success && !response.data.message) {
                                $scope.getTransactions();
                                $scope.burnCurrency = null;
                                $scope.burnAmount = null;
                                $(function(){
                                    new PNotify({
                                        title: 'Transaction Processing',
                                        text: 'Your transaction was sent and will be completed pending confirmation',
                                        stack: stack_topright,
                                        type: "notice"
                                    })
                                });
                            }
                            if(response.data.message == "insufficientFunds") {
                                $scope.burnCurrency = null;
                                $scope.burnAmount = null;
                                $(function(){
                                    new PNotify({
                                        title: 'Insufficient Funds',
                                        text: 'Your GSC transaction could not be processed',
                                        stack: stack_topright,
                                        type: "error"
                                    })
                                });
                            }
                            else if(response.data.message == "invalidAuthToken") {
                                if(redirect){
                                    if(testing){
                                        window.location.href = '/login#?sessExpired&InstrumentController&SellGSC';
                                    } else {
                                        window.location.href = '/login#?sessExpired';    
                                    }
                                }
                            }
                        },
                        function (response) {
                            // failure callback
                            if(testing) { console.log(response); }
                        }
                    );

                } else {
                    $scope.burnErrorMessage = "Please specify a valid amount";
                    if(!($('#burn-amount').hasClass('invalid'))){
                        $('#burn-amount').addClass('invalid');
                    }
                }



            } else {
                $scope.burnErrorMessage = "Please Pick a currency";
                if(!($('#burn-currency').hasClass('invalid'))){
                    $('#burn-currency').addClass('invalid');
                }
            }
        } else {
            $scope.burnErrorMessage = "Please Pick an instrument";
            if(!($('#burn-instrument').hasClass('invalid'))){
                $('#burn-instrument').addClass('invalid');
            }
        }
    }

}]);