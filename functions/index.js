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

const ical2json = require("ical2json");

const fetch = require('node-fetch');

// const dotenv = require('dotenv').config()
const runAlerts = (req, res) => {
    const PERSONAL_PHONE = "+19255886990"

    const convert = async (fileLocation) => {
        const icsRes = await fetch(fileLocation)
        const icsData = await icsRes.text()

        const data = ical2json.convert(icsData)
        return data
    }
    function parseICalDate(date) {
        const year = date.substr(0, 4);
        const month = parseInt(date.substr(4, 2), 10) - 1;
        const day = date.substr(6, 2);
        const hour = date.substr(9, 2);
        const minute = date.substr(11, 2);
        const second = date.substr(13, 2);
        return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    function datesAreOnSameDay(first, second) {
        return (first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate());
    }
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    function sendTwilioText(number, text) {
        if (!number || !text) return;
        return client.messages
            .create({
                body: text,
                from: '+18559444529',
                to: number
            })
    }

    function alertUser(uid, userData) {
        if (!uid || !userData)
            return;
        if (!userData.phoneNumber || !userData.phoneNumber?.length === 11)
            return;
        if (!userData.calenderLink || !userData.calenderLink?.match(/^webcal:\/\/.+\.pike13.com\/[^.]+\.ics/))
            return;

        let icsLink = userData.calenderLink.replace("webcal://", "https://")
        convert(icsLink).then((icsData) => {
            if (!icsData || !icsData["VCALENDAR"]?.length || !icsData["VCALENDAR"][0]["VEVENT"].length) {
                logger.log("err while getting ics data, returned:", icsData)
                return
            }
            const currentDate = new Date()
            cleanedData = icsData["VCALENDAR"][0]["VEVENT"].map(event => {
                let eventDate = parseICalDate(event['DTSTART;TZID=America/Los_Angeles'])
                if (!datesAreOnSameDay(currentDate, eventDate))
                    return;
                eventTime = eventDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(" ", "").toLowerCase();
                return { ...event, START_TIME: eventTime }
            }).filter(e => e != null)
            const eventHelpIndex = 0
            function getSessionType(summary) {
                if (summary.includes("In Person")) return "in person";
                if (summary.includes("Remote")) return "remote";
                return undefined
            }
            logger.log("Sending alert to:", userData.displayName, userData.phoneNumber, "Data:", cleanedData[eventHelpIndex]?.["SUMMARY"])
            sendTwilioText(userData.phoneNumber, `Hello${userData.displayName ? " " + userData.displayName.substring(0, 20) : ""}, ${cleanedData.length ? `This is a reminder that you have ${cleanedData.length} session${cleanedData.length > 1 ? "s" : ""} at the Coder School today. Your start time is ${cleanedData[eventHelpIndex]["START_TIME"]}${getSessionType(cleanedData[eventHelpIndex]["SUMMARY"]) ? ", " + getSessionType(cleanedData[eventHelpIndex]["SUMMARY"]) : ""}.` : "This a reminder that you have no sessions at The Coder School today. Relax!"}`);
        }).catch((error) => {
            logger.log("ERROR! while getting ics data for:", userData.displayName, "E:", error)
        })

    }


    const usersCollectionRef = db.collection("users");
    usersCollectionRef.get()
        .then((querySnapshot) => {
            let sentMaxAlert = false
            let usersCount = 0;
            querySnapshot.forEach((doc, ind) => {
                usersCount++;
                if (ind >= 50) {
                    if (!sentMaxAlert) {
                        sendTwilioText(PERSONAL_PHONE, `BAD Admin Alert! 50 or more users detected, this is probably bad.`);
                    }
                    sentMaxAlert = true
                    return
                }
                alertUser(doc.id, doc.data());
            });
            sendTwilioText(PERSONAL_PHONE, `Admin Notification! Sending alerts(if valid) to ${usersCount} users.`);
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
exports.scheduledRun = onSchedule("every day 14:30", runAlerts)
// exports.scheduled = onSchedule("every day 20:32", runAlerts)

exports.smsReply = onRequest((req, res) => {
    const { MessagingResponse } = require('twilio').twiml;
    const twiml = new MessagingResponse();
    twiml.message('Thanks for the message, but this is a noreply number. Please type STOP to stop these messages.');

    logger.log("got message", req.body)
    res.type('text/xml').send(twiml.toString());

})