/**
 * Router file:
 * This contains all the routes for the client side application. This receives
 * the information from the client and posts it to the server
 * the
 * @param app
 */

var postmark = require("postmark");
var config = require("./config.js");
var http = require("http");
var request = require("request");

var client = new postmark.Client(config.POSTMARK_API_ID);

module.exports = function(app){
    // app.all('/', function (req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     res.header("Access-Control-Allow-Headers", "GET, PUT, POST");
    //     return next();
    // });

    app.get('/', function(req, res){
        res.render('login.handlebars', {
            title: 'Login'
        });
    });

    app.get('/login', function(req, res){
        res.render('login.handlebars', {
            title: 'Login'
        });
    });

    app.get('/register', function(req, res){
        res.render('register.handlebars', {
            title: 'Register'
        });
    });

    app.get('/dashboard', function(req, res){
        res.render('dashboard.handlebars', {
            title: 'Dashboard'
        });
    });

    app.get('/profile', function(req, res){
        res.render('profile.handlebars', {
            title: 'Profile'
        });
    });

    app.get('/resetpassword', function(req, res){
        res.render('resetpw.handlebars', {
            title: 'Reset Password'
        });
    });

    app.get('/admin', function(req, res){
        res.render('admin.handlebars', {
            title: 'DNC Ledger'
        });
    });

    // app.get('/tester', function(req, res){
    //     res.render('tester.handlebars', {
    //         title: 'Dashboard'
    //     });
    // });

    app.get('/countries', function(req, res){

    });

    app.post('/registration_success_test', function(req, res){
        res.send("It worked");
    });

    app.post('/registration_success_sms', function(req, res){
        var user = config.SMS_API_USER;
        var password = config.SMS_API_PASSWORD;
        var api_id = config.SMS_API_ID;
        var to = req.body.number;
        to = to.replace(/\D/g,'');
        var text = "You have been successfully registered on universalblockchains.com. You may now login with your email address and start using the wallet."
        var URL = "http://api.clickatell.com/http/sendmsg?user=" + user + "&password=" + password + "&api_id=" + api_id + "&to=" + to + "&text=" + text;

        request(URL, function (error, response, body) {
            console.log(body);
        });

        res.end(req.body.number);
    });

    var client = new postmark.Client(config.SMTP_SERVER_TOKEN_API);

    app.post('/registration_success_email', function(req, res){
        client.sendEmail({
           "From":"noreply@universalblockchains.com",
           "To": req.body.email,
           "Subject": "You have been successfully registered at universalblockchains.com",
           "TextBody": "You may now login with your email address and begin using universalblockchains.com"
        });

        res.end(req.body.email);
    });

    app.post('/reset_password_success_email', function(req, res){
        client.sendEmail({
           "From":"noreply@universalblockchains.com",
           "To": req.body.email,
           "Subject": "Your password at universalblockchains.com has been successfully reset",
           "TextBody": "In order to reset your password, please go to https://universalblockchains.com/resetpassword and use the code: " + req.body.code + " to reset your password."
        });

        res.end(req.body.email);
    });

    app.post('/get_transactions', function(req, res){
        try {
            transactions = {
                "BTC" : [],
                "ETH" : [],
                "DNC" : []
            };

            // Get Bitcoin Transactions

            // var btc_addr = "https://api.blockcypher.com/v1/btc/main/addrs/";
            // var btc_address = req.body.BTCaddress;

            var btc_addr = "https://blockchain.info/address/";
            var btc_address = req.body.BTCaddress;
            var btc_addr2 = "?format=json";

            var BTC_URL = btc_addr + btc_address + btc_addr2;

            // console.log('BTC_URL: ' + BTC_URL);

            BTCPromise = new Promise((resolve, reject) => {
                if(req.body.BTCaddress){
                    request(BTC_URL, function(error, response, body) {
                        if(!error && response.statusCode == 200) {
                            body = JSON.parse(response.body);

                            btcTxs = [];

                            for(result in body.tx) {

                                btcTxs.push({
                                    "address" : body.txrefs[result].tx_hash,
                                    "contractAddress" : body.txrefs[result].contractAddress,
                                    "createdAt" : Date.parse(body.txrefs[result].confirmed),
                                    "confirmations" : body.txrefs[result].confirmations,
                                    "quantity" : body.txrefs[result].value
                                });

                                // console.log("adding btc txn");
                            }

                            // console.log("BTC Txs Added.");

                            console.log("BTC Txs - ",btcTxs);

                            resolve(btcTxs);
                        } else if(response.statusCode == 429) {
                            console.log("Blockcypher API received too many requests. Responded with Status: 429");
                        } else {
                            console.log("BTC Transactions failed with error ",error, " and statusCode ",response.statusCode);
                            reject([]);
                        }
                    });
                } else {
                    resolve([]);
                }
            });

            // Get Ethereum Transactions
            var addr = "http://api.etherscan.io/api?module=account&action=txlist&address=";
            var address = req.body.ETHaddress;
            var start_str = "&startblock=";
            var start_block = 0;
            var end_str = "&endblock=";
            var end_block = 99999999;
            var api_str = "&sort=asc&apikey=";
            var apikey = config.ETHERSCAN_API_KEY;


            var ETH_URL = addr + address + start_str + start_block + end_str + end_block + api_str + apikey;

            console.log(ETH_URL);

            ETHPromise = new Promise((resolve, reject) => {
                if(req.body.ETHaddress){
                    request(ETH_URL, function(error, response, body) {
                        if(!error && response.statusCode == 200) {
                            body = JSON.parse(response.body);
                            
                            // console.log(body.result);

                            ethTxs = [];

                            for(r in body.result) {

                                ethTxs.push({
                                    "id" : body.result[r].transactionIndex,
                                    "address" : body.result[r].hash,
                                    "funcName" :  body.result[r].nonce,
                                    "contractAddress" : body.result[r].contractAddress,
                                    "createdAt" : body.result[r].timeStamp,
                                    "updatedAt" : body.result[r].timeStamp,
                                    "confirmations" : body.result[r].confirmations,
                                    "params" : {
                                        "from" : body.result[r].from,
                                        "to" : body.result[r].to,
                                        "quantity" : body.result[r].value,
                                    }
                                });

                                // console.log("adding eth txn");
                            }

                            // console.log("ETH Txs Added.");

                            // console.log("ETH Txs - ",ethTxs);

                            resolve(ethTxs);
                        } else {
                            console.log("ETH Transactions failed with error ",error, " and statusCode ",response.statusCode);
                            reject(err);
                        }
                    });                    
                } else {
                    resolve([]);
                }
            });

            // Get Dinarcoin Transactions
            var addr = "http://api.etherscan.io/api?module=account&action=txlist&address=";
            var address = config.UBW_CONTRACT_ADDRESS;
            var start_str = "&startblock=";
            var start_block = 0;
            var end_str = "&endblock=";
            var end_block = 99999999;
            var api_str = "&sort=asc&apikey=";
            var apikey = config.ETHERSCAN_API_KEY;


            var DNC_URL = addr + address + start_str + start_block + end_str + end_block + api_str + apikey;
            DNCaddress = req.body.DNCaddress;

            console.log(DNC_URL);

            DNCPromise = new Promise((resolve, reject) => {
                if(req.body.DNCaddress){
                    
                    request(DNC_URL, function(error, response, body) {
                        if(!error && response.statusCode == 200) {
                            body = JSON.parse(response.body);

                            dncTxs = [];

                            for(r in body.result) {

                                if(body.result[r].to == config.UBW_CONTRACT_ADDRESS || body.result[r].from == config.UBW_CONTRACT_ADDRESS) {
                                    input = body.result[r].input;
                                    // console.log(input);
                                    // console.log("QUANTITY:", input.slice(-64)/10 ); 
                                    mintsig =    "0x71ced69d";
                                    burnsig =    "0x9dc29fac";
                                    transfersig = "0xbeabacc8";

                                    // console.log("Input is ",input);
                                    // console.log("Input startswith ",mintsig," for mint - ",input.startsWith(mintsig));

                                    if(input.startsWith(mintsig) && input.includes(DNCaddress.slice(2))){
                                        // console.log("Pushing DNC Tx for Mint - ");
                                        // console.log("From Address: ",req.body.DNCaddress);

                                        dncTxs.push({
                                            "id" : body.result[r].transactionIndex,
                                            "address" : body.result[r].hash,
                                            "funcName" :  "mint",
                                            "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                            "createdAt" : body.result[r].timeStamp,
                                            "updatedAt" : body.result[r].timeStamp,
                                            "confirmations" : body.result[r].confirmations,
                                            "params" : {
                                                "from" : req.body.DNCaddress,
                                                "to" : req.body.DNCaddress,
                                                "quantity" : input.slice(-64)/10,
                                            }
                                        });

                                        // console.log("adding dnc txn");

                                    } else if(input.startsWith(burnsig) && input.includes(DNCaddress.slice(2))){
                                        // console.log("Pushing DNC Tx for Burn - ");
                                        // console.log("From Address: ",req.body.DNCaddress);

                                        dncTxs.push({
                                            "id" : body.result[r].transactionIndex,
                                            "address" : body.result[r].hash,
                                            "funcName" :  "burn",
                                            "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                            "createdAt" : body.result[r].timeStamp,
                                            "updatedAt" : body.result[r].timeStamp,
                                            "confirmations" : body.result[r].confirmations,
                                            "params" : {
                                                "from" : req.body.DNCaddress,
                                                "to" : req.body.DNCaddress,
                                                "quantity" : input.slice(-64)/10,
                                            }
                                        });

                                        // console.log("adding dnc txn");

                                    } else if(input.startsWith(transfersig) && input.includes(DNCaddress.slice(2))) {

                                        // console.log("Pushing DNC Tx for Transfer - ");
                                        // console.log("TRANSFER INPUT:" + input);

                                        from = input.slice( 10, (10 + 64) ).replace(/^0+/, '');
                                        to = input.slice( (10 + 64), (10 + 2*64) ).replace(/^0+/, '');
                                        value = input.slice( (10 + 2*64), (10 + 3*64) ).replace(/^0+/, '')/10;
                                        
                                        //  console.log("From Address: ",from);
                                        
                                        dncTxs.push({
                                            "id" : body.result[r].transactionIndex,
                                            "address" : body.result[r].hash,
                                            "funcName" :  "transfer",
                                            "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                            "createdAt" : body.result[r].timeStamp,
                                            "updatedAt" : body.result[r].timeStamp,
                                            "confirmations" : body.result[r].confirmations,
                                            "params" : {
                                                "from" : from,
                                                "to" : to,
                                                "quantity" : value,
                                            }
                                        });

                                        // console.log("adding dnc txn");

                                    }

                                    // console.log("adding eth txn");
                                }

                                // console.log("DNC Txs Added.");

                                // console.log("DNC Txs - ",dncTxs);

                                resolve(dncTxs);
                            } 

                            resolve(dncTxs);

                        } else {
                                console.log("DNC Transactions failed with error ",error, " and statusCode ",response.statusCode);
                                reject(err);
                            }
                    });
                } else {
                    resolve([]);
                }
            });

            console.log("Returning Transactions..");

            // Promise.all([ETHPromise, DNCPromise]).then(values => {
            Promise.all([BTCPromise, ETHPromise, DNCPromise]).then(values => {
                transactions["BTC"] = values[0];
                transactions["ETH"] = values[1];
                transactions["DNC"] = values[2];
                res.send(JSON.stringify(transactions));
                console.log("Transactions sent.");
                console.log("TRANSACTIONS: \n\n\n",transactions);
            });

        } catch(err) {
            console.log("Error in get_transactions - ",err);
            res.send(JSON.stringify(transactions));
        }
    });
    //other routes..
}

