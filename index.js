import { WebSocketServer } from 'ws';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { queryAgent } from './agent.js';

dotenv.config();

const socketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

socketServer.on('connection', (socket) => {
  let thread = [];
  socket.on('message', async (data) => {
    const response = await run(queryAgent, thread.concat({ role: 'user', content: data.toString() }));
    thread = response.history;
    socket.send(response.finalOutput);
  });
});