'use strict';

var Hapi = require('hapi');
var Inert = require('inert');

var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8002 
});

// Static public route
server.register(Inert, function (err) {
    if (err) throw err;
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true,
                index: true
            }
        }
    });
});

// Start the server
server.start(function(err){
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});