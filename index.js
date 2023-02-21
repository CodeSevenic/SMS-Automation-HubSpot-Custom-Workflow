require('dotenv').config();
const express = require('express');
const session = require('express-session');
const http = require('http');
const cron = require('node-cron');
const opn = require('open');
const app = express();
const axios = require('axios');
const cors = require('cors');

const port = process.env.PORT || 8000;
const { renderView } = require('./views/test.view');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error('Missing CLIENT_ID or CLIENT_SECRET environment variable.');
}
// Use a session to keep track of client ID
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', renderView);

app.use(
  cors({
    origin: '*',
  })
);

app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

app.listen(port, () => console.log(`=== Starting your app on http://localhost:${port} ===`));

opn(`http://localhost:${port}`);
