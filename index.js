import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

import { agent, createOpenAIInstance } from './salesforce_agent.js';

const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

wss.on('connection', function connection(ws) {
  const openai = createOpenAIInstance();
  ws.on('message', async function message(data) {
    console.log('received: %s', data);
    const response = await agent(openai, data.toString(), ws);
    ws.send(response);
  });
});