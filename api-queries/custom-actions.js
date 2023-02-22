require('dotenv').config();
const hubspot = require('@hubspot/api-client');
const axios = require('axios');

const hubspotClient = new hubspot.Client({ developerApiKey: process.env.DEV_API });

const appId = 1454472;

const developerApiKey = process.env.DEV_API;

const url = `https://api.hubspot.com/automation/v4/actions/${appId}?hapikey=${developerApiKey}`;

const data = {
  appId,
  actionUrl: 'https://f116-41-116-7-86.eu.ngrok.io/sms-automation-app',
  published: true,
  objectTypes: ['CONTACT'],
  inputFields: [
    {
      typeDefinition: {
        name: 'staticInput',
        type: 'string',
        fieldType: 'textarea',
      },
      supportedValueTypes: ['STATIC_VALUE'],
      isRequired: true,
    },
    // {
    //   typeDefinition: {
    //     name: 'objectInput',
    //     type: 'string',
    //     fieldType: 'text',
    //   },
    //   supportedValueTypes: ['OBJECT_PROPERTY'],
    //   isRequired: true,
    // },
    // {
    //   typeDefinition: {
    //     name: 'optionsInput',
    //     type: 'enumeration',
    //     fieldType: 'select',
    //     optionsUrl: 'https://webhook.site/94d09471-6f4c-4a7f-bae2-c9a585dd41e0',
    //   },
    //   supportedValueTypes: ['STATIC_VALUE'],
    // },
  ],
  // inputFieldDependencies: [
  //   {
  //     dependencyType: 'SINGLE_FIELD',
  //     dependentFieldNames: ['objectInput'],
  //     controllingFieldName: 'staticInput',
  //   },
  // ],
  outputFields: [
    {
      typeDefinition: {
        name: 'myOutput',
        type: 'string',
        fieldType: 'text',
      },
      supportedValueTypes: ['STATIC_VALUE'],
    },
  ],
  objectRequestOptions: {
    properties: ['email', 'firstname', 'phone', 'mobilephone'],
  },
  labels: {
    en: {
      inputFieldLabels: {
        staticInput: 'SMS text',
        // objectInput: 'Object Property Input',
        // optionsInput: 'External Options Input',
      },
      actionName: 'SMS Notifications II',
      actionDescription: 'Send SMS notifications to HubSpot contacts',
      appDisplayName: 'MO SMS Automation',
      actionCardContent: 'MO SMS notifications',
    },
  },
  functions: [
    {
      functionType: 'POST_ACTION_EXECUTION',
      functionSource:
        'exports.main = (event, callback) => {\r\n  callback({\r\n    outputFields: {\r\n      myOutput: "example output value"\r\n    }\r\n  });\r\n}',
    },
    {
      functionType: 'POST_FETCH_OPTIONS',
      functionSource:
        'exports.main = (event, callback) => {\r\n  callback({\r\n    "options": [{\r\n        "label": "Big Widget",\r\n        "description": "Big Widget",\r\n        "value": "10"\r\n      },\r\n      {\r\n        "label": "Small Widget",\r\n        "description": "Small Widget",\r\n        "value": "1"\r\n      }\r\n    ]\r\n  });\r\n}',
    },
  ],
};

exports.createCustomWorkflow = async () => {
  axios
    .post(url, data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
