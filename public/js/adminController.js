ngapp.controller('AdminController', ['$http', '$scope', '$rootScope', '$cookies', '$controller', function($http, $scope, $rootScope, $cookies, $controller){
    // $controller('SuperController', {$scope: $scope});
    $scope.authToken = $cookies.get("ubwAuthToken");
    $scope.dinarAdminTransactions = [];


    $scope.dataTableOpt = {
       //custom datatable options 
      // or load data through ajax call also
      "aLengthMenu": [[10, 50, 100,-1], [10, 50, 100,'All']],
    };
    
    $scope.areTransactionsPresent = false;
    $scope.dinarAdminTransactions = [];
    
    $scope.getDinarAdminTransactions = function(){

        // GET DINARCOIN TRANSACTIONS
        DNC_URL = "https://api.etherscan.io/api?module=account&action=txlist&address=0x6b8e4ba9e7eb50cf8ca6baa23df11af09963e742&startblock=0&endblock=99999999&sort=asc&apikey=T2E8YQZ849SAEN3KCWC4T1C4DVA9YKPHDT";
        UBW_CONTRACT_ADDRESS = "0x6b8e4ba9e7eb50cf8ca6baa23df11af09963e742";
    
        console.log("Getting Dinarcoin Admin Transactions");



        $http.get( DNC_URL ).then( // valid API url
            function (response) {
                // success callback
                if(testing) { console.log("DINARCOIN TRANSACTIONS: ", response); }

                var transactions = new Object();
                result = response.data.result;
                result.reverse();

                for(r in result) {
                    if(result[r].to == UBW_CONTRACT_ADDRESS || result[r].from == UBW_CONTRACT_ADDRESS) {
                        
                        input = result[r].input;
                        mintsig =    "0x71ced69d";
                        burnsig =    "0x9dc29fac";
                        transfersig = "0xbeabacc8";

                        if(input.startsWith(mintsig)){

                            a = new Object();
                            a.id = result[r].transactionIndex;
                            a.address = result[r].hash;
                            a.funcName = "mint";
                            a.contractAddress = UBW_CONTRACT_ADDRESS;
                            a.createdAt = result[r].timeStamp;
                            a.updatedAt = result[r].timeStamp;
                            a.confirmations = result[r].confirmations;
                            a.from = "0x" + input.slice(34,74);
                            a.to = "0x" + input.slice(34,74);
                            a.quantity = parseInt(input.slice(-64), 16)/10;

                            if ($scope.dinarAdminTransactions.filter(function(e){ return e.createdAt == a.createdAt })) {
                                console.log("MINT: Found a duplicate transaction!");                                
                            } else {
                                $scope.dinarAdminTransactions.push(a);
                            }
                        

                        }

                        else if(input.startsWith(burnsig)){

                            a = new Object();
                            a.id = result[r].transactionIndex;
                            a.address = result[r].hash;
                            a.funcName = "burn";
                            a.contractAddress = UBW_CONTRACT_ADDRESS;
                            a.createdAt = result[r].timeStamp;
                            a.updatedAt = result[r].timeStamp;
                            a.confirmations = result[r].confirmations;
                            a.from = "0x" + input.slice(34,74);
                            a.to = "0x" + input.slice(34,74);
                            a.quantity = parseInt(input.slice(-64), 16)/10;
                            $scope.dinarAdminTransactions.push(a);

                            if ($scope.dinarAdminTransactions.filter(function(e){ return e.createdAt == a.createdAt })) {
                                console.log("BURN: Found a duplicate transaction!");                                
                            } else {
                                $scope.dinarAdminTransactions.push(a);
                            }
                        
                        } 

                        else if(input.startsWith(transfersig)) {
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
                            a.from = from;
                            a.to = to;
                            a.quantity = parseInt(value, 16);
                            $scope.dinarAdminTransactions.push(a);

                            if ($scope.dinarAdminTransactions.filter(function(e){ return e.createdAt == a.createdAt })) {
                                console.log("TRANSFER: Found a duplicate transaction!");                                
                            } else {
                                $scope.dinarAdminTransactions.push(a);
                            }
                        }
                    }
                }

                $scope.areTransactionsPresent = true;

                if(testing) {
                    console.log("UPDATED DNC ADMIN TRANSACTIONS: ", $scope.dinarAdminTransactions);
                }
            },
            
            function (response) {
                // failure callback
                if(testing) { console.log(response); }
            }
        );
    };

    function loop() {
        $scope.getDinarAdminTransactions();
        if($scope.dinarAdminTransactions.length > 0){
            window.setTimeout(loop, 30000);           
        } else {
            window.setTimeout(loop, 5000);
        }
    }

    loop();

}]);



        