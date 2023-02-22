require('dotenv').config();
// Load the axios library for sending HTTP request to the Twilio API
const axios = require('axios');

exports.main = async (event, callback) => {
  console.log('Hello World Function just ran 😁');
  // Load environment variables that are stored as Secrets in Hubspot
  // These are required for the Twilio API
  const accountSID = process.env.AccountSID;
  const authToken = process.env.AuthToken;
  const fromPhoneNumber = process.env.TwilioSenderID;

  // Evaluate the contact's mobilePhone and phone fields to determine the toPhoneNumber
  // Use the mobilePhone if it exists, otherwise use phone
  // TODO: This would be a good place to use Lookup to verify the phone is a mobile number
  const name = event.body.object.properties.firstname ? event.body.object.properties.firstname : '';
  const email = event.body.object.properties.email ? event.body.object.properties.email : '';
  const phone = event.body.object.properties.phone ? event.body.object.properties.phone : '';
  const mobilePhone = event.body.object.properties.mobilephone
    ? event.body.object.properties.mobilephone
    : '';
  const toPhoneNumber = mobilePhone ? mobilePhone : phone;

  console.log(
    `Phone: ${toPhoneNumber} \n fromPhoneNumber: ${fromPhoneNumber} \n AccountSid: ${accountSID} \n AuthToken: ${authToken}`
  );

  // Define the template for the message body. It can include dynamic {{variables}} from fields in Hubspot
  // For each variable, make sure you add the corresponding property to the workflow during setup
  const template = event.body.inputFields.staticInput ? event.body.inputFields.staticInput : '';

  // const template =
  //   'Hi {{firstname}}. This is a Twilio SMS message sent from a Hubspot Automation Workflow.';

  // Create message body by replacing the template {{variables}} with the input fields of the same key
  const inputFields = event.inputFields;
  const body = template.replace(/{{([^}]+)}}/g, (match, key) => {
    return inputFields[key];
  });

  // Define the axios url, params and config headers
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`;
  const params = new URLSearchParams();
  params.append('From', fromPhoneNumber);
  params.append('To', toPhoneNumber);
  params.append('Body', body);
  const config = {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSID}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Send API request to Twilio via Axios
  const response = await axios.post(url, params, config);
  res.status(200).send();
  // callback({
  //   outputFields: {
  //     MessageSid: response.data.sid,
  //     MessageStatus: response.data.status,
  //   },
  // });
  // console.log(response);
};
