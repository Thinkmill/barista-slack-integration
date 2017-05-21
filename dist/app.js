const Hapi = require('hapi');
const Inert = require('inert');
const path = require('path');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

// Inert allows the serving of static files
server.register(require('inert'), err => {
  if (err) throw err;

  // Site
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      return reply.file('./public/index.html');
    }
  });
});

// Public Files
server.route({
  method: 'GET',
  path: '/style/{file*}',
  handler: {
    directory: { path: path.resolve(__dirname, '../public/style') }
  }
});
server.route({
  method: 'GET',
  path: '/images/{file*}',
  handler: {
    directory: { path: path.resolve(__dirname, '../public/images') }
  }
});

// API
server.route({
  method: 'GET',
  path: '/api/{name}',
  handler: function (request, reply) {
    const { headers, params } = request;

    const json = {
      "success": true,
      "data": { headers, params }
    };

    return reply(json).code(200);
  }
});

// Start
server.start(err => {
  if (err) throw err;

  console.log(`Server running at: ${server.info.uri}`);
});