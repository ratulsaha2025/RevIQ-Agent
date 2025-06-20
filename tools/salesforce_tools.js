import chalk from 'chalk';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { listAllSObjects, describeSObject, soqlQuery, soslQuery, updateRecord } from '../integrations/salesforce.js';

/**
 * List All Salesforce Objects Tool
 * This tool lists all Salesforce objects that are queryable, createable, updateable, and deletable.
 */
const listAllSObjectsTool = tool({
  name: 'list_all_sobjects',
  description: 'List all Salesforce objects. This tool retrieves all Salesforce objects that are queryable, createable, updateable, and deletable.',
  parameters: z.object({}),
  execute: async () => {
    console.log(chalk.yellow('Listing all Salesforce objects...'));
    const response = await listAllSObjects();
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error listing Salesforce objects: ${error.message}`;
  }
});

/**
 * Describe Salesforce Object Tool
 * This tool describes a specific Salesforce object and its fields.
 */
const describeSObjectTool = tool({
  name: 'describe_sobject',
  description: 'Describe a Salesforce object. This tool retrieves metadata for a specific Salesforce object.',
  parameters: z.object({
    objectName: z.string(),
  }),
  strict: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Describing Salesforce object: `), chalk.green(params.objectName));
    const response = await describeSObject(params.objectName);
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error describing Salesforce object: ${error.message}`;
  }
});

/**
 * SOQL Query Tool
 * This tool executes a SOQL query against Salesforce.
 */
const soqlQueryTool = tool({
  name: 'soql_query',
  description: 'Execute a SOQL query. This tool executes a SOQL query against single Salesforce object.',
  parameters: z.object({
    query: z.string(),
  }),
  strict: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Executing SOQL query: `), chalk.green(JSON.stringify(params.query)));
    const response = await soqlQuery(params.query);
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error executing SOQL query: ${error.message}`;
  }
});

/**
 * SOSL Query Tool
 * This tool executes a SOSL query against Salesforce.
 */
const soslQueryTool = tool({
  name: 'sosl_query',
  description: 'Execute a SOSL query. This tool can search for specific terms across multiple objects.',
  parameters: z.object({
    query: z.string(),
  }),
  strict: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Executing SOSL query: `), chalk.green(JSON.stringify(params.query)));
    const response = await soslQuery(params.query);
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error executing SOSL query: ${error.message}`;
  },
});

/**
 * Update Salesforce Record Tool
 * This tool updates a specific Salesforce record.
 */
const updateRecordTool = tool({
  name: 'update_record',
  description: 'Update a Salesforce record. This tool updates a specific Salesforce record. Provide a valid object name, record ID, and fields stringified JSON to update.',
  parameters: z.object({
    objectName: z.string(),
    recordId: z.string(),
    updatedFields: z.string(),
  }),
  strict: true,
  needsApproval: false,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Updating Salesforce record: `), chalk.green(params.recordId));
    const response = await updateRecord(params.objectName, params.recordId, JSON.parse(params.updatedFields));
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error updating Salesforce record: ${error.message}`;
  }
});

export { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool, updateRecordTool };