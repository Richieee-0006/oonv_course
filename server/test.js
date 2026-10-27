const http = require('http');
const { startServer, stopServer } = require('./server');

const TEST_PORT = 3099;
const BASE_URL = `http://localhost:${TEST_PORT}`;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body !== null) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting .NET Runner Test Suite ---');
  await startServer(TEST_PORT);

  let passedCount = 0;
  let failedCount = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`TEST: ${name} ... `);
      await fn();
      console.log('PASS');
      passedCount++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      failedCount++;
    }
  }

  try {
    // 1. Health check
    await test('GET /api/health returns status ok and dotnetVersion', async () => {
      const res = await makeRequest('GET', '/api/health');
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.status === 'ok', `Expected status ok, got ${res.body.status}`);
      assert(typeof res.body.dotnetVersion === 'string' && res.body.dotnetVersion.length > 0, 'dotnetVersion missing');
    });

    // 2. Build valid C# code
    await test('POST /api/build succeeds for valid C# code', async () => {
      const code = `
        using System;
        Console.WriteLine("Build test valid");
      `;
      const res = await makeRequest('POST', '/api/build', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, `Expected success true, got ${JSON.stringify(res.body)}`);
      assert(Array.isArray(res.body.diagnostics), 'Expected diagnostics array');
      assert(res.body.diagnostics.length === 0, `Expected 0 diagnostics, got ${res.body.diagnostics.length}`);
    });

    // 3. Build invalid C# code with Roslyn diagnostics
    await test('POST /api/build returns Roslyn diagnostics for syntax/type error', async () => {
      const code = `
        int a = "this is a type error";
        Console.WriteLine(a);
      `;
      const res = await makeRequest('POST', '/api/build', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === false, 'Expected success false');
      assert(Array.isArray(res.body.diagnostics), 'Expected diagnostics array');
      assert(res.body.diagnostics.length > 0, 'Expected at least 1 diagnostic');
      const err = res.body.diagnostics.find(d => d.code === 'CS0029');
      assert(err, `Expected CS0029 error diagnostic, found: ${JSON.stringify(res.body.diagnostics)}`);
      assert(err.severity === 'error', 'Expected severity error');
    });

    // 4. Run valid C# code and capture output
    await test('POST /api/run executes C# code and captures stdout', async () => {
      const code = `
        Console.WriteLine("Hello from .NET 10 Runner!");
      `;
      const res = await makeRequest('POST', '/api/run', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, `Expected success true: ${JSON.stringify(res.body)}`);
      assert(res.body.output.includes('Hello from .NET 10 Runner!'), `Unexpected output: ${res.body.output}`);
      assert(typeof res.body.executionTimeMs === 'number', 'Expected executionTimeMs number');
    });

    // 5. Run OOP polymorphism and GoF pattern code
    await test('POST /api/run executes OOP polymorphism (Strategy pattern)', async () => {
      const code = `
        using System;

        var pokladna1 = new Pokladna(new PlatbaKartou());
        pokladna1.ProvéstPlatbu(250);

        var pokladna2 = new Pokladna(new PlatbaPrevodem());
        pokladna2.ProvéstPlatbu(1000);

        public interface IPlatebniStrategie
        {
            void Zaplat(int castka);
        }

        public class PlatbaKartou : IPlatebniStrategie
        {
            public void Zaplat(int castka) => Console.WriteLine($"Platba kartou: {castka} CZK");
        }

        public class PlatbaPrevodem : IPlatebniStrategie
        {
            public void Zaplat(int castka) => Console.WriteLine($"Bankovni prevod: {castka} CZK");
        }

        public class Pokladna
        {
            private IPlatebniStrategie _strategie;
            public Pokladna(IPlatebniStrategie strategie) => _strategie = strategie;
            public void ProvéstPlatbu(int castka) => _strategie.Zaplat(castka);
        }
      `;
      const res = await makeRequest('POST', '/api/run', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, `Expected success true: ${JSON.stringify(res.body)}`);
      assert(res.body.output.includes('Platba kartou: 250 CZK'), 'Missing card payment output');
      assert(res.body.output.includes('Bankovni prevod: 1000 CZK'), 'Missing bank transfer output');
    });

    // 5b. Run classic class Program with Main entry point
    await test('POST /api/run executes classic class Program with Main entry point', async () => {
      const code = `
        using System;

        namespace Demo;

        class Program
        {
            static void Main(string[] args)
            {
                Console.WriteLine("Classic Program.Main executed successfully");
            }
        }
      `;
      const res = await makeRequest('POST', '/api/run', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, `Expected success true: ${JSON.stringify(res.body)}`);
      assert(res.body.output.includes('Classic Program.Main executed successfully'));
    });
    await test('POST /api/run captures runtime exception', async () => {
      const code = `
        using System;
        Console.WriteLine("Start of execution");
        throw new InvalidOperationException("Test unhandled exception");
      `;
      const res = await makeRequest('POST', '/api/run', { code });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === false, 'Expected success false');
      assert(res.body.output.includes('Start of execution'), 'Expected output before exception');
      assert(res.body.error.includes('InvalidOperationException'), `Expected error to contain exception: ${res.body.error}`);
    });

    // 7. Run code timeout protection
    await test('POST /api/run kills process on timeout (1200ms)', async () => {
      const code = `
        using System;
        using System.Threading;
        Console.WriteLine("Loop start");
        while (true)
        {
            Thread.Sleep(100);
        }
      `;
      const res = await makeRequest('POST', '/api/run', { code, timeoutMs: 1200 });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === false, 'Expected success false on timeout');
      assert(res.body.timedOut === true, 'Expected timedOut flag');
      assert(res.body.error.includes('timed out'), `Expected timeout message: ${res.body.error}`);
    });

    // 8. Bad input validation
    await test('POST /api/run validates bad code input parameter', async () => {
      const res = await makeRequest('POST', '/api/run', { code: 12345 });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.body.success === false, 'Expected success false');
    });

  } finally {
    await stopServer();
  }

  console.log(`\nResults: ${passedCount} passed, ${failedCount} failed.`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
