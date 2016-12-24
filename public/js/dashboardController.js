/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('DashboardController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', function($http, $scope, $cookies, $window, dataStorage){
    if(testing) { console.log('dataStorage successfully loaded: v',dataStorage.getAppVersion()); }

    $scope.getUserData = function(){

        $scope.authToken = $cookies.get("ubwAuthToken");
        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', postObject).then( // valid API url
            function (response) {
                // success callback
                if(testing) { console.log(response); }
                if(response.data.success) {
                    // User's particulars
                    $scope.email                = response.data.body.email;
                    $scope.firstName            = response.data.body.firstName;
                    $scope.lastName             = response.data.body.lastName;
                    // User's Application-based Addresses
                    $scope.BTCaddress           = response.data.body.BTCaddress;
                    $scope.ETHaddress           = response.data.body.ETHaddress;
                    $scope.DNCaddress           = response.data.body.ETHaddress;
                    // User's Private Addresses
                    $scope.privateBTCaddress    = response.data.body.privateAccounts.BTCaddress;
                    $scope.privateETHaddress    = response.data.body.privateAccounts.ETHaddress;
                    // User's balances
                    $scope.BTCbalance           = response.data.body.balances.BTC;
                    $scope.ETHbalance           = response.data.body.balances.ETH;
                    $scope.DNCbalance           = response.data.body.balances.DNC;
                    $scope.G1Gbalance           = response.data.body.balances.GOLD_1G;
                    $scope.G100Gbalance         = response.data.body.balances.GOLD_100G;
                    $scope.G1KGbalance          = response.data.body.balances.GOLD_1KG;
                    $scope.S100Ozbalance        = response.data.body.balances.SILVER100Oz;
                    $scope.S1KGbalance          = response.data.body.balances.SILVER1KG;

                    if(testing) { console.log('BTC address in Dashboard Controller', $scope.BTCaddress); }
                }
                else {
                    window.location.href = '/login#?sessExpired';
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

    $scope.getPrices = function(){

        // ALL PRICES
        $http.get(SERVER_PORT + '/api/v1/util/get_prices').then(
            function (response) {
                // success callback
                if(testing) { console.log("GET BTC IN USD: ", response); }
                $scope.BTCinUSD         = response.data.body.BTC;
                $scope.ETHinUSD         = response.data.body.ETH;

                $scope.DNCbidinUSD      = response.data.DNC.bid;
                $scope.DNCaskinUSD      = response.data.DNC.ask;

                $scope.G1GbidinUSD      = response.data.GOLD_1G.bid;
                $scope.G1GaskinUSD      = response.data.GOLD_1G.ask;

                $scope.G100GbidinUSD    = response.data.GOLD_100G.bid;
                $scope.G100GaskinUSD    = response.data.GOLD_100G.ask;

                $scope.G1KGbidinUSD     = response.data.GOLD_1KG.bid;
                $scope.G1KGaskinUSD     = response.data.GOLD_1KG.ask;

                $scope.S100OzbidinUSD   = response.data.SILVER100Oz.bid;
                $scope.S100OzaskinUSD   = response.data.SILVER100Oz.ask;

                $scope.S1KGbidinUSD     = response.data.SILVER1KG.bid;
                $scope.S1KGaskinUSD     = response.data.SILVER1KG.ask;

                if(testing) { console.log("BTC IN USD: ", $scope.BTCinUSD); }
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
                $(function(){
                    new PNotify({
                        title: 'Price Request Error',
                        text: 'Could not fetch prices from server. Please check your connection',
                        stack: stack_topright,
                        type: "error"
                    })
                });
            }
        );
    };

    $scope.getTransactions = function(){
        $scope.authToken = $cookies.get("ubwAuthToken");
        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_transactions', postObject).then( // valid API url
            function (response) {
                // success callback
                if(testing) { console.log("GET TRANSACTIONS: ", response); }
                if(response.data.success) {
                    dataStorage.addTransactions(response.data.body);
                }
                else {
                    window.location.href = '/login#?sessExpired';
                }
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );
    };

    $scope.getUserData();
    $scope.getPrices();
    $scope.getTransactions();

    setInterval(function(){
        //code goes here that will be run every 5 seconds.
        $scope.getUserData();
        $scope.getPrices();
        $scope.getTransactions();
    }, 30000);



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
        if(testing) { console.log("modalActivate called with: ", modal, modalTab); }

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
        window.location.href = '/login#?loggedOut'
    }

}]);