require('dotenv').config();

var createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  User = require('./models/utenti'),
  LocalStrategy = require('passport-local').Strategy,
  passportLocalMongoose = require('passport-local-mongoose'),
  flash = require('connect-flash'),
  randtoken = require('rand-token'),
  fullicu = require('full-icu'),
  session = require('express-session'),
  morgan = require('morgan'),
  winston = require('./config/winston'),
  compression = require('compression');


// connection to database
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var app = express();

var indexRouter = require('./routes/index');
var utenteRouter = require('./routes/profilo_utente');
var adminRouter = require('./routes/profilo_admin');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(compression());
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  setTimeout(next, 300)
});


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))
app.use(flash());


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

//routes
app.use('/', indexRouter);
app.use('/profilo_utente', utenteRouter);
app.use('/profilo_admin', adminRouter);


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - Username: ${req.user.username}`);

  // render the error page
  res.status(err.status || 500);
  res.render('404',{
    utente: req.user
  });
});


module.exports = app;
