/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('BitcoinController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('DashboardController', {$scope: $scope});
    // $scope.transactions = dataStorage.getTransactions();

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
                var postObject = {
                    authToken: $scope.authToken,
                    to: $scope.sendAddress,
                    amount: $scope.sendAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/send_BTC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("SENT BTC: ", response);
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.errorMessage = "Insufficient Funds"
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            window.location.href = '/login';
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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
    }
}]);

ngapp.controller('EthereumController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('DashboardController', {$scope: $scope});

    $scope.transactions = dataStorage.getTransactions();
    $scope.email = dataStorage.getEmail();
    $scope.ETHaddress = dataStorage.getClientETHAddress();

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
                var postObject = {
                    authToken: $scope.authToken,
                    to: $scope.sendAddress,
                    amount: $scope.sendAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/send_ETH', postObject).then(
                    function (response) {
                        // success callback
                        console.log("SENT ETH: ", response);
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.errorMessage = "Insufficient Funds"
                        }
                        else if(response.data.message == "invalidAuthToken"){
                            window.location.href = '/login';
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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
    }
}]);

ngapp.controller('DinarcoinController', ['$http', '$scope', '$cookies', 'dataStorage', '$controller', function($http, $scope, $cookies, dataStorage, $controller){
    $controller('DashboardController', {$scope: $scope});

    $scope.transactions = dataStorage.getTransactions();
    $scope.email = dataStorage.getEmail();
    $scope.DNCaddress = dataStorage.getClientDNCAddress();

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
                var postObject = {
                    authToken: $scope.authToken,
                    toAddress: $scope.sendAddress,
                    amount: $scope.sendAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/transfer_DNC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("SEND DNC: ", response);
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.errorMessage = "Insufficient Funds"
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            window.location.href = '/login';
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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
        console.log("Minting Dinarcoin");
        // Check if Currency is valid
        console.log("SENDING ", $scope.mintCurrency);
        if($scope.mintCurrency == "BTC" || $scope.mintCurrency == "ETH"){
            if($('#mint-currency').hasClass('invalid')){
                $('#mint-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.mintAmount && $scope.mintAmount > 0 ){
                if($('#mint-amount').hasClass('invalid')){
                    $('#mint-amount').removeClass('invalid');
                }
                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    fromCurrency: $scope.mintCurrency,
                    amount: $scope.mintAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/buy_DNC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("BUYING DNC: ", response);
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.errorMessage = "Insufficient Funds"
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            window.location.href = '/login';
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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
        console.log("burning Dinarcoin");
        // Check if Currency is valid
        console.log("SENDING ", $scope.burnCurrency);
        if($scope.burnCurrency == "BTC" || $scope.burnCurrency == "ETH"){
            if($('#burn-currency').hasClass('invalid')){
                $('#burn-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.burnAmount && $scope.burnAmount > 0 ){
                if($('#burn-amount').hasClass('invalid')){
                    $('#burn-amount').removeClass('invalid');
                }
                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    toCurrency: $scope.mintCurrency,
                    amount: $scope.mintAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/sell_DNC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("SELL DNC RESPONSE: ", response);
                        if(response.data.success) {
                        }
                        else {
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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
    $controller('DashboardController', {$scope: $scope});

    $scope.transactions = dataStorage.getTransactions();
    $scope.email = dataStorage.getEmail();
    $scope.DNCaddress = dataStorage.getClientDNCAddress();

    $scope.GSCFilter = function (txn) {
        if(
            txn.metadata.fromCurrency == "GOLD_1G" || txn.metadata.toCurrency == "GOLD_1G" ||
            txn.metadata.fromCurrency == "GOLD_100G" || txn.metadata.toCurrency == "GOLD_100G" ||
            txn.metadata.fromCurrency == "GOLD_1KG" || txn.metadata.toCurrency == "GOLD_1KG" ||
            txn.metadata.fromCurrency == "SILVER_100OZ" || txn.metadata.toCurrency == "SILVER_100OZ" ||
            txn.metadata.fromCurrency == "SILVER_1KG" || txn.metadata.toCurrency == "SILVER_1KG"
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
        console.log("Minting GSC");
        // Check if Currency is valid
        console.log("SENDING ", $scope.mintCurrency);
        if(
            $scope.mintCurrency == "GOLD_1G" ||
            $scope.mintCurrency == "GOLD_100G" ||
            $scope.mintCurrency == "GOLD_1KG" ||
            $scope.mintCurrency == "SILVER_100OZ" ||
            $scope.mintCurrency == "SILVER_1KG"
        ){
            if($('#mint-currency').hasClass('invalid')){
                $('#mint-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.mintAmount && $scope.mintAmount > 0 ){
                if($('#mint-amount').hasClass('invalid')){
                    $('#mint-amount').removeClass('invalid');
                }
                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    instrument: $scope.mintCurrency,
                    amount: $scope.mintAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/buy_GSC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("BUYING GSC: ", response);
                        if(response.data.success && !response.data.message) {
                            $scope.getTransactions();
                        }
                        if(response.data.message == "insufficientFunds") {
                            $scope.errorMessage = "Insufficient Funds"
                        }
                        else if(response.data.message == "invalidAuthToken") {
                            window.location.href = '/login';
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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

    $scope.burnGSC = function() {
        console.log("burning GSC");
        // Check if Currency is valid
        console.log("SENDING ", $scope.burnCurrency);
        if(
            $scope.burnCurrency == "GOLD_1G" ||
            $scope.burnCurrency == "GOLD_100G" ||
            $scope.burnCurrency == "GOLD_1KG" ||
            $scope.burnCurrency == "SILVER_100OZ" ||
            $scope.burnCurrency == "SILVER_1KG"
        ){
            if($('#burn-currency').hasClass('invalid')){
                $('#burn-currency').removeClass('invalid');
            }
            // Check if amount is valid
            if($scope.burnAmount && $scope.burnAmount > 0 ){
                if($('#burn-amount').hasClass('invalid')){
                    $('#burn-amount').removeClass('invalid');
                }
                // mint the amount
                var postObject = {
                    authToken: $scope.authToken,
                    instrument: $scope.burnCurrency,
                    amount: $scope.mintAmount
                };

                $http.post(SERVER_PORT + '/api/v1/walletops/sell_GSC', postObject).then(
                    function (response) {
                        // success callback
                        console.log("SELL GSC RESPONSE: ", response);
                        if(response.data.success) {
                        }
                        else {
                        }
                    },
                    function (response) {
                        // failure callback
                        console.log(response);
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