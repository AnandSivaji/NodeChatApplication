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

    init: function() {

        if (!this.started) {

            this.started = true;

            require('./config')(this.app);
            require('./routes')(this.app);

            io = socketio.listen(this.app.listen(this.port));
            require('./chat')(io);

            console.log('Running App Version ' + this.version + ' in ' + this.env + ' mode on port ' + this.port);
        }
    }
}

App.init();
