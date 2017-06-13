
/**
 * Module dependencies
 */

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('error-handler');
var morgan = require('morgan');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');

var https = require('https');
var tls = require('tls');
var fs = require('fs');

var options = {
	key: fs.readFileSync('./ssl/key.pem'),
	cert: fs.readFileSync('./ssl/cert.pem')
};

var url = require('url');
var fs = require('fs');
// var sio = require('socket.io');
var path = require('path');
var exphbs = require('express-handlebars');


var app = module.exports = express();

/**
 * Configuration
 */

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

/**
 * Routes
 */

require('./router')(app);

/**
 * Start Server
 */

// var ssl_options = {
//   key: fs.readFileSync('./keys/privkey.pem'),
//   cert: fs.readFileSync('./keys/cert.pem'),
//   ca: [
//     fs.readFileSync('./keys/lets-encrypt-x3-cross-signed.pem')
//   ]
// };

// var httpio = http.createServer(app).listen(ioPort);
// global.io = sio.listen(httpio);
//
// var httpsio = https.createServer(ssl_options, app).listen(iosPort);
// global.ios = sio.listen(httpsio);

http.createServer(app).listen(app.get('port'), 'localhost', function () {
  console.log('Express server listening on port ' + app.get('port'));
});
