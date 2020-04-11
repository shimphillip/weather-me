require('dotenv').config();
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessagePlease = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?zip=78754&APPID=${process.env.OPEN_WEATHER_MAP_API}`
      )
      .then((data) => {
        console.log(data);
        console.log(data.data);
        return res.status(200).send(data.data);
      })
      .catch((error) => res.send(error));
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
