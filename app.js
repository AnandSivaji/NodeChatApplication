'use strict';

var env         = process.env.NODE_ENV || 'development';
var path        = require('path');
var express     = require('express');
var socketio    = require('socket.io');
var packageJson = require('./package.json');

console.log('App is loading in ' + env + ' mode');

var io = null;

global.App = {

    env: env,
    app: express(),
    port: process.env.PORT || 3000,
    version: packageJson.version,
    root: path.join(__dirname, '..'),

    routes: function(path) {
        return this.require('app/routes' + path);
    },

    startChatServer: function() {

        if (!this.started) {

            this.started = true;
            io = socketio.listen(this.app.listen(this.port));

            require('./config')(App.app);
            require('./routes')(App.app, io);

            console.log('Running App Version ' + App.version + ' in ' + App.env + ' mode on port ' + App.port);
        }
    }
}

App.startChatServer();
