import { Agent } from '@openai/agents';
import { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool } from '../tools/salesforce_tools.js';

const salesforceQueryAgent = new Agent({
  name: 'Salesforce Query Agent',
  model: 'gpt-4.1-mini',
  instructions: [
    'You can query Salesforce data using the provided tools.',
    'Before querying data from a specific object always retrieve its metadata first.',
    'During query move nulls to the end unless specified otherwise by user.',
    'Limit the number of records returned to 10 unless specified otherwise by user.'
  ].join('\n'),
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { salesforceQueryAgent };