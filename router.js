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

    app.post('/registration-success-sms', function(req, res){
        var user = config.SMS_API_USER;
        var password = config.SMS_API_PASSWORD;
        var api_id = config.SMS_API_ID;
        var to = req.body.number;
        var text = "You have been successfully registered on universalblockchains.com. You may now login with your email address and start using the wallet."
        var URL = "http://api.clickatell.com/http/sendmsg?user=" + user + "&password=" + password + "&api_id=" + api_id + "&to=" + to + "&text=" + text;

        request(URL, function (error, response, body) {
            console.log(body);
        });
    });

    var client = new postmark.Client(config.SMTP_SERVER_TOKEN_API);

    app.post('/registration-success-email', function(req, res){
        client.sendEmail({
           "From":"noreply@universalblockchains.com",
           "To": req.body.email,
           "Subject": "You have been successfully registered at universalblockchains.com",
           "TextBody": "You may now login with your email address and begin using universalblockchains.com" 
        });
        
    });

    app.post('/reset-password-success-email', function(req, res){
        client.sendEmail({
           "From":"noreply@universalblockchains.com",
           "To": req.body.email,
           "Subject": "Your passowrd at universalblockchains.com has been successfully reset",
           "TextBody": "In order to reset your password, please go to https://universalblockchains.com/resetpassword and use the code: " + req.body.code + " to reset your password."
        });
        
    });

    //other routes..
}
