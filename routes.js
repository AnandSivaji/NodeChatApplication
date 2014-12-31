'use strict';

module.exports = function(app) {

    app.get('/', function(request, response) {

        response.render('home');
    });

    app.get('/create/private', function(request, response) {

        var id = Math.round((Math.random() * 1000000));
        response.redirect('/chat/private/' + id);
    });

    app.get('/chat/private/:id', function(request, response) {

        response.render('privatechat');
    });

    app.get('/chat/group', function(request, response) {

        response.render('publicchat');
    });

    app.get('/chat/group/:groupName', function(request, response) {

        response.render('publicchat');
    });
}
