import { Agent } from '@openai/agents';
import { salesforceQueryAgent } from './agents/salesforce_query_agent.js';
import { salesforceUpdateAgent } from './agents/salesforce_update_agent.js';

// Use Agent.create method to ensure the finalOutput type considers handoffs
const salesforceAgent = Agent.create({
  name: 'Salesforce Agent',
  instructions: [
    'Help the user with their questions about Salesforce.',
    'If the user tries to query, hand off to the Salesforce Query Agent.',
    'If the user tries to update a record, hand off to the Salesforce Update Agent.',
  ].join('\n'),
  handoffs: [salesforceQueryAgent, salesforceUpdateAgent],
});

export default salesforceAgent;