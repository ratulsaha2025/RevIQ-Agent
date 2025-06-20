import { Agent } from '@openai/agents';
import { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool, updateRecordTool } from '../tools/salesforce_tools.js';

const salesforceAgent = new Agent({
  name: 'Salesforce Agent',
  model: 'gpt-4.1-mini',
  instructions: [
    'You can query Salesforce data using the provided tools.',
    'Before querying data from a specific object always retrieve its metadata first.',
    'During query move nulls to the end unless specified otherwise by user.',
    'Limit the number of records returned to 10 unless specified otherwise by user.',
    'You can update Salesforce records using the provided tools.',
    'Before updating, ensure you have the correct object name and record ID.',
    'The updated fields should be provided as a JSON string.'
  ].join('\n'),
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool, updateRecordTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { salesforceAgent };