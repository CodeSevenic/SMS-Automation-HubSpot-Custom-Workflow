const { validationResult } = require('express-validator');

let userData;

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

  // TODO: save user data to database or perform other actions
  res.send(`Registration successful. Username: ${username}, Email: ${email}`);
};

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
};

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
