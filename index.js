require('dotenv').config();
const express = require('express');
const session = require('express-session');
const opn = require('open');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 8000;
const { main } = require('./twilio/twilio');
const {
  register,
  attemptLogin,
  hubspotActions,
  logout,
  oAuthCallback,
} = require('./controllers/auth');
const { install } = require('./controllers/hubspot');

// app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Use a session to keep track of client ID
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

//================================//
//   Running the OAuth 2.0 Flow   //
//================================//

// Step 1

// Redirect the user from the installation page to
// the authorization URL
app.get('/install', install);

// Step 2
// The user is prompted to give the app access to the requested
// resources. This is all done by HubSpot, so no work is necessary
// on the app's end

// Step 3
// Receive the authorization code from the OAuth 2.0 Server,
// and process it based on the query parameters that are passed
app.get('/oauth-callback', oAuthCallback);

//User Registration
app.post('/register', register);
app.get('/register', register);

//User Login logic
app.get('/', hubspotActions);
app.post('/', attemptLogin);
app.post('/logout', logout);

app.use(
  cors({
    origin: '*',
  })
);

// Twilio message sender when receiving webhook from the HubSpot Custom Action
app.post('/sms-automation-app', main);

app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

app.listen(port, () => console.log(`=== Starting your app on http://localhost:${port} ===`));

opn(`http://localhost:${port}`);
