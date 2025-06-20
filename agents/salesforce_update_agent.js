import { Agent } from '@openai/agents';
import { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, updateRecordTool } from '../tools/salesforce_tools.js';

const salesforceUpdateAgent = new Agent({
  name: 'Salesforce Update Agent',
  model: 'gpt-4.1-mini',
  instructions:
    'You can update Salesforce records using the provided tools.',
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool, updateRecordTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { salesforceUpdateAgent };