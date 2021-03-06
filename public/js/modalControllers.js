/**
 * Created by parag on 11/18/16.
 */

ngapp.controller('BitcoinController', ['$http', '$scope', '$rootScope', '$cookies', '$controller', function($http, $scope, $rootScope, $cookies, $controller) {
    $controller('SuperController', { $scope: $scope });
    $scope.authToken = $cookies.get("ubwAuthToken");


    setInterval(() => {
        //code goes here that will be run every 5 seconds.
        $scope.gotBTCTransactions = $rootScope.gotBTCTransactions;
        $scope.user = $rootScope.user;
        $scope.prices = $rootScope.prices;
        $scope.BTCfee = $rootScope.BTCfee / 100000000;
        $scope.BTCtransactions = $rootScope.BTCtransactions;
        if (testing) { 
            console.log("BITCOIN TRANSACTIONS IN BITCOIN CONTROLLER: ", $rootScope.BTCtransactions); 
            console.log("BTC PRICES IN BTC CONTROLLER", $rootScope.prices);
        }
    }, 5000);

    $scope.bitcoinFilter = (txn) => {
        if (txn.metadata.fromCurrency === "BTC" || txn.metadata.toCurrency === "BTC") {
            return txn;
        }
    };

    console.log("BITCOIN MODAL CONTROLLER: ", $scope.user);

    $scope.validateSendBitcoin = () => {
        if (testing) {
            console.log("Sending Bitcoin");
            console.log($scope.user.KYCAML);
        }
        if (!$scope.user.KYCAML) { //check for KYCAML
            $('#bitcoin-info-modal').modal('toggle');
            $(() => {
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }
        // TODO: Maybe check that the bitcoin address is an actual valid address on the server?
        let btcAddress = $('#BTC-send-address');
        let btcSendAmount = $('#BTC-send-amount');

        if ($scope.sendAddress) { //check if address is valid
            if(btcAddress.hasClass('invalid')) {
                btcAddress.removeClass('invalid');
            }
        } else {
            $scope.errorMessage = "Please specify a recipient address";
            if (!(btcAddress.hasClass('invalid'))) {
                btcAddress.addClass('invalid');
            }
            return;
        }
        if ($scope.sendAmount && $scope.sendAmount > 0) { // Check if amount is valid
            if (btcSendAmount.hasClass('invalid')) {
                btcSendAmount.removeClass('invalid');
            }
        } else {
            $scope.errorMessage = "Please specify a valid amount";
            if (!(btcSendAmount.hasClass('invalid'))) {
                btcSendAmount.addClass('invalid');
            }
            return;
        }
        //all fields are valid. Confirm with user
        $('#bitcoin-info-modal').modal('toggle');
        $('#bitcoin-send-confirm-modal').modal('toggle');
    };

    $scope.cancelSendBitcoin = () => {
        $('#bitcoin-send-confirm-modal').modal('toggle');
        $('#bitcoin-info-modal').modal('toggle');
    };

    // SEND BITCOIN FUNCTION
    $scope.sendBitcoin = () => {
        // Close the modal and clear the values
        $('#bitcoin-send-confirm-modal').modal('toggle');
        // Send the amount
        let postObject = {
            authToken: $scope.authToken,
            toAddress: $scope.sendAddress,
            minerFee: $scope.minerFee,
            amount: $scope.sendAmount
        };
        // PNOTIFY SEND BITCOIN REQUEST PROCESSED BY CLIENT
        if (testing) {
            $(() => {
                new PNotify({
                    title: 'Send Bitcoin',
                    text: 'Sent request to server \n Sending ' + $scope.sendAmount + ' BTC to ' + $scope.sendAddress,
                    stack: stack_topright,
                    type: "notice"
                })
            });
        }
        // POST SEND BITCOIN REQUEST TO SERVER
        $http.post(SERVER_PORT + '/api/v1/walletops/send_BTC', postObject).then( // valid API url
            (response) => {
                // CLEAR INPUT
                $scope.sendAddress = null;
                $scope.sendAmount = null;
                // success callback
                if (testing) { console.log("SENT BTC: ", response); }
                if (response.data.success && !response.data.message) {
                    $scope.getTransactions();
                    // PNOTIFY SEND BITCOIN REQUEST RECEIVED BY SERVER
                    $(() => {
                        new PNotify({
                            title: 'Transaction Processing',
                            text: 'Your transaction was sent and will be completed pending confirmation',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }
                if (response.data.message === "insufficientFunds") {
                    // PNOTIFY INSUFFICIENT FUNDS FOR TRANSACTION
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Funds',
                            text: 'Your bitcoin transaction could not be processed',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) { window.location.href = '/login#?sessExpired&BitcoinController&SendBTC'; } else { window.location.href = '/login#?sessExpired'; }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
                // PNOTIFY SERVER ERROR
                $(() => {
                    new PNotify({
                        title: 'Server Error',
                        text: 'Request could not be completed. No response from server',
                        stack: stack_topright,
                        type: "error"
                    })
                });
            }
        );
    };

    // TODO: FINISH CHECKING FOR SERVER RESPONSE ON ADDING ACCOUNT
    $scope.addBtcAccount = () => {
        // Close the modal and clear the values
        $('#bitcoin-info-modal').modal('toggle');
        console.log("ADDING BTC ACCOUNT:", $scope.user.newBTCaddress);
        // Send the address
        let postObject = {
            authToken: $scope.authToken,
            address: $scope.user.newBTCaddress
        };
        // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
        $(() => {
            new PNotify({
                title: 'Adding Account to profile',
                text: 'Adding account ' + $scope.user.newBTCaddress + ' to your user profile',
                stack: stack_topright,
                type: "notice"
            })
        });
        $http.post(SERVER_PORT + '/api/v1/userops/add_btc_address', postObject).then(
            (response) => {
                // success callback
                if (testing) { console.log("ADDING BTC ADDRESS: ", response); }
                if (response.data.success) {
                    // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
                    $(() => {
                        new PNotify({
                            title: 'Successfully added account',
                            text: 'Bitcoin account ' + $scope.user.newBTCaddress + ' has been successfully added to your profile',
                            stack: stack_topright,
                            type: "success"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&BitcoinController&AddBTCAccount';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );

    }
}]);

ngapp.controller('EthereumController', ['$http', '$scope', '$rootScope', '$cookies', '$controller', function($http, $scope, $rootScope, $cookies, $controller) {
    $controller('SuperController', { $scope: $scope });
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(() => {
        //code goes here that will be run every 5 seconds.
        $scope.gotETHTransactions = $rootScope.gotETHTransactions;
        $scope.user = $rootScope.user;
        $scope.prices = $rootScope.prices;
        $scope.ETHtransactions = $rootScope.ETHtransactions;

        if (testing) {
            console.log("ETHEREUM TRANSACTIONS IN ETHEREUM CONTROLLER", $rootScope.ETHtransactions);
            console.log("DNC TRANSACTIONS IN ETHEREUM CONTROLLER", $rootScope.DNCtransactions);
            console.log("ETH PRICE IN ETH CONTROLLER", $rootScope.prices);
        }
    }, 5000);

    $scope.ethereumFilter = (txn) => {
        if (txn.metadata.fromCurrency === "ETH" || txn.metadata.toCurrency === "ETH") {
            return txn;
        }
    };
    $scope.validateSendEthereum = () => {
        if (testing) {
            console.log("Sending Ethereum");
            console.log($scope.user.KYCAML);
        }
        // Check KYCAML
        let ethereumInfoModal = $('#ethereum-info-modal');
        if (!$scope.user.KYCAML) {
            ethereumInfoModal.modal('toggle');
            $(() => {
                new PNotify({
                    title: 'KYCAML Not Complete',
                    text: 'Please go to the Profile section and Complete KYCAML before performing transactions',
                    stack: stack_topright,
                    type: "error"
                })
            });
            return;
        }
        let ethAddress = $('#ETH-send-address');
        let ethSendAmount = $('#ETH-send-amount');
        if ($scope.sendAddress) { // Check if Address is valid
            if (ethAddress.hasClass('invalid')) {
                ethAddress.removeClass('invalid');
            }
        } else {
            $scope.errorMessage = "Please specify a recipient address";
            if (!(ethAddress.hasClass('invalid'))) {
                ethAddress.addClass('invalid');
            }
            return;
        }
        if ($scope.sendAmount && $scope.sendAmount > 0) { // Check if amount is valid
            if (ethSendAmount.hasClass('invalid')) {
                ethSendAmount.removeClass('invalid');
            }
        } else {
            $scope.errorMessage = "Please specify a valid amount";
            if (!(ethSendAmount.hasClass('invalid'))) {
                ethSendAmount.addClass('invalid');
            }
            return;
        }
        ethereumInfoModal.modal('toggle');
        $('#ethereum-send-confirm-modal').modal('toggle');
    };
    $scope.cancelSendEthereum = () => {
        $('#ethereum-send-confirm-modal').modal('toggle');
        $('#ethereum-info-modal').modal('toggle');
    };
    $scope.sendEthereum = () => {
        // Close the modal and clear the values
        $('#ethereum-send-confirm-modal').modal('toggle');
        // Send the amount
        let postObject = {
            authToken: $scope.authToken,
            toAddress: $scope.sendAddress,
            amount: $scope.sendAmount
        };
        if (testing) {
            $(() => {
                new PNotify({
                    title: 'Send Ethereum',
                    text: 'Sent request to server \n Sending ' + $scope.sendAmount + ' ETH to ' + $scope.sendAddress,
                    stack: stack_topright,
                    type: "notice"
                })
            });
        }
        $http.post(SERVER_PORT + '/api/v1/walletops/send_ETH', postObject).then( // valid API url
            (response) => {
                // success callback
                if (testing) { console.log("SENT ETH: ", response); }
                if (response.data.success && !response.data.message) {
                    $scope.getTransactions();
                    $scope.sendAddress = null;
                    $scope.sendAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Transaction Processing',
                            text: 'Your transaction was sent and will be completed pending confirmation',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }
                if (response.data.message === "insufficientFunds") {
                    $scope.sendAddress = null;
                    $scope.sendAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Funds',
                            text: 'Your ethereum transaction could not be processed',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&EthereumController&SendETH';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    };

    // TODO: FINISH CHECKING FOR SERVER RESPONSE ON ADDING ACCOUNT
    $scope.addEthAccount = () => {
        // Close the modal and clear the values
        $('#ethereum-info-modal').modal('toggle');
        // Send the address
        console.log("ADDING ETH ACCOUNT:", $scope.user.newETHaddress);
        // Send the address
        let postObject = {
            authToken: $scope.authToken,
            address: $scope.user.newETHaddress
        };
        // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
        $(() => {
            new PNotify({
                title: 'Adding Account to profile',
                text: 'Adding account ' + $scope.user.newETHaddress + ' to your user profile',
                stack: stack_topright,
                type: "notice"
            })
        });
        $http.post(SERVER_PORT + '/api/v1/userops/add_eth_address', postObject).then(
            (response) => {
                // success callback
                if (testing) { console.log("ADDING ETH ADDRESS: ", response); }
                if (response.data.success) {
                    // PNOTIFY ADD ACCOUNT REQUEST VALIDATED ON CLIENT SIDE
                    $(() => {
                        new PNotify({
                            title: 'Successfully added account',
                            text: 'Ethereum account ' + $scope.user.newETHaddress + ' has been successfully added to your profile',
                            stack: stack_topright,
                            type: "success"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&BitcoinController&AddBTCAccount';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }
}]);

ngapp.controller('DinarcoinController', ['$http', '$scope', '$rootScope', '$cookies', '$controller', function($http, $scope, $rootScope, $cookies, $controller) {
    $controller('SuperController', { $scope: $scope });
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(() => {
        //code goes here that will be run every 5 seconds.
        $scope.gotDNCTransactions = $rootScope.gotDNCTransactions;
        $scope.user = $rootScope.user;
        $scope.prices = $rootScope.prices;
        $scope.DNCtransactions = $rootScope.DNCtransactions;
    }, 5000);

    $scope.dinarcoinFilter = (txn) => {
        if (txn.metadata.fromCurrency === "DNC" || txn.metadata.toCurrency === "DNC") {
            return txn;
        }
    };
    $scope.validateSendDinarcoin = () => {
        if (testing) { console.log("Sending Dinarcoin"); }
        if (!$scope.user.KYCAML) {
            $('#dinarcoin-info-modal').modal('toggle');
            $(() => {
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
        let dncAddress = $('#DNC-send-address');
        let dncSendAmount = $('#DNC-send-amount');

        if ($scope.sendAddress) {
            if (dncAddress.hasClass('invalid')) {
                dncAddress.removeClass('invalid');
            }
        } else {
            $scope.sendErrorMessage = "Please specify a recipient address";
            if (!(dncAddress.hasClass('invalid'))) {
                dncAddress.addClass('invalid');
            }
            return;
        }
        // Check if amount is valid
        if ($scope.sendAmount && $scope.sendAmount > 0) {
            if (dncSendAmount.hasClass('invalid')) {
                dncSendAmount.removeClass('invalid');
            }
        } else {
            $scope.sendErrorMessage = "Please specify a valid amount";
            if (!(dncSendAmount.hasClass('invalid'))) {
                dncSendAmount.addClass('invalid');
            }
            return;
        }

        $('#dinarcoin-info-modal').modal('toggle');
        $('#dinarcoin-send-confirm-modal').modal('toggle');
    };
    $scope.cancelSendDinarcoin = () => {
        $('#dinarcoin-send-confirm-modal').modal('toggle');
        $('#dinarcoin-info-modal').modal('toggle');
    };
    $scope.sendDinarcoin = () => {
        // Close the modal and clear the values
        $('#dinarcoin-send-confirm-modal').modal('toggle');

        // Send the amount
        let postObject = {
            authToken: $scope.authToken,
            toAddress: $scope.sendAddress,
            amount: $scope.sendAmount
        };

        $http.post(SERVER_PORT + '/api/v1/walletops/send_DNC', postObject).then( // valid API url
            (response) => {
                // success callback
                if (testing) { console.log("SEND DNC: ", response); }
                if (response.data.success && !response.data.message) {
                    $scope.getTransactions();
                    $scope.sendAddress = null;
                    $scope.sendAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Transaction Processing',
                            text: 'Your transaction was sent and will be completed pending confirmation',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }
                if (response.data.message === "insufficientFunds") {
                    $scope.sendAddress = null;
                    $scope.sendAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Funds',
                            text: 'Your dinarcoin transaction could not be processed',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&DinarcoinController&SendDNC';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }
    $scope.validateMintDinarcoin = () => {
        if (testing) { console.log("Minting Dinarcoin"); }
        if (!$scope.user.KYCAML) {
            $('#dinarcoin-info-modal').modal('toggle');
            $(() => {
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
        if (testing) { console.log("SENDING ", $scope.mintCurrency); }
        let mintCurrency = $('#mint-currency');
        if ($scope.mintCurrency === "BTC" || $scope.mintCurrency === "ETH") {
            if (mintCurrency.hasClass('invalid')) {
                mintCurrency.removeClass('invalid');
            }
        } else {
            $scope.mintErrorMessage = "Please Pick a currency";
            if (!(mintCurrency.hasClass('invalid'))) {
                mintCurrency.addClass('invalid');
            }
            return;
        }
        // Check if amount is valid
        let mintAmount = $('#mint-amount');
        if ($scope.mintAmount && $scope.mintAmount > 0) {
            if (mintAmount.hasClass('invalid')) {
                mintAmount.removeClass('invalid');
            }
        } else {
            $scope.mintErrorMessage = "Please specify a valid amount";
            if (!(mintAmount.hasClass('invalid'))) {
                mintAmount.addClass('invalid');
            }
            return;
        }

        $('#dinarcoin-info-modal').modal('toggle');
        $('#dinarcoin-mint-confirm-modal').modal('toggle');
    };
    $scope.cancelMintDinarcoin = () => {
        $('#dinarcoin-mint-confirm-modal').modal('toggle');
        $('#dinarcoin-info-modal').modal('toggle');
    };
    $scope.mintDinarcoin = () => {
        // Close the modal and clear the values
        $('#dinarcoin-mint-confirm-modal').modal('toggle');

        // mint the amount
        let postObject = {
            authToken: $scope.authToken,
            fromCurrency: $scope.mintCurrency,
            amount: $scope.mintAmount // TODO: Change Amount from BTC/ETH to DNC
        };

        if (testing) {
            console.log("MINTING DINARCOIN WITH THE FOLLOWING ATTRIBUTES");
            // console.log(postObject.toString());
            $(() => {
                new PNotify({
                    title: 'Minting Dinarcoin',
                    text: 'Sent request to server \n Minting ' + $scope.mintAmount + ' DNC',
                    stack: stack_topright,
                    type: "notice"
                })
            });
        }

        $http.post(SERVER_PORT + '/api/v1/walletops/buy_DNC', postObject).then( // valid API url
            (response) => {
                // success callback
                if (testing) { console.log("BUYING DNC: ", response); }
                if (response.data.success && !response.data.message) {
                    $scope.getTransactions();
                    $scope.mintCurrency = null;
                    $scope.mintAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Transaction Processing',
                            text: 'Your transaction was sent and will be completed pending confirmation',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });
                }
                if (response.data.message === "insufficientFunds") {
                    $scope.mintCurrency = null;
                    $scope.mintAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Funds',
                            text: 'Your dinarcoin transaction could not be processed',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "insufficientAdminFunds") {
                    $scope.mintCurrency = null;
                    $scope.mintAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Admin Funds',
                            text: 'Your dinarcoin transaction could not be processed. Not enough funds in admin account. Please try again later.',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&DinarcoinController&BuyDNC';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    };
    $scope.validateBurnDinarcoin = () => {
        if (testing) { console.log("burning Dinarcoin"); }
        if (!$scope.user.KYCAML) {
            $('#dinarcoin-info-modal').modal('toggle');
            $(() => {
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
        if (testing) { console.log("SENDING ", $scope.burnCurrency); }
        let burnCurrency = $('#burn-currency');
        if ($scope.burnCurrency === "BTC" || $scope.burnCurrency === "ETH") {
            if (burnCurrency.hasClass('invalid')) {
                burnCurrency.removeClass('invalid');
            }
        } else {
            $scope.burnErrorMessage = "Please Pick a currency";
            if (!(burnCurrency.hasClass('invalid'))) {
                burnCurrency.addClass('invalid');
            }
            return;
        }
        // Check if amount is valid
        let burnAmount = $('#burn-amount');
        if ($scope.burnAmount && $scope.burnAmount > 0) {
            if (burnAmount.hasClass('invalid')) {
                burnAmount.removeClass('invalid');
            }
        } else {
            $scope.burnErrorMessage = "Please specify a valid amount";
            if (!(burnAmount.hasClass('invalid'))) {
                burnAmount.addClass('invalid');
            }
            return;
        }
        $('#dinarcoin-info-modal').modal('toggle');
        $('#dinarcoin-burn-confirm-modal').modal('toggle');
    };
    $scope.cancelBurnDinarcoin = () => {
        $('#dinarcoin-burn-confirm-modal').modal('toggle');
        $('#dinarcoin-info-modal').modal('toggle');
    };
    $scope.burnDinarcoin = () => {
        // Close the modal and clear the values
        $('#dinarcoin-burn-confirm-modal').modal('toggle');
        // mint the amount
        let postObject = {
            authToken: $scope.authToken,
            toCurrency: $scope.burnCurrency,
            amount: $scope.burnAmount // TODO: Change currency from BTC/ETH to DNC
        };
        if (testing) {
            console.log("BURNING DINARCOIN WITH THE FOLLOWING ATTRIBUTES");
            console.log(postObject.toString());
            $(() => {
                new PNotify({
                    title: 'Burning DNC',
                    text: 'Sent request to server \n Burning ' + $scope.burnAmount + ' DNC',
                    stack: stack_topright,
                    type: "notice"
                })
            });
        }
        $http.post(SERVER_PORT + '/api/v1/walletops/sell_DNC', postObject).then( // valid API url
            (response) => {
                // success callback
                if (testing) { console.log("SELL DNC RESPONSE: ", response); }
                if (response.data.success && !response.data.message) {
                    $scope.getTransactions();
                    $scope.burnCurrency = null;
                    $scope.burnAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Transaction Processing',
                            text: 'Your transaction was sent and will be completed pending confirmation',
                            stack: stack_topright,
                            type: "notice"
                        })
                    });

                }
                if (response.data.message === "insufficientFunds") {
                    $scope.burnCurrency = null;
                    $scope.burnAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Insufficient Funds',
                            text: 'Your dinarcoin transaction could not be processed',
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                }
                if (response.data.message === "ticket") {
                    $scope.burnCurrency = null;
                    $scope.burnAmount = null;
                    $(() => {
                        new PNotify({
                            title: 'Error in Transaction',
                            text: ('Your DNC burn transaction could not be processed due to an error. A new ticket has been opened for this transaction. \n\n Your ticket ID for this transacation is: ' + response.data.ticketID),
                            stack: stack_topright,
                            type: "error"
                        })
                    });
                } else if (response.data.message === "invalidAuthToken") {
                    if (redirect) {
                        if (testing) {
                            window.location.href = '/login#?sessExpired&DinarcoinController&SellDNC';
                        } else {
                            window.location.href = '/login#?sessExpired';
                        }
                    }
                }
            },
            (response) => {
                // failure callback
                if (testing) { console.log(response); }
            }
        );
    }
}]);

ngapp.controller('instrumentsController', ['$http', '$scope', '$rootScope', '$cookies', '$controller', function($http, $scope, $rootScope, $cookies, $controller) {
    $controller('SuperController', { $scope: $scope });
    $scope.authToken = $cookies.get("ubwAuthToken");

    setInterval(() => {
        //code goes here that will be run every 5 seconds.
        $scope.gotTransactions = $rootScope.gotTransactions;
        $scope.user = $rootScope.user;
        $scope.prices = $rootScope.prices;
        $scope.GSCtransactions = $rootScope.GSCtransactions;
    }, 5000);

    $scope.GSCFilter = function(txn) {
        if (
            txn.metadata.fromCurrency === "GOLD_1G" || txn.metadata.toCurrency === "GOLD_1G" ||
            txn.metadata.fromCurrency === "GOLD_100G" || txn.metadata.toCurrency === "GOLD_100G" ||
            txn.metadata.fromCurrency === "GOLD_1KG" || txn.metadata.toCurrency === "GOLD_1KG" ||
            txn.metadata.fromCurrency === "SILVER100Oz" || txn.metadata.toCurrency === "SILVER100Oz" ||
            txn.metadata.fromCurrency === "SILVER1KG" || txn.metadata.toCurrency === "SILVER1KG"
        ) {
            return txn;
        }
    };

    // $scope.sendGSC = () => {
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

    $scope.mintGSC = () => {
        if (testing) { console.log("Minting GSC"); }

        if (!$scope.user.KYCAML) {

            $('#GSC-info-modal').modal('toggle');

            $(() => {
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
        if (testing) { console.log("SENDING ", $scope.mintCurrency); }
        if (
            $scope.mintInstrument === "GOLD_1G" ||
            $scope.mintInstrument === "GOLD_100G" ||
            $scope.mintInstrument === "GOLD_1KG" ||
            $scope.mintInstrument === "SILVER100Oz" ||
            $scope.mintInstrument === "SILVER1KG"
        ) {

            if ($('#mint-instrument').hasClass('invalid')) {
                $('#mint-instrument').removeClass('invalid');
            }

            // Check if Currency is valid
            if (
                $scope.mintCurrency === "BTC" ||
                $scope.mintCurrency === "ETH" ||
                $scope.mintCurrency === "DNC"
            ) {

                if ($('#mint-currency').hasClass('invalid')) {
                    $('#mint-currency').removeClass('invalid');
                }

                // Check if amount is valid and at least 0.1
                if ($scope.mintAmount && $scope.mintAmount > 0 && $scope.mintAmount % 0.1 == 0) {
                    if ($('#mint-amount').hasClass('invalid')) {
                        $('#mint-amount').removeClass('invalid');
                    }

                    // Close the modal and clear the values
                    $('#GSC-info-modal').modal('toggle');

                    // mint the amount
                    let postObject = {
                        authToken: $scope.authToken,
                        instrument: $scope.mintInstrument,
                        fromCurrency: $scope.mintCurrency,
                        amount: $scope.mintAmount // TODO: Change amount from DNC to GSC unit
                    };

                    if (testing) {
                        console.log("MINTING GSC WITH THE FOLLOWING ATTRIBUTES NOW-");
                        console.log(postObject.toString());
                        $(() => {
                            new PNotify({
                                title: 'Minting GSC',
                                // text: postObject,
                                text: 'Sent request to server \n Minting ' + $scope.mintAmount + ' ' + $scope.mintCurrency,
                                stack: stack_topright,
                                type: "notice"
                            })
                        });
                    }

                    $scope.tmp_req = postObject;

                    $http.post(SERVER_PORT + '/api/v1/walletops/buy_GSC', postObject).then( // valid API url
                        (response) => {
                            // success callback
                            if (testing) { console.log("BUYING GSC: ", response); }
                            if (response.data.success && !response.data.message) {
                                $scope.getTransactions();
                                $scope.mintCurrency = null;
                                $scope.mintAmount = null;
                                $(() => {
                                    new PNotify({
                                        title: 'Transaction Processing',
                                        text: 'Your transaction was sent and will be completed pending confirmation',
                                        stack: stack_topright,
                                        type: "notice"
                                    })
                                });
                            }
                            if (response.data.message === "insufficientFunds") {
                                $scope.mintCurrency = null;
                                $scope.mintAmount = null;
                                $(() => {
                                    new PNotify({
                                        title: 'Insufficient Funds',
                                        text: 'Your GSC transaction could not be processed',
                                        stack: stack_topright,
                                        type: "error"
                                    })
                                });
                            } else if (response.data.message === "invalidAuthToken") {
                                if (redirect) {
                                    if (testing) {
                                        window.location.href = '/login#?sessExpired&InstrumentController&BuyGSC';
                                    } else {
                                        window.location.href = '/login#?sessExpired';
                                    }
                                }
                            }
                        },
                        (response) => {
                            // failure callback
                            if (testing) { console.log(response); }
                        }
                    );

                } else {
                    if ($scope.mintAmount > 0 && $scope.mintAmount < 0.1) {
                        $scope.mintErrorMessage = "Minimum mint amount is 0.1 DNC";
                    } else if ($scope.mintAmount > 0 && $scope.mintAmount % 0.1 !== 0) {
                        $scope.mintErrorMessage = "Please enter an amount that is divisible ";
                    }
                    $scope.mintErrorMessage = "Please specify a valid amount";
                    if (!($('#mint-amount').hasClass('invalid'))) {
                        $('#mint-amount').addClass('invalid');
                    }
                }



            } else {
                $scope.mintErrorMessage = "Please Pick a currency";
                if (!($('#mint-currency').hasClass('invalid'))) {
                    $('#mint-currency').addClass('invalid');
                }
            }
        } else {
            $scope.mintErrorMessage = "Please Pick an instrument";
            if (!($('#mint-instrument').hasClass('invalid'))) {
                $('#mint-instrument').addClass('invalid');
            }
        }
    };

    $scope.burnGSC = () => {
        if (testing) { console.log("burning GSC"); }

        if (!$scope.user.KYCAML) {

            $('#GSC-info-modal').modal('toggle');

            $(() => {
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
        if (testing) { console.log("SENDING ", $scope.burnCurrency); }
        if (
            $scope.burnInstrument === "GOLD_1G" ||
            $scope.burnInstrument === "GOLD_100G" ||
            $scope.burnInstrument === "GOLD_1KG" ||
            $scope.burnInstrument === "SILVER100Oz" ||
            $scope.burnInstrument === "SILVER1KG"
        ) {

            if ($('#burn-instrument').hasClass('invalid')) {
                $('#burn-instrument').removeClass('invalid');
            }

            // Check if Currency is valid
            if (
                $scope.burnCurrency === "BTC" ||
                $scope.burnCurrency === "ETH" ||
                $scope.burnCurrency === "DNC"
            ) {

                if ($('#burn-currency').hasClass('invalid')) {
                    $('#burn-currency').removeClass('invalid');
                }

                // Check if amount is valid
                if ($scope.burnAmount && $scope.burnAmount > 0) {
                    if ($('#burn-amount').hasClass('invalid')) {
                        $('#burn-amount').removeClass('invalid');
                    }

                    // Close the modal and clear the values
                    $('#GSC-info-modal').modal('toggle');

                    // burn the amount
                    let postObject = {
                        authToken: $scope.authToken,
                        instrument: $scope.burnInstrument,
                        toCurrency: $scope.burnCurrency,
                        amount: $scope.burnAmount
                    };

                    if (testing) {
                        console.log("BURNING GSC WITH THE FOLLOWING ATTRIBUTES");
                        console.log(postObject.toString());
                        $(() => {
                            new PNotify({
                                title: 'Burning GSC',
                                text: 'Sent request to server \n Burning ' + $scope.burnAmount + ' ' + $scope.burnCurrency,
                                stack: stack_topright,
                                type: "notice"
                            })
                        });
                    }

                    $http.post(SERVER_PORT + '/api/v1/walletops/sell_GSC', postObject).then( // valid API url
                        (response) => {
                            // success callback
                            if (testing) { console.log("SELLING GSC: ", response); }
                            if (response.data.success && !response.data.message) {
                                $scope.getTransactions();
                                $scope.burnCurrency = null;
                                $scope.burnAmount = null;
                                $(() => {
                                    new PNotify({
                                        title: 'Transaction Processing',
                                        text: 'Your transaction was sent and will be completed pending confirmation',
                                        stack: stack_topright,
                                        type: "notice"
                                    })
                                });
                            }
                            if (response.data.message === "insufficientFunds") {
                                $scope.burnCurrency = null;
                                $scope.burnAmount = null;
                                $(() => {
                                    new PNotify({
                                        title: 'Insufficient Funds',
                                        text: 'Your GSC transaction could not be processed',
                                        stack: stack_topright,
                                        type: "error"
                                    })
                                });
                            } else if (response.data.message === "invalidAuthToken") {
                                if (redirect) {
                                    if (testing) {
                                        window.location.href = '/login#?sessExpired&InstrumentController&SellGSC';
                                    } else {
                                        window.location.href = '/login#?sessExpired';
                                    }
                                }
                            }
                        },
                        (response) => {
                            // failure callback
                            if (testing) { console.log(response); }
                        }
                    );

                } else {
                    $scope.burnErrorMessage = "Please specify a valid amount";
                    if (!($('#burn-amount').hasClass('invalid'))) {
                        $('#burn-amount').addClass('invalid');
                    }
                }



            } else {
                $scope.burnErrorMessage = "Please Pick a currency";
                if (!($('#burn-currency').hasClass('invalid'))) {
                    $('#burn-currency').addClass('invalid');
                }
            }
        } else {
            $scope.burnErrorMessage = "Please Pick an instrument";
            if (!($('#burn-instrument').hasClass('invalid'))) {
                $('#burn-instrument').addClass('invalid');
            }
        }
    }

}]);