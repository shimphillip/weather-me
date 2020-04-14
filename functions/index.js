/* eslint-disable callback-return */
/* eslint-disable no-await-in-loop */
require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Background auth trigger
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    phoneNumber: '',
    zipcode: '',
  });
});

// Background auth trigger
exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

// HTTP request
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

// HTTP request. This gets fired when a user clicks on save
exports.storeUserInfo = functions.https.onCall(async (data, context) => {
  const { phoneNumber, zipcode } = data;

  console.log('backend', {
    phoneNumber,
    zipcode,
  });

  const user = admin.firestore().collection('users').doc(context.auth.uid);

  await user.update({
    phoneNumber,
    zipcode,
  });

  const doc = await user.get();
  return doc.data();
});

// scheduled function
exports.scheduledFunctionCrontab = functions.pubsub
  .schedule('55 7 * * *') // fires off alarm at at 7:55AM. Takes about 5 minutes
  .timeZone('America/Chicago') // Defaults to central time
  .onRun(async (context) => {
    const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

    const asyncForEach = async (arr, callback) => {
      for (let i = 0; i < arr.length; i++) {
        await waitFor(2000);
        await callback(arr[i]);
      }
    };

    const sendMessages = async (doc) => {
      const zipcode = doc.zipcode;
      const phoneNumber = doc.phoneNumber;

      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&APPID=${process.env.OPEN_WEATHER_MAP_API}`
      );

      // next 15-18 hours
      const list = data.list.slice(0, 6);

      const formattedList = list.map(({ dt, weather, main }) => {
        const temperature =
          Math.round(((main.feels_like - 273.15) * 9) / 5 + 32) + '°F';

        let icon;

        // https://openweathermap.org/weather-conditions
        switch (weather[0].icon) {
          case '01d':
            icon = '☀';
            break;
          case '01n':
            icon = '🌕';
            break;
          case '02d':
          case '02n':
          case '03d':
          case '03n':
          case '04d':
          case '04n':
            icon = '☁';
            break;
          case '09d':
          case '09n':
          case '10d':
          case '10n':
            icon = '🌧';
            break;
          case '11d':
          case '11n':
            icon = '⛈';
            break;
          case '13d':
          case '13n':
            icon = '❄';
            break;
          case '50d':
          case '50n':
            icon = '🌫';
            break;
          default:
            icon = '';
        }

        return {
          time: moment.unix(dt).utcOffset(-300).format('ha, dddd'),
          weather: icon + weather[0].description,
          temperature,
        };
      });

      const bodyText = formattedList
        .map((obj) => {
          return `${obj.time}\nWeather: ${obj.weather} ${obj.temperature}\n`;
        })
        .join('\n');

      const client = require('twilio')(
        process.env.ACCOUNT_SID,
        process.env.AUTH_TOKEN
      );

      const phoneNumberArr = phoneNumber.split('-');
      const phone = '+1' + phoneNumberArr.join('');

      const message = await client.messages.create({
        body: bodyText,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return message.sid;
    };

    try {
      const snapshot = await admin.firestore().collection('users').get();
      const docs = snapshot.docs.map((doc) => doc.data());

      asyncForEach(docs, sendMessages);

      return `ran successfully`;
    } catch (error) {
      return 'not run successfully';
    }
  });
