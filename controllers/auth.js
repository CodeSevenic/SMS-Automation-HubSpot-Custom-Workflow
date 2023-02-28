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
