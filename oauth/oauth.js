require('dotenv').config();
const request = require('request-promise-native');
const NodeCache = require('node-cache');
const { persistToken, getTokenIfExist, addUserToBD } = require('../firebase/firebase');

let refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

const port = process.env.PORT || 8000;

//===========================================================================//
//  HUBSPOT APP CONFIGURATION
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Scopes for this app will default to `crm.objects.contacts.read`
// To request others, set the SCOPE environment variable instead
let SCOPES = ['crm.objects.contacts.read'];
if (process.env.SCOPE) {
  SCOPES = process.env.SCOPE.split(/ |, ?|%20/).join(' ');
}

// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `http://localhost:${port}/oauth-callback`;

//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

exports.exchangeForTokens = async (userId, exchangeProof, user) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof,
    });
    // Usually, this token data should be persisted in a database and associated with
    // a user identity.
    const tokens = JSON.parse(responseBody);
    refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 0.75));

    console.log('       > Received an access token and refresh token');
    // persistToken(refreshTokenStore[userId]);

    // store user with token to database
    if (user.username && user.password && user.email) {
      addUserToBD(user, refreshTokenStore[userId]);
    }
    return tokens.access_token;
  } catch (e) {
    console.error(`       > Error exchanging ${exchangeProof.grant_type} for access token`);
    return JSON.parse(e.response.body);
  }
};

const refreshAccessToken = async (userId, user) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId] || (await getTokenIfExist()),
  };

  return await this.exchangeForTokens(userId, refreshTokenProof, user);
};

exports.getAccessToken = async (userId, user) => {
  console.log('Does it get here? ', user);
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId, user);
  }
  return accessTokenCache.get(userId);
};

exports.isAuthorized = async (userId) => {
  let refreshToken = await getTokenIfExist();
  console.log('isAuthorized refreshToken : ', refreshToken);
  // return refreshTokenStore[userId] ? true : false;
  return refreshToken ? true : false;
};

//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//
/* 
exports.exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof,
    });
    // Usually, this token data should be persisted in a database and associated with
    // a user identity.
    const tokens = JSON.parse(responseBody);
    refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 0.75));

    console.log('       > Received an access token and refresh token');
    return tokens.access_token;
  } catch (e) {
    console.error(`       > Error exchanging ${exchangeProof.grant_type} for access token`);
    return JSON.parse(e.response.body);
  }
};

exports.refreshAccessToken = async (userId) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId],
  };
  return await exchangeForTokens(userId, refreshTokenProof);
};

exports.getAccessToken = async (userId) => {
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

exports.isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};

if (this.isAuthorized) {
  refreshTokenStore = {};
}

*/
