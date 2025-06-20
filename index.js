import { WebSocketServer } from 'ws';
import { run } from '@openai/agents';
import dotenv from 'dotenv';
import { salesforceAgent } from './agents/salesforce_agent.js';
import chalk from 'chalk';

dotenv.config();

const socketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT || '9898' });

socketServer.on('connection', (socket) => {
  let thread = [];
  console.log('New client connected');
  socket.on('message', async (data) => {
    try {
      console.log(chalk.red('Message:'), chalk.yellow(data.toString()));
      const response = await run(salesforceAgent, thread.concat({ role: 'user', content: data.toString() }));
      console.log(chalk.red('Response:'), chalk.yellow(response.finalOutput));
      
      thread = response.history;
      socket.send(response.finalOutput);
    } catch (error) {
      console.error(chalk.red('Error processing message:'), error);
      socket.send('Error processing message\n\n' + JSON.stringify(error, null, 2));
    }
  });
});