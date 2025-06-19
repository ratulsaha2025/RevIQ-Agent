import OpenAI from "openai";
import dotenv from 'dotenv';
import chalk from 'chalk';

import tools from "./tools.js";
import {
  listAllSObjects,
  describeSObject,
  soqlQuery
} from "./salesforce.js";

dotenv.config();

const createOpenAIInstance = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: false,
  });
}

const agent = async (openai, userInput, ws) => {
  const availableTools = {
    listAllSObjects,
    describeSObject,
    soqlQuery
  };

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
    {
      role: "system",
      content: `You can query all Salesforce objects and their metadata using the provided functions. Use these functions to retrieve object metadata and ensure that the query is valid and accurate`,
    },
  ];

  messages.push({
    role: "user",
    content: userInput,
  });

  for (let i = 0; i < 10; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
      tools: tools,
    });

    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name;
      const functionToCall = availableTools[functionName];
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs);
      const functionResponse = await functionToCall.apply(
        null,
        functionArgsArr
      );

      const log = chalk.red(`[${i + 1}] = `) +
        chalk.yellow(`${functionName} =`) +
        chalk.green(`${JSON.stringify(functionArgs)}`);
      console.log(log);
      ws.send(`[${i + 1}] = ${functionName} = ${JSON.stringify(functionArgs)}`);

      messages.push({
        role: "function",
        name: functionName,
        content: `The result of the last function was this: ${JSON.stringify(
          functionResponse
        )}`,
      });
    } else if (finish_reason === "stop") {
      messages.push(message);
      return message.content;
    }
  }
  return "\nThe maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

export {
  agent,
  createOpenAIInstance
};