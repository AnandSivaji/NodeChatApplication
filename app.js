'use strict';

var env         = process.env.NODE_ENV || 'development';
var path        = require('path');
var express     = require('express');
var packageJson = require('./package.json');

console.log('App is loading in ' + env + ' mode');

global.App = {

    env: env,
    app: express(),
    port: process.env.PORT || 3000,
    version: packageJson.version,
    root: path.join(__dirname, '..'),

    appPath: function(path) {
        return this.root + '/' + path;
    },

    require: function(path) {
        return require(this.appPath(path));
    },

    routes: function(path) {
        return this.require('app/routes' + path);
    },

    start: function() {

        if (!this.started) {

            this.started = true;
            this.app.listen(this.port);
			console.log('Running App Version ' + App.version + ' in ' + App.env + ' mode on port ' + App.port);

        }
    }
}

App.start();