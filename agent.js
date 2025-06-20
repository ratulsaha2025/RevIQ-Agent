import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import dotenv from 'dotenv';
import chalk from 'chalk';

import { listAllSObjects, describeSObject, soqlQuery } from './salesforce.js';

dotenv.config();

const listAllSObjectsTool = tool({
  name: 'list_all_sobjects',
  description: 'List all Salesforce objects',
  parameters: z.object({}),
  execute: async (_, _) => {
    console.log(chalk.yellow('Listing all Salesforce objects...'));
    const response = await listAllSObjects();
    return JSON.stringify(response, null, 2);
  },
  errorFunction: (_, error) => {
    return `Error listing Salesforce objects: ${error.message}`;
  }
});

const describeSObjectTool = tool({
  name: 'describe_sobject',
  description: 'Describe a Salesforce object',
  parameters: z.object({
    objectName: z.string(),
  }),
  strict: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Describing Salesforce object: `), chalk.green(params.objectName));
    const response = await describeSObject(params.objectName);
    return JSON.stringify(response, null, 2);
  },
  errorFunction: (_, error) => {
    return `Error describing Salesforce object: ${error.message}`;
  }
});

const soqlQueryTool = tool({
  name: 'soql_query',
  description: 'Execute a SOQL query',
  parameters: z.object({
    query: z.string(),
  }),
  strict: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Executing SOQL query: `), chalk.green(JSON.stringify(params.query)));
    const response = await soqlQuery(params.query);
    return JSON.stringify(response, null, 2);
  },
  errorFunction: (_, error) => {
    return `Error executing SOQL query: ${error.message}`;
  }
});

const queryAgent = new Agent({
  name: 'Query Agent',
  model: 'gpt-4.1-mini',
  instructions:
    'You can query all Salesforce objects and their metadata using the provided tools.\n\
    Before querying data from a specific object always retrieve its metadata first. \n\
    During query move nulls to the end unless specified otherwise by user. \n\
    Limit the number of records returned to 10 unless specified otherwise by user.',
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2 },
});

export { queryAgent };