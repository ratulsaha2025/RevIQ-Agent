import { WebSocketServer } from 'ws';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { salesforceAgent } from './agents/salesforce_agent.js';

dotenv.config();

const socketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT || '9898' });

socketServer.on('connection', (socket) => {
  let thread = [];
  console.log('New client connected');
  socket.on('message', async (data) => {
    try {
      const response = await run(salesforceAgent, thread.concat({ role: 'user', content: data.toString() }));
      thread = response.history;
      socket.send(response.finalOutput);
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send('Error processing message');
    }
  });
});