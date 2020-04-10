require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessagePlease = functions.https.onRequest((request, response) => {
  const client = require('twilio')(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );

  client.messages
    .create({
      body: 'All in the game, yo',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+15125956354',
    })
    .then((message) => {
      console.log(message.sid);
      return response.send(message.sid);
    })
    .catch((error) => {
      console.log(error);
      return response.send(error);
    });
});
