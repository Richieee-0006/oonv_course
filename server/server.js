const express = require('express');
const cors = require('cors');
const {
  getDotnetVersion,
  buildCSharp,
  runCSharp
} = require('./runner');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dotnetVersion = await getDotnetVersion();
    res.json({
      status: 'ok',
      dotnetVersion
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Compile / Build endpoint
app.post('/api/build', async (req, res) => {
  const { code } = req.body || {};

  if (typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request: "code" must be a string'
    });
  }

  try {
    const result = await buildCSharp(code);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Internal build error: ${err.message}`,
      diagnostics: []
    });
  }
});

// Run C# code endpoint
app.post('/api/run', async (req, res) => {
  const { code, timeoutMs, stdin } = req.body || {};

  if (typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      output: '',
      error: 'Invalid request: "code" must be a string',
      executionTimeMs: 0
    });
  }

  try {
    const result = await runCSharp(code, { timeoutMs, stdin });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      output: '',
      error: `Internal runner error: ${err.message}`,
      executionTimeMs: 0
    });
  }
});

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

let serverInstance = null;

function startServer(port = PORT) {
  return new Promise((resolve) => {
    serverInstance = app.listen(port, () => {
      console.log(`C# Runner API listening on port ${port}`);
      resolve(serverInstance);
    });
  });
}

function stopServer() {
  return new Promise((resolve, reject) => {
    if (serverInstance) {
      serverInstance.close((err) => {
        if (err) return reject(err);
        serverInstance = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
  stopServer
};
