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

let userData;

exports.loginPage = (req, res) => {
  res.send(/*template*/ `
  <html>
    <body>
      <form method="POST" action="/login">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br>
        <button type="submit">Login</button>
      </form>
    </body>
  </html>
  `);

  console.log(userData);
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  userData = {
    username: username,
    password: password,
  };

  // Find user by username and password
  // const user = users.find((u) => u.username === username && u.password === password);

  // if (user) {
  //   // Successful login
  //   res.send('Welcome ' + username + '!');
  // } else {
  //   // Invalid login
  //   res.status(401).send('Invalid username or password');
  // }

  console.log(userData);
};

exports.loginUser = async (req, res) => {};

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
