const { validationResult } = require('express-validator');

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

let userData;

exports.login = (req, res) => {
  const { username, password } = req.body;
  userData = {
    username: username,
    password: password,
  };

  console.log(userData);
  // Find user by username and password
  // const user = users.find((u) => u.username === username && u.password === password);

  // if (user) {
  //   // Successful login
  //   res.send('Welcome ' + username + '!');
  // } else {
  //   // Invalid login
  //   res.status(401).send('Invalid username or password');
  // }
  if (username && password) {
    res.redirect('/view');
  }

  res.status(200).send();
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
