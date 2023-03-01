const { async } = require('@firebase/util');
const { validationResult } = require('express-validator');
const { resContacts } = require('../api-queries/huspots-queries');
const { getUserFromDB } = require('../firebase/firebase');
const { isAuthorized, getAccessToken } = require('../oauth/oauth');

let userData;
let userLoggedIn = false;

exports.registerForm = (req, res) => {
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
};

exports.register = (req, res) => {
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
    userData = {
      username,
      password,
      email,
    };
    res.redirect('/login');
  }
  // TODO: save user data to database or perform other actions
  res.status(200).send();
  // res.send(`Registration successful. Username: ${username}, Email: ${email}`);
};

let dbData = [];

const getDbData = async () => {
  dbData = await getUserFromDB();
};
getDbData();

exports.retrieveUserFromDB = (input) => {
  const matches = dbData.filter(
    (user) => user.username === input.username && user.password === input.password
  );
  return matches[0];
};

exports.attemptLogin = async (req, res) => {
  const user = await this.retrieveUserFromDB(req.body);
  console.log(user);
  let username = req.body.username;
  let password = req.body.password;

  if (username === user?.username && password === user?.password) {
    console.log('User details match registered user 🙂😎');
    userLoggedIn = true;
  } else {
    console.log('User details not registered!');
    userLoggedIn = false;
  }
};

exports.welcomePage = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  let authorized = await isAuthorized(req.sessionID);
  console.log(authorized);
  if (authorized) {
    res.write(`<h2>SMS Automation</h2>`);
    console.log('Other hello: ', userData);
    const accessToken = await getAccessToken(req.sessionID, userData);
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

exports.login = async (req, res) => {
  res.send(/*template*/ `
  <html>
    <body>
      <form method="POST" action="/">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br>
        <button type="submit">Login</button>
      </form>
    </body>
  </html>
  `);
};

exports.login = async (req, res) => {
  // Check if the user is already logged in
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  // Check if the user submitted the login form
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (isValidUser(username, password)) {
      // Store the user in the session
      req.session.user = username;

      // Redirect to the dashboard
      return res.redirect('/dashboard');
    } else {
      // If the user is not valid, show an error message
      return res.send(/*template*/ `
        <html>
          <body>
            <h2>Invalid username or password</h2>
            <form method="POST" action="/">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username"><br>
              <label for="password">Password:</label>
              <input type="password" id="password" name="password"><br>
              <button type="submit">Login</button>
            </form>
            <br>
            <a href="/register">Register</a>
          </body>
        </html>
      `);
    }
  } else {
    // If the user has not submitted the login form, show the login page
    return res.send(/*template*/ `
      <html>
        <body>
          <form method="POST" action="/">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password"><br>
            <button type="submit">Login</button>
          </form>
          <br>
          <a href="/register">Register</a>
        </body>
      </html>
    `);
  }
};

function isValidUser(username, password) {
  // Check if the user is registered
  if (isRegisteredUser(username)) {
    // Check if the password is correct
    return password === users[username].password;
  } else {
    // If the user is not registered, return false
    return false;
  }
}

function isRegisteredUser(username) {
  return users.hasOwnProperty(username);
}

exports.renderView = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2>SMS Automation</h2>`);
  let authorized = await isAuthorized(req.sessionID);
  console.log(authorized);
  if (authorized) {
    console.log('Other hello: ', userData);
    const accessToken = await getAccessToken(req.sessionID, userData);
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
