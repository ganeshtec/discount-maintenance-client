// 'use strict';

// var Hapi = require('hapi');
// var Inert = require('inert');

// var server = new Hapi.Server();
// server.connection({ 
// 	host: 'localhost', 
// 	port: 8002
// });

// // Static public route
// server.register(Inert, function (err) {
// 	if (err) throw err;
// 	server.route({
// 		method: 'GET',
// 		path: '/{param*}',
// 		handler: {
// 			directory: {
// 				path: './public',
// 				redirectToSlash: true,
// 				index: true
// 			}
// 		}
// 	});
// });

// // Start the server
// server.start(function(err){
// 	if (err) {
// 		throw err;
// 	}
// 	console.log('Server running at:', server.info.uri);
// });

'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const config = require('./config/settings');
const server = new Hapi.Server();
server.connection({
    port: config.port
});

// Server route  - route any folder or static file to public folder

// Add the route
server.route({
    method: 'GET',
    path: '/health',
    handler: function (request, reply) {
        return reply('Applicaiton is up and running...');
    }
});
//static file mapping
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

server.start(() => {
  server.log('info', 'Server running at: ' + server.info.uri);

});
