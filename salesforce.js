import jsforce from "jsforce";
import dotenv from 'dotenv';

dotenv.config();

/*
const conn = new jsforce.Connection({
  instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
  serverUrl: process.env.SALESFORCE_SERVER_URL,
  sessionId: process.env.SALESFORCE_SESSION_ID
});
*/

const conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl: process.env.SALESFORCE_INSTANCE_URL
});
await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD_TOKEN)

const listAllSObjects = async () => {
  const metadata = await conn.describeGlobal();
  return metadata.sobjects.filter(sObject => sObject.queryable).map(sObject => {
    return {
      name: sObject.name,
      label: sObject.label,
    }
  });
}

const describeSObject = async (objectName) => {
  const metadata = await conn.sobject(objectName).describe();
  return metadata.fields.map(field => {
    return {
      name: field.name,
      type: field.type,
      label: field.label,
      picklistValues: field.picklistValues.filter(x => x.active).map(x => { return { value: x.value, label: x.label } })
    }
  });
}

const soqlQuery = async (query) => {
  try {
    return await conn.query(query);
  } catch (error) {
    return error;
  }
}

export {
  listAllSObjects,
  describeSObject,
  soqlQuery
}