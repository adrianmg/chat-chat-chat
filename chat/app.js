
/**
 * Module dependencies.
 */

var express =	require('express');
var faye 	= 	require('faye');

// http server
var app 	=	express.createServer();

// faye server
var bayeux	=	new faye.NodeAdapter({
	mount:		'/faye',
	timeout:	45
});


// app configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes http

app.get('/', function(req, res){
  res.render('index', {
    title: 'chat-chat-chat'
  });
});

// Get clients bayeux
bayeux.getClient(function(){
	console.log("New client connected");
});


// Listeners
bayeux.attach(app);
app.listen(3000);


// Notice starting log

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);