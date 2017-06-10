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

            BTCPromise = new Promise((resolve, reject) => {
                request(BTC_URL, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        body = JSON.parse(response.body);

                        btcTxs = [];

                        for(result in body.txrefs) {

                            btcTxs.push({
                                "address" : body.txrefs[result].tx_hash,
                                "contractAddress" : body.txrefs[result].contractAddress,
                                "createdAt" : Date.parse(body.txrefs[result].confirmed),
                                "confirmations" : body.txrefs[result].confirmations,
                                "quantity" : body.txrefs[result].value
                            });

                            console.log("adding btc txn");
                        }

                        console.log("BTC Txs Added.");

                        console.log("BTC Txs - ",btcTxs);

                        resolve(btcTxs);
                    } else {
                        console.log("BTC Transactions failed with error ",error, " and statusCode ",response.statusCode);
                        reject(err);
                    }
                });
            });

            console.log("Returning Transactions..");

            Promise.all([BTCPromise]).then(values => {
                transactions["BTC"] = values[0];
                res.end(JSON.stringify(transactions));
                console.log("Transactions sent.");
            });

        } catch(err) {
            console.log("Error in get_transactions - ",err);
            res.end(JSON.stringify(transactions));
        }
    });
    //other routes..
}

