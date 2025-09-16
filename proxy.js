import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import http from 'http';
import { resolve } from 'path';

const port = process.env.PORT || 8080;

const licensePath = path.join(process.cwd(), 'telerik-license.txt');

const client = new Client({ name: 'kendo-mcp-proxy', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@progress/kendo-react-mcp@latest'],
  env: {
    ...process.env,
    TELERIK_LICENSE_PATH: licensePath
  }
});

await client.connect(transport);

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/mcp/query') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('error', (err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: String(err?.message || err) }));
      });
      req.on('end', async () => {
        try {
          let payload;
          try {
            payload = JSON.parse(body || '{}');
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const { query, component = 'General' } = payload || {};
          if (typeof query !== 'string' || query.trim() === '') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({ error: 'Missing required "query" string' })
            );
            return;
          }

          const result = await client.callTool({
            name: 'kendo_react_assistant',
            arguments: { query, component }
          });
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String(e?.message || e) }));
        }
      });
      return;
    }
    res.statusCode = 404;
    res.end('Not found');
  } catch (e) {
    res.statusCode = 500;
    res.end(String(e?.message || e));
  }
});

server.listen(port, () => console.log(`MCP proxy listening on :${port}`));
