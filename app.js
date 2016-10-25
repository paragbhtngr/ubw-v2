
/**
 * Module dependencies
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('error-handler');
var morgan = require('morgan');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
var exphbs = require('express-handlebars');

var app = module.exports = express();

/**
 * Configuration
 */

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(morgan('dev'));
app.use(bodyParser());
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

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
