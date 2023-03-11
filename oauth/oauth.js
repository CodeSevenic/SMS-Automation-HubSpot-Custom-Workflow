require('dotenv').config();
const request = require('request-promise-native');
const NodeCache = require('node-cache');
const {
  addUserToBD,
  updateUserAccessDetails,
  getUserFromDB,
  getSpecificUser,
} = require('../firebase/firebase');

let refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

const port = process.env.PORT || 8000;

//===========================================================================//
//  HUBSPOT APP CONFIGURATION
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Scopes for this app will default to `crm.objects.contacts.read`
// To request others, set the SCOPE environment variable instead
// let SCOPES = ['crm.objects.contacts.read'];
if (process.env.SCOPE) {
  SCOPES = process.env.SCOPE.split(/ |, ?|%20/).join(' ');
}

// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `http://localhost:${port}/oauth-callback`;

//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

exports.exchangeForTokens = async (userId, exchangeProof, registerData, loggedInData = {}) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof,
    });
    // Usually, this token data should be persisted in a database and associated with
    // a user identity.

    const tokens = JSON.parse(responseBody);
    // refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 0.75));

    console.log('       > Received an access token and refresh token');

    // store user with token to database
    if (registerData?.username && registerData?.password && registerData?.email) {
      addUserToBD(
        registerData,
        tokens.refresh_token,
        tokens.access_token,
        Math.round(tokens.expires_in * 0.75)
      );
    }

    const loggedInUsername = loggedInData?.username;
    const loggedInPassword = loggedInData?.password;

    // Update user accessToken details
    if (loggedInUsername && loggedInPassword) {
      updateUserAccessDetails(
        loggedInUsername,
        loggedInPassword,
        userId,
        tokens.access_token,
        Math.round(tokens.expires_in * 0.75)
      );
    }
    return tokens.access_token;
  } catch (e) {
    console.error(`       > Error exchanging ${exchangeProof.grant_type} for access token`);
    return JSON.parse(e.response.body);
  }
};

const refreshAccessToken = async (userId, registerData, refreshToken, loggedInData) => {
  try {
    const refreshTokenProof = {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: refreshToken,
    };
    return await this.exchangeForTokens(userId, refreshTokenProof, registerData, loggedInData);
  } catch (e) {
    console.log('Error happened on refreshAccessToken function');
  }
};

exports.getAccessToken = async (userId, registerData, refreshToken, loggedInData) => {
  try {
    let user = await getSpecificUser(loggedInData.username, loggedInData.password);
    // If the access token has expired, retrieve
    // a new one using the refresh token
    if (user[0].access_token) {
      console.log('Refreshing expired access token');
      await refreshAccessToken(userId, registerData, refreshToken, loggedInData);
    }

    console.log('EXCESS TOKEN: ', user[0].access_token, '+++++', accessTokenCache.get(userId));
    return accessTokenCache.get(userId) || user[0].access_token;
  } catch (e) {
    console.log('Error happened on getAccessToken function');
  }
};

exports.isAuthorized = (refreshToken) => {
  console.log('isAuthorized refreshToken: ', refreshToken);
  // return refreshTokenStore[userId] ? true : false;
  return refreshToken ? true : false;
};
