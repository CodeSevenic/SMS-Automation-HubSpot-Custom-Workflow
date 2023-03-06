const hubspot = require('@hubspot/api-client');
const cron = require('node-cron');
let hubspotClient;

const util = require('util');
const { createCustomWorkflow, getAllCustomActions } = require('../api-queries/custom-actions');
const {
  resContacts,
  apiQueryAndOperations,
  recentUpdatedProperties,
} = require('../api-queries/huspots-queries');
const { userExist } = require('../firebase/firebase');
const { isAuthorized, getAccessToken } = require('../oauth/oauth');

//=======================================================//
//   Displaying test information info to the browser     //
//=======================================================//
