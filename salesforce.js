import jsforce from 'jsforce';
import dotenv from 'dotenv';

dotenv.config();

const conn = new jsforce.Connection({
  loginUrl: process.env.SALESFORCE_INSTANCE_URL
});
await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD_TOKEN);

const listAllSObjects = async () => {
  const metadata = await conn.describeGlobal();
  return metadata.sobjects.filter(sObject => sObject.queryable && sObject.createable && sObject.updateable && sObject.deletable).map(sObject => {
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
  return await conn.query(query);
}

const soslQuery = async (query) => {
  const res = await conn.search(query);
  return res.searchRecords;
}

const updateRecord = async (objectName, recordId, updatedFields) => {
  return await conn.sobject(objectName).update({
    Id: recordId,
    ...updatedFields
  });
}

export {
  listAllSObjects,
  describeSObject,
  soqlQuery,
  soslQuery,
  updateRecord
}