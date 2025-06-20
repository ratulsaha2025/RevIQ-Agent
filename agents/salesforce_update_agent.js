import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import chalk from 'chalk';

import { updateRecord } from '../salesforce.js';

/**
 * Update Salesforce Record Tool
 * This tool updates a specific Salesforce record.
 */
const updateRecordTool = tool({
  name: 'update_record',
  description: 'Update a Salesforce record. This tool updates a specific Salesforce record.',
  parameters: z.object({
    objectName: z.string(),
    recordId: z.string(),
    updatedFields: z.record(z.string(), z.any()),
  }),
  strict: true,
  needsApproval: true,
  execute: async (params, _) => {
    console.log(chalk.yellow(`Updating Salesforce record: `), chalk.green(params.recordId));
    const response = await updateRecord(params.objectName, params.recordId, params.updatedFields);
    return JSON.stringify(response);
  },
  errorFunction: (_, error) => {
    return `Error updating Salesforce record: ${error.message}`;
  }
});

const updateAgent = new Agent({
  name: 'Update Agent',
  model: 'gpt-4.1-mini',
  instructions:
    'You can update Salesforce records using the provided tools.',
  tools: [updateRecordTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { updateAgent };