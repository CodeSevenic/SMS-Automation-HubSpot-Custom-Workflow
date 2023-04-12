require('dotenv').config();
const hubspot = require('@hubspot/api-client');
const axios = require('axios');

const hubspotClient = new hubspot.Client({ developerApiKey: process.env.DEV_API });

const appId = 1454472;

const developerApiKey = process.env.DEV_API;

const url = `https://api.hubspot.com/automation/v4/actions/${appId}?hapikey=${developerApiKey}`;

const data = {
  appId,
  actionUrl: 'https://realsuccess-7905.twil.io/sms-sender',
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
      actionName: 'Twilio SMS',
      actionDescription: 'Send SMSs via Twilio',
      appDisplayName: 'Twilio SMS',
      actionCardContent: 'Twilio SMS',
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

const dataUpdate = {
  appId,
  actionUrl: 'https://realsuccess-7905.twil.io/sms-sender',
  published: false,
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
      actionName: 'SMS Notifications',
      actionDescription: 'Send SMSs via Twilio',
      appDisplayName: 'SMS Notifications',
      actionCardContent: 'SMS Notifications',
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

exports.getAllCustomActions = async () => {
  try {
    const url = `https://api.hubspot.com/automation/v4/actions/${appId}?hapikey=${developerApiKey}/?archived=false`;

    const response = await axios.get(url);
    const workflowActions = response.data.results;

    console.log(workflowActions);

    return workflowActions;
  } catch (err) {
    console.log('Hello World: ', err);
  }
};

exports.archiveAction = async (actionId, appId, api) => {
  try {
    const url = `https://api.hubspot.com/automation/v4/actions/${appId}/${actionId}?hapikey=${api}`;
    const res = await axios.delete(url);
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

exports.updateAction = async (appId, actionId, apiKey) => {
  try {
    const url = `https://api.hubspot.com/automation/v4/actions/${appId}/${actionId}?hapikey=${apiKey}`;
    const res = await axios.patch(url, data);
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};
exports.updateOneAction = async (appId, actionId, apiKey) => {
  try {
    const url = `https://api.hubspot.com/automation/v4/actions/${appId}/${actionId}?hapikey=${apiKey}`;
    const res = await axios.patch(url, dataUpdate);
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};

// ChatGPT code:
/*
const axios = require('axios');
const developerApiKey = 'YOUR_DEVELOPER_API_KEY';
const appId = 'YOUR_APP_ID';

const url = `https://api.hubspot.com/automation/v4/actions/${appId}?hapikey=${developerApiKey}`;

const data = {
  appId,
  actionUrl: 'https://your-action-url.com',
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
      label: 'SMS text',
    },
    {
      typeDefinition: {
        name: 'optionsInput',
        type: 'enumeration',
        fieldType: 'select',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ],
      },
      supportedValueTypes: ['STATIC_VALUE'],
      isRequired: true,
      label: 'Notification type',
    },
  ],
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
        optionsInput: 'Notification type',
      },
      actionName: 'SMS Notifications',
      actionDescription: 'Send SMS notifications to HubSpot contacts',
      appDisplayName: 'SMS Automation',
      actionCardContent: 'SMS notifications',
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

axios.post(url, data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
*/
