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
const { isAuthorized, getAccessToken } = require('../oauth/oauth');

//=======================================================//
//   Displaying test information info to the browser     //
//=======================================================//

const displayContactName = (res, contact) => {
  for (val of contact) {
    res.write(`<p>Contact name: ${val.properties.firstname} ${val.properties.lastname}</p>`);
  }
};

exports.renderView = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2>SMS Automation</h2>`);
  let authorized = await isAuthorized(req.sessionID);
  console.log(authorized);
  if (authorized) {
    const accessToken = await getAccessToken(req.sessionID);
    hubspotClient = new hubspot.Client({ accessToken: `${accessToken}` });
    const contact = await resContacts(accessToken);
    displayContactName(res, contact);
    // recentUpdatedProperties(accessToken);
    // createCustomWorkflow();
    // getAllCustomActions();
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
};
