'use strict';

module.exports = function(app, io) {

	app.get('/', function(request, response){

		response.render('home');
	});

	app.get('/create', function(request, response){

		var id = Math.round((Math.random() * 1000000));
		response.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(request, response){

		response.render('chat');
	});
}