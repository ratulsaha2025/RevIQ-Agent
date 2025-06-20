import { WebSocketServer } from 'websocket';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { queryAgent } from './agent.js';

dotenv.config();

const websocketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

websocketServer.on('connection', (websocket) => {
  websocket.on('message', async (data) => {
    const response = await run(queryAgent, thread.concat({ role: 'user', content: data.toString() }));
    websocket.send(response);
  });
});