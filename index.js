'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const config = require('./config/settings');
const cfenv = require('cfenv');
const server = new Hapi.Server();
server.connection({
    port: config.port
});

// Server route  - route any folder or static file to public folder

// Add the route for health
server.route({
    method: 'GET',
    path: '/health',
    handler: function (request, reply) {
        return reply('Applicaiton is up and running...');
    }
});
//Begin SSO Configuration
var ssoConfig = null;
function initSSOConfig(){
    ssoConfig=cfenv.getAppEnv().getServiceCreds('DiscountMaintenanceSSOConfig');
    if(ssoConfig==null){
      throw 'DiscountMaintenanceSSOConfig service is not bound to the application';
    }
}
initSSOConfig();
//route for publishing sso config
server.route({
  method: 'GET',
  path: '/ssoConfig.json',
  handler: function(request, reply){
    reply(ssoConfig);
  }
});
//End SSO Configuration
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
