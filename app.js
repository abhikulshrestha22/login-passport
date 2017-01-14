var express= require('express'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;


//Add the routes
var routes = require('./routes/index');
var users = require('./routes/users');

//initialize app 
var app = express();

//set up view engine 
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//set static folder 
app.use(express.static(path.join(__dirname,'public')));

//Express session middleware

app.use(session({
    secret:'secret123',
    resave:false,
    saveUninitialized:true
}));


//Passport init 
app.use(passport.initialize());
app.use(passport.session());

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash 
app.use(flash());

//Global vars
app.use(function (req,res,next) { 
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');   //using this coz passport sets its own flash  error
    next();
 });

app.use('/',routes);
app.use('/users',users);

app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function(){
    console.log('Server started on port ' + app.get('port'));
});