/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('DashboardController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', function($http, $scope, $cookies, $window, dataStorage){
    console.log('dataStorage successfully loaded: v',dataStorage.getAppVersion());

    $scope.getUserData = function(){

        $scope.authToken = $cookies.get("ubwAuthToken");
        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', postObject).then(
            function (response) {
                // success callback
                console.log(response);
                if(response.data.success) {
                    $scope.email = response.data.body.email;

                    $scope.BTCaddress = response.data.body.BTCaddress;
                    $scope.ETHaddress = response.data.body.ETHaddress;
                    $scope.DNCaddress = response.data.body.ETHaddress;
                    console.log('BTC address in Dashboard Controller', $scope.BTCaddress);
                }
                else {
                    window.location.href = '/login';
                }
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );
    };

    $scope.getUserBalance = function(){

        $scope.authToken = $cookies.get("ubwAuthToken");
        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_balance', postObject).then(
            function (response) {
                // success callback
                console.log("GET USER BALANCE: ", response);
                if(response.data.success) {
                    $scope.BTCbalance = response.data.body.BTC.free;
                    $scope.ETHbalance = response.data.body.ETH.free;
                    $scope.DNCbalance = response.data.body.DNC.free;
                    $scope.G1Gbalance = response.data.body.GOLD_1G.free;
                    $scope.G100Gbalance = response.data.body.GOLD_100G.free;
                    $scope.G1KGbalance = response.data.body.GOLD_1KG.free;
                    $scope.S100OZbalance = response.data.body.SILVER_100OZ.free;
                    $scope.S1KGbalance = response.data.body.SILVER_1KG.free;
                }
                else {
                    window.location.href = '/login';
                }
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );
    };

    $scope.getPrices = function(){

        // BITCOIN
        $http.get(SERVER_PORT + '/api/v1/util/get_btc_price').then(
            function (response) {
                // success callback
                // console.log("GET BTC IN USD: ", response);
                $scope.BTCinUSD = response.data.USD.rate_float;
                $scope.BTCinGBP = response.data.GBP.rate_float;
                $scope.BTCinEUR = response.data.EUR.rate_float;

                console.log("BTC IN USD: ", $scope.BTCinUSD);
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        // ETHEREUM
        $http.get(SERVER_PORT + '/api/v1/util/get_eth_price').then(
            function (response) {
                // success callback
                // console.log("GET ETH IN USD: ", response);

                $scope.ETHinUSD = response.data.usd;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        //DINARCOIN
        $http.get(SERVER_PORT + '/api/v1/util/get_dnc_price').then(
            function (response) {
                // success callback
                // console.log("GET DNC IN USD: ", response);

                $scope.DNCbidinUSD = response.data.bid;
                $scope.DNCaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        // GOLD 1G
        $http.get(SERVER_PORT + '/api/v1/util/get_GOLD1G_price').then(
            function (response) {
                // success callback
                // console.log("GET GOLD(1G) IN USD: ", response);

                $scope.G1GbidinUSD = response.data.bid;
                $scope.G1GaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        //GOLD 100G
        $http.get(SERVER_PORT + '/api/v1/util/get_GOLD100G_price').then(
            function (response) {
                // success callback
                // console.log("GET GOLD(100G) IN USD: ", response);

                $scope.G100GbidinUSD = response.data.bid;
                $scope.G100GaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        // GOLD 1KG
        $http.get(SERVER_PORT + '/api/v1/util/get_GOLD1KG_price').then(
            function (response) {
                // success callback
                // console.log("GET GOLD(1KG) IN USD: ", response);

                $scope.G1KGbidinUSD = response.data.bid;
                $scope.G1KGaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        // SILVER 100OZ
        $http.get(SERVER_PORT + '/api/v1/util/get_SILVER100OZ_price').then(
            function (response) {
                // success callback
                // console.log("GET SILVER(100oz) IN USD: ", response);

                $scope.S100OZbidinUSD = response.data.bid;
                $scope.S100OZaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );

        // SILVER 1KG
        $http.get(SERVER_PORT + '/api/v1/util/get_SILVER1KG_price').then(
            function (response) {
                // success callback
                // console.log("GET SILVER(1KG) IN USD: ", response);

                $scope.S1KGbidinUSD = response.data.bid;
                $scope.S1KGaskinUSD = response.data.ask;
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );
    };

    $scope.getTransactions = function(){
        $scope.authToken = $cookies.get("ubwAuthToken");
        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_transactions', postObject).then(
            function (response) {
                // success callback
                console.log("GET TRANSACTIONS: ", response);
                if(response.data.success) {
                    dataStorage.addTransactions(response.data.body);
                }
                else {
                    window.location.href = '/login';
                }
            },
            function (response) {
                // failure callback
                console.log(response);
            }
        );
    };

    $scope.getUserData();
    $scope.getUserBalance();
    $scope.getPrices();
    $scope.getTransactions();



    // var txns = [
    //   {
    //     hash: "txn-hash",
    //     mined: true,
    //     executed: true,
    //     typeOf: "burn",
    //     metadata: {
    //       fromAddress: "fromAddressExample",
    //       toAddress: "toAddressExample",
    //       fromCurrency: "BTC",
    //       toCurrency: "DNC",
    //       xRate: 1234,
    //       fromAmount: 200,
    //       toAmount: 200
    //     },
    //     requestedAt: new Date(1437425381235)
    //   },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "BTC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1437425331235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434425332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "ETH", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434325332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "ETH", toCurrency: "ETH", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434321332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "BTC", toCurrency: "BTC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434325302235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1430325332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "ETH", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1434025332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1409325332235) },
    //   { hash: "txn-hash", mined: true, executed: true, typeOf: "burn", metadata: { fromAddress: "fromAddressExample", toAddress: "toAddressExample", fromCurrency: "DNC", toCurrency: "DNC", xRate: 1234, fromAmount: 200, toAmount: 200}, requestedAt: new Date(1400325332235) }
    // ];
    //
    // dataStorage.addTransactions(txns);

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
        $cookies.remove("ubwAuthToken");
        window.location.href = '/login'
    }

}]);