import { WebSocketServer } from 'ws';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { queryAgent } from './agent.js';

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    const response = await run(queryAgent, thread.concat({ role: 'user', content: data.toString() }));
    ws.send(response);
  });
});