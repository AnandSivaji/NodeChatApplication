var express = require('express');

module.exports = function(app) {

    app.set('views', __dirname + '/views');

    app.set('view engine', "jade");

    app.use(express.static(__dirname + '/public'));
}


