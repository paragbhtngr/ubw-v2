/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('SuperController', ['$http', '$scope', '$rootScope', '$cookies', '$window', 'dataStorage',  function($http, $scope, $rootScope, $cookies, $window, dataStorage){
    $rootScope.BTCtransactions = [];
    $rootScope.ETHtransactions = [];
    $rootScope.DNCtransactions = [];
    $rootScope.GSCtransactions = [];

    $scope.getUserData = function(){

        $scope.authToken = $cookies.get("ubwAuthToken");
        $rootScope.authToken = $scope.authToken;

        let postObject = {
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

                    if($scope.user.DNCbalance < response.data.body.balances.DNC && $scope.user.DNCbalance != 0){
                    	$(function(){
                    		new PNotify({
                    			title: 'DNC added',
                    			text: (response.data.body.balances.DNC - $scope.user.DNCbalance) + ' DNC was added to your account',
                    			stack: stack_topright,
                    			type: "notice"
                    	    })
                    	});
                    }

                    if($scope.user.DNCbalance > response.data.body.balances.DNC && $scope.user.DNCbalance != 0){
                        $(function(){
                            new PNotify({
                                title: 'DNC deducted',
                                text: ($scope.user.DNCbalance - response.data.body.balances.DNC) + ' DNC was deducted from your account',
                                stack: stack_topright,
                                type: "notice"
                                })
                        });

                    }

                    $scope.user.BTCbalance           = response.data.body.balances.BTC;
                    $scope.user.ETHbalance           = response.data.body.balances.ETH;
                    $scope.user.DNCbalance           = response.data.body.balances.DNC;
                    $scope.user.G1Gbalance           = response.data.body.balances.GOLD_1G;
                    $scope.user.G100Gbalance         = response.data.body.balances.GOLD_100G;
                    $scope.user.G1KGbalance          = response.data.body.balances.GOLD_1KG;
                    $scope.user.S100Ozbalance        = response.data.body.balances.SILVER100Oz;
                    $scope.user.S1KGbalance          = response.data.body.balances.SILVER1KG;

                    // User KYCAML completed
                    $scope.user.KYCAML               = response.data.body.KYCAML;

                    $rootScope.authToken = $scope.authToken;
                    $rootScope.user = $scope.user;

                    if(testing) {
                        console.log('BTC address in Dashboard Controller', $scope.user.BTCaddress);
                        console.log('rootScope authtoken: ', $rootScope.authToken);
                        console.log('rootScope user' , $rootScope.user);
                    }
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

                $rootScope.prices = $scope.prices;

                if(testing) {
                    console.log("BTC IN USD: ", $scope.prices.BTCinUSD);
                    console.log("rootScope prices: ", $rootScope.prices);
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
        
        $http.get('https://www.bitgo.com/api/v1/tx/fee?numBlocks=1').then(
        // $http.get('https://shapeshift.io/btcfee').then(
            function (response) {
                // success callback
                if(testing) { console.log("BTC FEE IN SATOSHI: ", response.data.recommendedFeeInSatoshi_btc); }
                // $rootScope.BTCfee = response.data.recommendedFeeInSatoshi_btc;
                $rootScope.BTCfee = response.data.feeByBlockTarget[1];
            },
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
                $(function(){
                    new PNotify({
                        title: 'BTC Fee Request Error',
                        text: 'Could not fetch BTC Fee from server. Please check your connection',
                        stack: stack_topright,
                        type: "error"
                    })
                });
            }
        );
    };

    $scope.getPrivateBalances = function(){
        console.log("GETTING PRIVATE BALANCES:");
        if($rootScope.user) {
	    console.log('https://btc.blockr.io/api/v1/address/balance/'+$rootScope.user.privateBTCaddress);
            $http.get('https://btc.blockr.io/api/v1/address/balance/'+$rootScope.user.privateBTCaddress).then(
                // $http.get('https://shapeshift.io/btcfee').then(
                function (response) {
                    // success callback
                    if(testing) { console.log("PRIVATE BTC ADDRESS: ", response.data); }
                    // $rootScope.BTCfee = response.data.recommendedFeeInSatoshi_btc;
                    $rootScope.user.privateBTCbalance = response.data.data.balance;
                },
                function (response) {
                    // failure callback
                    if(testing) { console.log('ERROR IN FETCHING PRIVATE BTC ADDRESS:', response); }
                    $(function(){
                        new PNotify({
                            title: 'Private BTC balance request error',
                            text: 'Could not fetch Private BTC balance from server',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                }
            );

            $http.get('https://api.etherscan.io/api?module=account&action=balance&address='+$rootScope.user.privateETHaddress+'&tag=latest').then(
                // $http.get('https://shapeshift.io/btcfee').then(
                function (response) {
                    // success callback
                    if(testing) { console.log("PRIVATE ETH ADDRESS: ", response.data); }
                    // $rootScope.BTCfee = response.data.recommendedFeeInSatoshi_btc;
                    $rootScope.user.privateETHbalance = response.data.result/1000000000000000000;
                },
                function (response) {
                    // failure callback
                    if(testing) { console.log(response); }
                    $(function(){
                        new PNotify({
                            title: 'Private ETH balance request error',
                            text: 'Could not fetch Private ETH balance from server',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                }
            );
        }

    };

    $scope.getTransactions = function(){
        $scope.authToken = $cookies.get("ubwAuthToken");
        console.log("GET TRANSACTIONS GET USER DATA:");
        console.log($rootScope.user);
        user = $rootScope.user;
        if (user) {
            $scope.ETHaddress = user.ETHaddress;
            $scope.DNCaddress = user.DNCaddress;
            $scope.BTCaddress = user.BTCaddress;
        } else {
            return;
        }

        let postObject = {
            authToken : $scope.authToken
        };

        // GET PENDING/UNCONFIRMED TRANSACTIONS

        $http.post(SERVER_PORT + '/api/v1/userops/get_transactions', postObject).then( // valid API url
            function (response) {
                // success callback
                if(testing) { console.log("GET TRANSACTIONS: ", response); }
                if(response.data.success) {
                    $rootScope.addTransactions(response.data.body);
                }
                else {
                    if(redirect) {
                        if(testing){
                            window.location.href = '/login#?sessExpired&SuperController&GetTransactions';
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

        // GET BITCOIN TRANSACTIONS
        
        console.log("Getting Bitcoin Transactions");

        $http.get("https://btc.blockr.io/api/v1/address/txs/" + $scope.BTCaddress).then((response) => { // valid API url
            if(testing){ console.log("BITCOIN TRANSACTIONS FROM URL:", response.data); }
            
            var transactions = new Object();
            transactions.BTC = [];
            result = response.data.data.txs;

            for(r in result) {

                a = new Object();
                a.address = response.data.data.address;
                a.contractAddress = result[r].tx;
                a.createdAt = Date.parse(result[r].time_utc);
                a.quantity = result[r].amount;
                a.confirmations = result[r].confirmations;
                // a.quantity = result[r].value;

                transactions.BTC.push(a);
            }
            $rootScope.addTransactions(transactions);
            if(testing){ console.log("PROCESSED BITCOIN TRANSACTIONS:", transactions); }
        }, err => {
            console.log("Error getting response from Blockr while bitcoin.");
            if(testing) { console.log(response); }
        });

        // GET ETHEREUM TRANSACTIONS

        ETH_URL = "https://api.etherscan.io/api?module=account&action=txlist&address=" + $scope.ETHaddress; + "&startblock=0&endblock=99999999&sort=asc&apikey=T2E8YQZ849SAEN3KCWC4T1C4DVA9YKPHDT";

        console.log("Getting Ethereum Transactions");           
        
        $http.get( ETH_URL ).then( // valid API url
            function (response) {
                // success callback
                // if(testing) { console.log("ETHEREUM TRANSACTIONS: ", response.data.result); }

                var transactions = new Object();
                transactions.ETH = [];

                result = response.data.result;

                for(r in result) {


                    a = new Object();
                    a.id = result[r].transactionIndex;
                    a.address = result[r].hash;
                    a.funcName = result[r].nonce;
                    a.contractAddress = result[r].contractAddress;
                    a.createdAt = result[r].timeStamp;
                    a.updatedAt = result[r].timeStamp;
                    a.confirmations = result[r].confirmations;
                    params = new Object();
                    params.from = result[r].from;
                    params.to = result[r].to;
                    params.quantity = result[r].value;
                    a.params = JSON.stringify(params);

                    // console.log("ETHEREUM EXAMPLE R: ", a);
                    

                    transactions.ETH.push(a);
                }

                $rootScope.addTransactions(transactions);
                if(testing){ console.log(transactions); }
            },
            
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );

        // GET DINARCOIN TRANSACTIONS

        DNC_URL = "https://api.etherscan.io/api?module=account&action=txlist&address=0x6b8e4ba9e7eb50cf8ca6baa23df11af09963e742&startblock=0&endblock=99999999&sort=asc&apikey=T2E8YQZ849SAEN3KCWC4T1C4DVA9YKPHDT";
        DNCaddress = $scope.DNCaddress;
        UBW_CONTRACT_ADDRESS = "0x6b8e4ba9e7eb50cf8ca6baa23df11af09963e742";

        console.log("Getting Dinarcoin Transactions");
        
        $http.get( DNC_URL ).then( // valid API url
            function (response) {
                // success callback
                if(testing) { console.log("DINARCOIN TRANSACTIONS: ", response); }

                var transactions = new Object();
                transactions.DNC = [];
                result = response.data.result;
                for(r in result) {
                    if(result[r].to == UBW_CONTRACT_ADDRESS || result[r].from == UBW_CONTRACT_ADDRESS) {
                        
                        input = result[r].input;
                        mintsig =    "0x71ced69d";
                        burnsig =    "0x9dc29fac";
                        transfersig = "0xbeabacc8";

                        if(input.startsWith(mintsig) && input.includes(DNCaddress.slice(2))){

                            a = new Object();
                            a.id = result[r].transactionIndex;
                            a.address = result[r].hash;
                            a.funcName = "mint";
                            a.contractAddress = UBW_CONTRACT_ADDRESS;
                            a.createdAt = result[r].timeStamp;
                            a.updatedAt = result[r].timeStamp;
                            a.confirmations = result[r].confirmations;
                            params = new Object();
                            params.from = DNCaddress;
                            params.to = DNCaddress;
                            params.quantity = input.slice(-64)/10;
                            a.params = JSON.stringify(params);
                            transactions.DNC.push(a);
                        
                        }

                        else if(input.startsWith(burnsig) && input.includes(DNCaddress.slice(2))){

                            a = new Object();
                            a.id = result[r].transactionIndex;
                            a.address = result[r].hash;
                            a.funcName = "burn";
                            a.contractAddress = UBW_CONTRACT_ADDRESS;
                            a.createdAt = result[r].timeStamp;
                            a.updatedAt = result[r].timeStamp;
                            a.confirmations = result[r].confirmations;
                            params = new Object();
                            params.from = DNCaddress;
                            params.to = DNCaddress;
                            params.quantity = input.slice(-64)/10;
                            a.params = JSON.stringify(params);
                            transactions.DNC.push(a);
                        
                        } 

                        else if(input.startsWith(transfersig) && input.includes(DNCaddress.slice(2))) {
                            from = input.slice( 10, (10 + 64) ).replace(/^0+/, '');
                            to = input.slice( (10 + 64), (10 + 2*64) ).replace(/^0+/, '');
                            value = input.slice( (10 + 2*64), (10 + 3*64) ).replace(/^0+/, '')/10;

                            a = new Object();
                            a.id = result[r].transactionIndex;
                            a.address = result[r].hash;
                            a.funcName = "transfer";
                            a.contractAddress = UBW_CONTRACT_ADDRESS;
                            a.createdAt = result[r].timeStamp;
                            a.updatedAt = result[r].timeStamp;
                            a.confirmations = result[r].confirmations;
                            params = new Object();
                            params.from = from;
                            params.to = to;
                            params.quantity = value;
                            a.params = JSON.stringify(params);
                            transactions.DNC.push(a);
                        }


                    }

                }

                $rootScope.addTransactions(transactions);
                if(testing){ console.log(transactions); }
            },
            
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );

    };

    $rootScope.addTransactions = function(newTransactions) {
        if(testing){ console.log("ADDING TRANSACTIONS: ", newTransactions);}

        if(newTransactions.BTC) {
            $rootScope.gotBTCTransactions = true;
            $rootScope.BTCtransactions = [];    
            newTransactions.BTC.forEach(function(txn_1){
                
                var txn = new Object();

                txn.address             = txn_1.address;
                txn.contractAddress     = txn_1.contractAddress;
                txn.createdAt           = txn_1.createdAt;
                txn.confirmations       = txn_1.confirmations;
                txn.quantity            = txn_1.quantity;

                // console.log(txn.requestedAt);
                $rootScope.BTCtransactions.push(txn);
                // $rootScope.BTCtransactions.forEach(function(oldtxn){
                //     var wasAdded = false;
                //     if(oldtxn.address == txn.address) {
                //         wasAdded = true;
                //     }
                //     if(testing) {
                //         // console.log("TRANSACTION:::::: ", wasAdded, txn);
                //     }
                //     if(!wasAdded){
                //         $rootScope.BTCtransactions.push(txn);
                //     }
                // });
            });
            // $rootScope.BTCtransactions.sort(sortFunc);
            if(testing){ console.log("BITCOIN TRANSACTIONS IN ROOTSCOPE ADDTRANSACTIONS: ", $rootScope.BTCtransactions);}
        }

        if(newTransactions.ETH) {
            $rootScope.gotETHTransactions = true;
            $rootScope.ETHtransactions = [];

            // if(testing){ console.log("ADDING TRANSACTIONS[ETH]: ", newTransactions.ETH);}
            newTransactions.ETH.forEach(function(txn_1){
                
                params = JSON.parse(txn_1.params);
                var txn = new Object();

                txn.id                  = txn_1.id; 
                txn.address             = txn_1.address; 
                txn.funcName            = txn_1.funcName; 
                txn.contractAddress     = txn_1.contractAddress;
                txn.targetAddress       = txn_1.targetAddress;
                txn.from                = params.from; 
                txn.to                  = params.to; 
                txn.quantity            = params.quantity;
                txn.createdAt           = txn_1.createdAt; 
                txn.updatedAt           = txn_1.updatedAt;

                // console.log(txn.requestedAt);
                $rootScope.ETHtransactions.push(txn);

                // $rootScope.ETHtransactions.forEach(function(oldtxn){
                //     var wasAdded = false;
                //     if(oldtxn.address == txn.address) {
                //         wasAdded = true;
                //     }
                //     if(!wasAdded){
                //         $rootScope.ETHtransactions.push(txn);
                //     }
                // });
            });
            // $rootScope.ETHtransactions.sort(sortFunc);
            $rootScope.ETHtransactions.reverse();
            if(testing) {console.log("ETH Transactions from Data Storage", $rootScope.ETHtransactions);}
        }
      
        if(newTransactions.DNC) {
            $rootScope.gotDNCTransactions = true;
            $rootScope.DNCtransactions = [];

            newTransactions.DNC.forEach(function(txn_1){

                params = JSON.parse(txn_1.params);
                var txn = new Object();

                txn.id                  = txn_1.id; 
                txn.address             = txn_1.address; 
                txn.funcName            = txn_1.funcName; 
                txn.contractAddress     = txn_1.contractAddress;
                txn.targetAddress       = txn_1.targetAddress;
                txn.from                = params.from; 
                txn.to                  = params.to; 
                txn.quantity            = params.quantity;
                txn.createdAt           = txn_1.createdAt; 
                txn.updatedAt           = txn_1.updatedAt;

                // console.log(txn.requestedAt);
                $rootScope.DNCtransactions.push(txn);
                // $rootScope.DNCtransactions.forEach(function(oldtxn){
                //     var wasAdded = false;
                //     if(oldtxn.address == txn.address) {
                //         wasAdded = true;
                //     }
                //     if(!wasAdded){
                //         $rootScope.DNCtransactions.push(txn);
                //     }
                // });
            });
            $rootScope.DNCtransactions.reverse();
            // $rootScope.DNCtransactions.sort(sortFunc);
        }

        if(newTransactions.GSC) {
            newTransactions.GSC.forEach(function(txn_1){
                params = JSON.parse(txn_1.params);

                var txn = new Object();

                txn.id                  = txn_1.id; 
                txn.address             = txn_1.address; 
                txn.funcName            = txn_1.funcName; 
                txn.contractAddress     = txn_1.contractAddress;
                txn.targetAddress       = txn_1.targetAddress;
                txn.from                = params.from; 
                txn.to                  = params.to; 
                txn.quantity            = params.quantity;
                txn.createdAt           = txn_1.createdAt; 
                txn.updatedAt           = txn_1.updatedAt;

                // console.log(txn.requestedAt);
                $rootScope.GSCtransactions.forEach(function(oldtxn){
                    var wasAdded = false;
                    if(oldtxn.address == txn.address) {
                        wasAdded = true;
                    }
                    if(!wasAdded){
                        $rootScope.GSCtransactions.push(txn);
                    }
                });
            });
            $rootScope.GSCtransactions.sort(sortFunc);
        }    
    };

}]);


ngapp.controller('DashboardController', ['$http', '$scope', '$rootScope', '$cookies', '$window', 'dataStorage', '$controller', '$q', function($http, $scope, $rootScope, $cookies, $window, dataStorage, $controller, $q){
    $controller('SuperController', {$scope: $scope});

    if(testing) {
        console.log('rootScope authtoken: ', $rootScope.authToken);
    }

    var deferred = $q.defer();
    var promise = deferred.promise;

    promise
    .then(function() {
        console.log('PROMISE: Set rootScope gotTransactions to false');
        $rootScope.gotBTCTransactions = false;
        $rootScope.gotETHTransactions = false;
        $rootScope.gotDNCTransactions = false;
    })
    .then(function() {
        console.log('PROMISE: Getting user data for the first time');
        $scope.getUserData();
        console.log('PROMISE: USER DATA: ', $rootScope.user);        
    })
    .then(function() {
        console.log('PROMISE: Getting prices for the first time');
        $scope.getPrices();
        console.log('PROMISE: PRICES: ', $rootScope.prices);
    })
    .then(function() {
        console.log('PROMISE: Getting transactions for the first time');
        $scope.getTransactions();
        console.log('PROMISE: TRANSACTIONS: ', $rootScope.ETHtransactions);
    })

    deferred.resolve();

    function loop() {
        $scope.getUserData();
        $scope.getPrices();
        $scope.getPrivateBalances();
        $scope.getTransactions();
        if($rootScope.gotBTCTransactions){
            window.setTimeout(loop, 30000);           
        } else {
            window.setTimeout(loop, 5000);
        }
    }

    loop();


    // if($rootScope.gotBTCTransactions){
    //     setInterval(function(){
    //         //code goes here that will be run every 30 seconds.
    //         $scope.getUserData();
    //         $scope.getPrices();
    //         $scope.getTransactions();
    //         if( testing ) {
    //             console.log("ROOT SCOPE: ", $rootScope);
    //         }
    //     }, 30000);
    // } else {
    //     setInterval(function(){
    //         //code goes here that will be run every 30 seconds.
    //         $scope.getUserData();
    //         $scope.getPrices();
    //         $scope.getTransactions();
    //         if( testing ) {
    //             console.log("ROOT SCOPE: ", $rootScope);
    //         }
    //     }, 5000);
    // }
    

    $scope.modalActivate = function(modal, modalTab) {
        if(testing) { console.log("modalActivate called with: ", modal, modalTab); }

        $('.'+modal+'.nav-tabs>li').each( function(){
            $(this).removeClass('active');
            if($(this).attr('id') === (modalTab+'-tab')){
                $(this).addClass('active');
            }
        });

        $('.'+modal+'.tab-content>div').each( function(){
            $(this).removeClass('active');
            if($(this).attr('id') === (modalTab)){
                $(this).addClass('active');
            }
        });
    };

    $scope.logout = function () {
        $cookies.remove("ubwAuthToken");
        window.location.href = '/login#?loggedOut'
    }

}]);
