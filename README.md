<!-- Official challenge page -->

https://dev.to/devteam/announcing-the-twilio-hackathon-on-dev-2lh8

First dev.to thread

https://dev.to/shimphillip/get-customized-weather-updates-through-sms-231o

To develop locally run

firebase serve

to deploy only functions
firebase deploy --only functions

Todo

1. Register User
2. Give users a settings page
3. User can ask to receive daily forecast each morning
4. user receives a message

// Method 1
Create multiple scheduled functions that run one hour interval.
Scrape through all the users in the database and see if their info matches this timeset
Run the function

// Method 2
Simply creat one scheduled function and have all users receive the texts
