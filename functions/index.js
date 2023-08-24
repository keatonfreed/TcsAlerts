// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
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

const { initializeApp } = require('firebase-admin/app');
initializeApp();

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();

// const dotenv = require('dotenv').config()
const runAlerts = (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    function sendTwilioText(number, text) {
        if (!number || !text) return;
        let response = client.messages
            .create({
                body: text,
                from: '+18559444529',
                to: number
            })
    }

    function alertUser(uid, userData) {
        if (!uid || !userData) return;

        if (!userData.phoneNumber || !userData.phoneNumber?.length === 11) return;

        logger.log("Sending alert to:", userData.displayName, userData.phoneNumber)
        sendTwilioText(userData.phoneNumber, `Hello${userData.displayName ? " " + userData.displayName.substring(0, 20) : ""}, this is a reminder that you have a 3:30pm In Person session to start today.`);
    }


    const usersCollectionRef = db.collection("users");
    usersCollectionRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                alertUser(doc.id, doc.data());
            });
            logger.log("Ended 1")
        })
        .catch((error) => {
            console.error("Error fetching documents: ", error);
        });
    logger.log("RAN ALEERTS FUNC")
    if (res && res.send) {
        res.send("Running")
    }
}

// every day 00:00
// exports.scheduled = onSchedule("every day 20:20", runAlerts)

exports.testing = onRequest(runAlerts)