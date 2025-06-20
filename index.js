import { WebSocketServer } from 'ws';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { salesforceAgent } from './agent.js';

dotenv.config();

const socketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

socketServer.on('connection', (socket) => {
  let thread = [];
  console.log('New client connected');
  socket.on('message', async (data) => {
    try {
      console.log('Message from client:', data.toString());
      const response = await run(salesforceAgent, thread.concat({ role: 'user', content: data.toString() }));
      console.log('Response from agent:', response.finalOutput);
      thread = response.history;
      socket.send(response.finalOutput);
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send('Error processing message');
    }
  });
});