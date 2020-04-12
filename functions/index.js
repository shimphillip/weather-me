require('dotenv').config();
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();

// auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  // background trigger returns a value/promise
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    phoneNumber: '',
    zipcode: '',
    time: '',
  });
});

// auth trigger (delete user)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

exports.getUserInfo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add requests'
    );
  }

  const user = admin.firestore().collection('users').doc(context.auth.uid);

  const doc = await user.get();

  return doc.data();
});

exports.sendMessage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?zip=78754&APPID=${process.env.OPEN_WEATHER_MAP_API}`
      );

      return res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // const client = require('twilio')(
  //   process.env.ACCOUNT_SID,
  //   process.env.AUTH_TOKEN
  // );

  // client.messages
  //   .create({
  //     body: 'All in the game, yo',
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: '+15125956354',
  //   })
  //   .then((message) => {
  //     console.log(message.sid);
  //     return response.send(message.sid);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return response.send(error);
  //   });
});
