import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { UserQuerySchema } from './lib/types.js';
import coreAgent from './lib/agents/core-agent.js';

const port = process.env['PORT'] || 8080;
const secret = process.env['SECRET'];
console.log('secret', secret);

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/agents/generate', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};

    let validatedQuery: string;
    try {
      const validatedBody = UserQuerySchema.parse({
        query: payload.query || '',
        secret: payload.secret
      });

      if (validatedBody.secret !== secret) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      validatedQuery = validatedBody.query;
    } catch (err: any) {
      return res.status(400).json({
        error: String(err?.message || 'Invalid request: missing query')
      });
    }

    const result = await coreAgent.processUserQuery(validatedQuery);
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

app.use('*', (_req: Request, res: Response) => {
  res.status(404).send('Not found');
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: String(err?.message || err) });
});

app.listen(port, () => console.log(`MCP proxy listening on :${port}`));
