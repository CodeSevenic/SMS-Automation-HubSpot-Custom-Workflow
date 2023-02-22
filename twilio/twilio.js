// Load the axios library for sending HTTP request to the Twilio API
const axios = require('axios');

exports.main = async (event, callback) => {
  console.log('PROP: ', event.object.properties);
  console.log('Message: ', event.inputFields.staticInput);

  // const obj = {
  //   callbackId: 'ap-2896934-490636100887-7-0',
  //   origin: {
  //     portalId: 2896934,
  //     actionDefinitionId: 31040352,
  //     actionDefinitionVersion: 1,
  //     extensionDefinitionId: 31040352,
  //     extensionDefinitionVersionId: 1,
  //   },
  //   context: {
  //     source: 'WORKFLOWS',
  //     workflowId: 332765965,
  //   },
  //   object: {
  //     objectId: 133801,
  //     propertyValues: {
  //       firstname: {
  //         name: 'firstname',
  //         value: 'Sibusiso',
  //         timestamp: 1676834955766,
  //         sourceId: 'userId:48179127',
  //         source: 'CRM_UI',
  //         sourceVid: [],
  //         requestId: 'cf4f78d9-a85d-4bee-8a09-a91f7d78e631',
  //         updatedByUserId: 48179127,
  //         useTimestampAsPersistenceTimestamp: true,
  //       },
  //       phone: {
  //         name: 'phone',
  //         value: '+27835014072',
  //         timestamp: 1676834955766,
  //         sourceId: 'userId:48179127',
  //         source: 'CRM_UI',
  //         sourceVid: [],
  //         requestId: 'cf4f78d9-a85d-4bee-8a09-a91f7d78e631',
  //         updatedByUserId: 48179127,
  //         useTimestampAsPersistenceTimestamp: true,
  //       },
  //       email: {
  //         name: 'email',
  //         value: 'sibusiso@mo.agency',
  //         timestamp: 1676834955835,
  //         sourceId: 'userId:48179127',
  //         source: 'CRM_UI',
  //         sourceVid: [],
  //         requestId: 'cf4f78d9-a85d-4bee-8a09-a91f7d78e631',
  //         updatedByUserId: 48179127,
  //         useTimestampAsPersistenceTimestamp: true,
  //       },
  //     },
  //     properties: {
  //       firstname: 'Sibusiso',
  //       phone: '+27835014072',
  //       email: 'sibusiso@mo.agency',
  //     },
  //     objectType: 'CONTACT',
  //   },
  //   fields: {
  //     staticInput: 'Hello World Sibusiso',
  //   },
  //   inputFields: {
  //     staticInput: 'Hello World Sibusiso',
  //   },
  // };
};
