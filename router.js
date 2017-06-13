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
        res.render('admin.handlebars', {
            title: 'DNC Ledger'
        });
    });

    // app.get('/tester', function(req, res){
    //     res.render('tester.handlebars', {
    //         title: 'Dashboard'
    //     });
    // });

    var client = new postmark.Client(config.SMTP_SERVER_TOKEN_API);

}

