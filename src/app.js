var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE


// Routers
var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var usersRouter = require('./routes/users');


//"Middleware de aplicación" hecho por mi
var logMiddleware = require('./middlewares/logMiddleware');

//Nuestra aplicacion que se ejecuta automaticamente
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // Necesario para los archivos en el folder views
app.set('view engine', 'ejs');

//Middlewares en uso en aplicacion hechos por mi
app.use(logMiddleware); //"Middleware de aplicación" cualquier pedido que hagamos va a pasar por este middleware. GET, POST, etc. aplica a toda la aplicacion en total


app.use(logger('dev'));
app.use(express.json()); //para poder almacenar la info que nos llega en Json (por ej desde un formulario)
app.use(express.urlencoded({ extended: false })); //funciona como guardia de nuestra url, permite 'capturar' informacion de ella
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // Necesario para los archivos estáticos en el folder /public
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE

// Routers URLS
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
