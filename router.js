/**
 * Router file:
 * This contains all the routes for the client side application. This receives
 * the information from the client and posts it to the server
 * the
 * @param app
 */

module.exports = function(app){
    app.all('/', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Headers", "GET, PUT, POST");
        return next();
    });

    app.get('/', function(req, res){
        res.render('index',{name: "Parag"});
    });

    app.get('/login', function(req, res){
        res.render('login', {
            title: 'Login'
        });
    });

    app.get('/register', function(req, res){
        res.render('register', {
            title: 'Register'
        });
    });

    app.get('/dashboard', function(req, res){
        res.render('dashboard', {
            title: 'Dashboard'
        });
    });

    app.get('/tester', function(req, res){
        res.render('tester', {
            title: 'Dashboard'
        });
    });

    app.get('/countries', function(req, res){

    });

    //other routes..
}
