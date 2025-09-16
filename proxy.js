import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import http from 'http';
import { resolve } from 'path';

const port = process.env.PORT || 8080;

const client = new Client({ name: 'kendo-mcp-proxy', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@progress/kendo-react-mcp@latest']
});

await client.connect(transport);

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/mcp/query') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', async () => {
        const { query, component = 'General' } = JSON.parse(body || '{}');
        const result = await client.callTool({
          name: 'kendo_react_assistant',
          arguments: { query, component }
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
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
