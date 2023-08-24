// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */


// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
// 
const logger = require("firebase-functions/logger");
// const admin = require('firebase-admin');
// admin.initializeApp();

// const dotenv = require('dotenv').config()
const runAlerts = (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    console.log("INIIIITTTTTT", accountSid);
    async function sendTwilioText(number, text) {
        if (!number || !text) return;
        let response = await client.messages
            .create({
                body: text,
                from: '+18339843616',
                to: number
            })
    }
    sendTwilioText('+19255886990', 'TEST. running from timer!');
    logger.log("RAN ALEERTS FUNC")
}

// every day 00:00
exports.scheduled = onSchedule("every day 08:00", runAlerts)

exports.testing = onRequest(runAlerts)