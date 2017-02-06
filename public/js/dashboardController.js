/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('SuperController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', function($http, $scope, $cookies, $window, dataStorage){
    $scope.getUserData = function(){

        $scope.authToken = $cookies.get("ubwAuthToken");
        dataStorage.setAuthToken($scope.authToken);

        var postObject = {
            authToken : $scope.authToken
        };

        $http.post(SERVER_PORT + '/api/v1/userops/get_user_data', postObject).then( // valid API url
            function (response) {
                // success callback
                if(testing) {
                    console.log("GETTING USER DATA");
                    console.log(response);
                }
                if(response.data.success) {
                    $scope.user = {};

                    // User's particulars
                    $scope.user.email                = response.data.body.email;
                    $scope.user.firstName            = response.data.body.firstName;
                    $scope.user.lastName             = response.data.body.lastName;
                    // User's Application-based Addresses
                    $scope.user.BTCaddress           = response.data.body.BTCaddress;
                    $scope.user.ETHaddress           = response.data.body.ETHaddress;
                    $scope.user.DNCaddress           = response.data.body.ETHaddress;
                    // User's Private Addresses
                    $scope.user.privateBTCaddress    = response.data.body.privateAccounts.BTCaddress;
                    $scope.user.privateETHaddress    = response.data.body.privateAccounts.ETHaddress;
                    // User's balances
                    $scope.user.BTCbalance           = response.data.body.balances.BTC;
                    $scope.user.ETHbalance           = response.data.body.balances.ETH;
                    $scope.user.DNCbalance           = response.data.body.balances.DNC;
                    $scope.user.G1Gbalance           = response.data.body.balances.GOLD_1G;
                    $scope.user.G100Gbalance         = response.data.body.balances.GOLD_100G;
                    $scope.user.G1KGbalance          = response.data.body.balances.GOLD_1KG;
                    $scope.user.S100Ozbalance        = response.data.body.balances.SILVER100Oz;
                    $scope.user.S1KGbalance          = response.data.body.balances.SILVER1KG;

                    dataStorage.setAuthToken($scope.authToken);
                    dataStorage.setUser($scope.user);

                    if(testing) {
                        console.log('BTC address in Dashboard Controller', $scope.user.BTCaddress);
                        console.log('dataStorage authtoken: ', dataStorage.getAuthToken());
                        console.log('Datastorage user' , dataStorage.getUser());
                    }
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
    /**
     * GET PRICES FUNCTION
     * Gets all prices for currencies from server
     *
     * TIME: 13/01/2017 03:00
     * STATUS:
     * - Receiving all information correctly from browser
     * - Get request is in correct format at current time
     * - Getting from correct URL
     * - Handling Get response correctly
     */
    $scope.getPrices = function(){

        // ALL PRICES
        $http.get(SERVER_PORT + '/api/v1/util/get_prices').then(
            function (response) {
                // success callback
                if(testing) { console.log("GET BTC IN USD: ", response); }
                $scope.prices = {};

                $scope.prices.BTCinUSD         = response.data.BTC;
                $scope.prices.ETHinUSD         = response.data.ETH;

                $scope.prices.DNCbidinUSD      = response.data.DNC.bid;
                $scope.prices.DNCaskinUSD      = response.data.DNC.ask;

                $scope.prices.G1GbidinUSD      = response.data.GOLD_1G.bid;
                $scope.prices.G1GaskinUSD      = response.data.GOLD_1G.ask;

                $scope.prices.G100GbidinUSD    = response.data.GOLD_100G.bid;
                $scope.prices.G100GaskinUSD    = response.data.GOLD_100G.ask;

                $scope.prices.G1KGbidinUSD     = response.data.GOLD_1KG.bid;
                $scope.prices.G1KGaskinUSD     = response.data.GOLD_1KG.ask;

                $scope.prices.S100OzbidinUSD   = response.data.SILVER_100OZ.bid;
                $scope.prices.S100OzaskinUSD   = response.data.SILVER_100OZ.ask;

                $scope.prices.S1KGbidinUSD     = response.data.SILVER_1KG.bid;
                $scope.prices.S1KGaskinUSD     = response.data.SILVER_1KG.ask;

                dataStorage.setPrices($scope.prices);

                if(testing) {
                    console.log("BTC IN USD: ", $scope.prices.BTCinUSD);
                    console.log("datastorage prices: ", dataStorage.getPrices());
                }
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

    $scope.getUserDataFromDataStorage = function () {
        $scope.user = dataStorage.getUser();
        if(testing) {
            console.log("getUserDataFromDataStorage: successfully retrieved data");
            console.log($scope.user);
        }
    }

    $scope.getPricesFromDataStorage = function () {
        $scope.prices = dataStorage.getPrices();
        if(testing) {
            console.log("getPricesFromDataStorage: successfully retrieved data");
            console.log($scope.prices);
        }
    }
}]);


ngapp.controller('DashboardController', ['$http', '$scope', '$cookies', '$window', 'dataStorage', '$controller', function($http, $scope, $cookies, $window, dataStorage, $controller){
    $controller('SuperController', {$scope: $scope});

    if(testing) {
        console.log('dataStorage successfully loaded: v',dataStorage.getAppVersion());
        console.log('dataStorage authtoken: ', dataStorage.getAuthToken());
    }

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