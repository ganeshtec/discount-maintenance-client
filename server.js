'use strict';

var Hapi = require('hapi');
var Inert = require('inert');
var ssoConfig ={
  appId: '3ed06e83-ce7f-4066-a45b-86747a886019',
  oAuthAuthorizationUrl: 'https://sso.login.run-np.homedepot.com/oauth/authorize',
  oAuthLogoutUrl: 'https://sso.login.run-np.homedepot.com/logout.do'
};
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8002
});
//route for publishing sso config
server.route({
  method: 'GET',
  path: '/ssoConfig.json',
  handler: function(request, reply){
    reply(ssoConfig);
  }
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
