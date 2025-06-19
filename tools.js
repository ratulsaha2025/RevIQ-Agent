const tools = [
  {
    type: "function",
    function: {
      name: "listAllSObjects",
      description: "Get the list of all Salesforce objects",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "describeSObject",
      description: "Get the metadata for a specific Salesforce object",
      parameters: {
        type: "object",
        properties: {
          objectName: {
            type: "string",
          }
        },
        required: ["objectName"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "soqlQuery",
      description: "Execute a SOQL query",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
          },
        },
        required: ["query"],
      },
    }
  }
];

export default tools;