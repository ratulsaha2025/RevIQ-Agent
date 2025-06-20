import { Agent } from '@openai/agents';
import { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, updateRecordTool } from '../tools/salesforce_tools.js';

const salesforceUpdateAgent = new Agent({
  name: 'Salesforce Update Agent',
  model: 'gpt-4.1-mini',
  instructions: [
    'You can update Salesforce records using the provided tools. ',
    'Before updating, ensure you have the correct object name and record ID.',
    'The updated fields should be provided as a JSON string.'
  ].join('\n'),
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool, updateRecordTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { salesforceUpdateAgent };