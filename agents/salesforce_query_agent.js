import { Agent } from '@openai/agents';
import { listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool } from '../tools/salesforce_tools.js';

const salesforceQueryAgent = new Agent({
  name: 'Salesforce Query Agent',
  model: 'gpt-4.1-mini',
  instructions:
    'You can query all Salesforce objects and their metadata using the provided tools.\n\
    Before querying data from a specific object always retrieve its metadata first. \n\
    During query move nulls to the end unless specified otherwise by user. \n\
    Limit the number of records returned to 10 unless specified otherwise by user.',
  tools: [listAllSObjectsTool, describeSObjectTool, soqlQueryTool, soslQueryTool],
  modelSettings: { toolChoice: 'required', temperature: 0.2, topP: 0.2 },
});

export { salesforceQueryAgent };