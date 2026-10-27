const { app, startServer, stopServer } = require('./server');
const { runCSharp, buildCSharp, getDotnetVersion } = require('./runner');

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
  stopServer,
  runCSharp,
  buildCSharp,
  getDotnetVersion
};
