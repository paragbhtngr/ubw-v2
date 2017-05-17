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

            var btc_addr = "https://api.blockcypher.com/v1/btc/main/addrs/";
            var btc_address = req.body.BTCaddress;

            var BTC_URL = btc_addr + btc_address;

            console.log('BTC_URL: ' + BTC_URL);

            request(BTC_URL, function(error, response, body) {
                body = JSON.parse(response.body);

                console.log(body);

                for(result in body.txrefs) {

                    transactions["BTC"].push({
                        "address" : result.tx_hash,
                        "contractAddress" : result.contractAddress,
                        "createdAt" : Date.parse(result.confirmed),
                        "confirmations" : result.confirmations,
                        "quantity" : result.value
                    });

                    console.log("adding btc txn");
                }

            }); 

            console.log(transactions);       
            
            // Get Ethereum Transactions
            var addr = "http://api.etherscan.io/api?module=account&action=txlist&address=";
            var address = req.body.ETHaddress;
            var start_str = "&startblock=";
            var start_block = 0;
            var end_str = "&endblock=";
            var end_block = 50;
            var api_str = "&sort=asc&apikey=";
            var apikey = config.ETHERSCAN_API_KEY;


            var URL = addr + address + start_str + start_block + end_str + end_block + api_str + apikey;

            console.log(URL);

            request(URL, function(error, response, body) {
                body = JSON.parse(response.body);

                console.log(body);

                for(result in body.result) {

                    transactions["ETH"].push({
                        "id" : result.transactionIndex,
                        "address" : result.hash,
                        "funcName" :  result.nonce,
                        "contractAddress" : result.contractAddress,
                        "createdAt" : result.timeStamp,
                        "updatedAt" : result.timeStamp,
                        "confirmations" : result.confirmations,
                        "params" : {
                            "from" : result.from,
                            "to" : result.to,
                            "quantity" : result.value,
                        }
                    });

                    console.log("adding eth txn");
                }

            });

            console.log(transactions);

            // Get Dinarcoin Transactions
            var addr = "http://api.etherscan.io/api?module=account&action=txlist&address=";
            var address = config.UBW_ADMIN_ADDRESS;
            var start_str = "&startblock=";
            var start_block = req.body.start;
            var end_str = "&endblock=";
            var end_block = req.body.end;
            var api_str = "&sort=asc&apikey=";
            var apikey = config.ETHERSCAN_API_KEY;


            var URL = addr + address + start_str + start_block + end_str + end_block + api_str + apikey;

            console.log(BTC_URL);

            request(URL, function(error, response, body) {
                body = JSON.parse(response.body);

                console.log(body);

                for(result in body.result) {

                    if(result.to == config.UBW_CONTRACT_ADDRESS || result.from == config.UBW_CONTRACT_ADDRESS) {
                        input = result.input;
                        mintsig = "0x71ced69d";
                        burnsig = "0x9dc29fac";

                        if(input.startsWith(mintsig) && input.includes(DNCaddress.slice(2))){
                            
                            transactions["DNC"].push({
                                "id" : result.transactionIndex,
                                "address" : result.hash,
                                "funcName" :  "mint",
                                "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                "createdAt" : result.timeStamp,
                                "updatedAt" : result.timeStamp,
                                "confirmations" : result.confirmations,
                                "params" : {
                                    "from" : DNCaddress,
                                    "to" : DNCaddress,
                                    "quantity" : input.slice(-64)/10,
                                }
                            });

                            console.log("adding dnc txn");

                        } else if(input.startsWith(burnsig) && input.includes(DNCaddress.slice(2))){

                            transactions["DNC"].push({
                                "id" : result.transactionIndex,
                                "address" : result.hash,
                                "funcName" :  "burn",
                                "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                "createdAt" : result.timeStamp,
                                "updatedAt" : result.timeStamp,
                                "confirmations" : result.confirmations,
                                "params" : {
                                    "from" : DNCaddress,
                                    "to" : DNCaddress,
                                    "quantity" : input.slice(-64)/10,
                                }
                            });

                            console.log("adding dnc txn");

                        } else if(input.includes(DNCaddress.slice(2))) {

                            from = input.slice( input.indexOf("[0]") + 4, input.indexOf("[0]") + 68 ).replace(/^0+/, '');
                            to = input.slice( input.indexOf("[1]") + 4, input.indexOf("[0]") + 68 ).replace(/^0+/, '');
                            value = input.slice( input.indexOf("[2]") + 4, input.indexOf("[0]") + 68 ).replace(/^0+/, '')/10;

                            transactions["DNC"].push({
                                "id" : result.transactionIndex,
                                "address" : result.hash,
                                "funcName" :  "burn",
                                "contractAddress" : config.UBW_CONTRACT_ADDRESS,
                                "createdAt" : result.timeStamp,
                                "updatedAt" : result.timeStamp,
                                "confirmations" : result.confirmations,
                                "params" : {
                                    "from" : from,
                                    "to" : to,
                                    "quantity" : value,
                                }
                            });

                            console.log("adding dnc txn");

                        }

                    }

                }

            });

            console.log(transactions);
                
            res.end(JSON.stringify(transactions));
        } catch(err) {
            console.log("Error in get_transactions - ",err);
            res.end(JSON.stringify(transactions));
        }
    });
    //other routes..
}
