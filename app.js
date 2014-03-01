
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var ArticleProvider = require('./articleprovider').ArticleProvider;

var scheduleProvider = new ArticleProvider('ds033669.mongolab.com', 33669);
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index');
});

app.post('/new', function(req, res){
  scheduleProvider.save({schedule: req.body}, function( error, docs) {
    res.json({link: docs[0].link});
  });
});

app.get('/:id', function(req, res){
  scheduleProvider.findById(req.params.id, function(error, article) {
    res.render('schedule', {
      schedule: article.schedule,
      times: ['0800', '0900', '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900'],
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
});
