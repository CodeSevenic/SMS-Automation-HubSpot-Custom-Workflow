const hubspot = require('@hubspot/api-client');
const { validationResult } = require('express-validator');
const { resContacts } = require('../api-queries/huspots-queries');
const { getUserFromDB, updateUserId } = require('../firebase/firebase');
const { isAuthorized, getAccessToken } = require('../oauth/oauth');
const { oAuthCallbackFunction } = require('./hubspot');

let hubspotClient;
let registerData;
let loggedInData;
let userLoggedIn = false;

exports.register = (req, res) => {
  if (req.method === 'GET') {
    // Render registration form
    res.send(/*template*/ `
      <h1>Registration Form</h1>
      <form method="POST" action="/register">
        <label>
          Username:
          <input type="text" name="username">
        </label>
        <br>
        <label>
          Email:
          <input type="email" name="email">
        </label>
        <br>
        <label>
          Password:
          <input type="password" name="password">
        </label>
        <br>
        <button type="submit">Register</button>
      </form>
    `);
  } else if (req.method === 'POST') {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // If there are no validation errors, save user data to database or perform other actions
    const { username, email, password } = req.body;
    if (username && email && password) {
      console.log(username, password, email);
      //Set new registered user information
      registerData = {
        username,
        password,
        email,
      };
      console.log('Register Data: ', registerData);
      // TODO: save user data to database or perform other actions
      res.write(`<a href="/install"><h3>Install the app</h3></a>`);
      // res.redirect('/');
    } else {
      res.status(400).send('Missing required fields');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

let dbData = [];

const getDbData = async () => {
  dbData = await getUserFromDB();
};
getDbData();

exports.retrieveLogInUser = (input) => {
  const matches = dbData.filter(
    (user) => user.username === input.username && user.password === input.password
  );
  return matches[0];
};

exports.attemptLogin = async (req, res) => {
  const user = await this.retrieveLogInUser(req.body);
  console.log('Session ID: ', req.sessionID);
  console.log(user);

  let username = req.body.username;
  let password = req.body.password;

  if (username === user?.username && password === user?.password) {
    console.log(req.body);
    console.log('User details match registered user 🙂😎');
    userLoggedIn = true;
    loggedInData = user;

    // If successful login
    const authorized = isAuthorized(loggedInData.refresh_token);

    if (authorized) {
      const accessToken = await getAccessToken(
        req.sessionID,
        registerData,
        loggedInData?.refresh_token,
        loggedInData
      );
      const contacts = await resContacts(accessToken);
      res.status(200).json({
        message: 'LoggedIn Successfully',
        contacts: contacts,
        userLoggedIn: userLoggedIn,
      });
      // recentUpdatedProperties(accessToken);
      // createCustomWorkflow();
      // getAllCustomActions();
    } else {
      res.write(`<a href="/install"><h3>Install the app</h3></a>`);
    }

    // res.status(200).json({
    //   message: 'LoggedIn Successfully',
    // });
    // res.redirect('/');
  } else {
    console.log('User details not registered!');
    console.log('User: ', req.body);
    userLoggedIn = false;
    res.status(401).json({
      message: 'Invalid credentials',
    });
  }
};

exports.logout = (req, res) => {
  userLoggedIn = false;
  console.log('Try Logout');
  loggedInData = {};
  res.redirect('/');
};

// ============= HubSpot Connection =========== //

exports.oAuthCallback = async (req, res) => {
  await oAuthCallbackFunction(req, res, registerData);
  getDbData();
};
