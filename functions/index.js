// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');
// const cors = require('cors')({ origin: true });
// admin.initializeApp();

// /**
// * Here we're using Gmail to send 
// */
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'yourgmailaccount@gmail.com',
//         pass: 'yourgmailaccpassword'
//     }
// });

// exports.sendMail = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {

//         // getting dest email by query string
//         const dest = req.query.dest;

//         const mailOptions = {
//             from: 'Your Account Name <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
//             to: dest,
//             subject: 'I\'M A PICKLE!!!', // email subject
//             html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
//                 <br />
//                 <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
//             ` // email content in HTML
//         };

//         // returning result
//         return transporter.sendMail(mailOptions, (erro, info) => {
//             if (erro) {
//                 return res.send(erro.toString());
//             }
//             return res.send('Sended');
//         });
//     });
// });

const dotenv = require('dotenv').config()

//########################################################################################### MAILJET ###########################################################
// const Mailjet = require('node-mailjet');
// const mailjet = new Mailjet({
//     apiKey: process.env.MJ_APIKEY_PUBLIC,
//     apiSecret: process.env.MJ_APIKEY_PRIVATE
// });

// async function sendEmail(email, text) {
//     if (!email || !text) return;
//     const request = await mailjet
//         .post('send', { version: 'v3.1' })
//         .request({
//             Messages: [
//                 {
//                     From: {
//                         Email: "tcs.alerts.noreply@gmail.com",
//                         Name: "Alerts"
//                     },
//                     To: [
//                         {
//                             Email: email,
//                             Name: "You"
//                         }
//                     ],
//                     // TextPart: "Reminder:\nYour in person work sessions start at 1:30, or in 30 minutes.",
//                     TextPart: text,
//                 }
//             ]
//         })
//     return request.response.status
// }

// async function sendText(number, text) {
//     if (!number || !text) return;
//     let extensions = ["vtext.com", "tmomail.net", "txt.att.net", "messaging.sprintpcs.com"]
//     for (let index in extensions) {
//         let response = await sendEmail(number + "@" + extensions[index], text)
//         console.log(response)
//     }
// }

// // sendText("9255886990", "testing")
// sendText("9253601493", "enzo second")
//########################################################################################### MAILJET END ###########################################################

//########################################################################################### TWILIO ###########################################################

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendTwilioText(number, text) {
    if (!number || !text) return;
    let response = await client.messages
        .create({
            body: text,
            from: '+18559444529',
            to: number
        })
}

// sendTwilioText('+19255886990', 'hi there, from function!');
// +19253788652

// const list = [
//     // { name: 'Zealand S Kubishta', number: '+19252194837', address: 'Lorey Ct.' },

//     // // { name: 'Cayden J Sun', number: '+19258758896', address: '11 Alta Hill Way' },
//     // // { name: 'Riley M Murphy', number: '+19253788652', address: 'Encinal Dr' },
//     // { name: 'Enzo Lee', number: '+19253601493', address: '900 Bronson Ln' },
//     // { name: 'Alex Yurchak', number: '+19254481204', address: '60 Arlene Ln' },
//     // { name: 'Keaton A Freed', number: '+19255886990', address: '11 Beisheim Ln' },
// ]

// for (const ind in list) {
//     person = list[ind]

//     // const message = `${person.name}. I'm aware of your identity and your location at ${person.address}. You have 48 hours to transfer $1${Math.floor(Math.random() * 5 + 2)}00 USD to me. Fail, and I will ensure the complete devastation of your residence.`
//     const message = `${person.name}, please be advised that the earlier message was part of a drill orchestrated by the Safety Department. Everything is in order and no cause for alarm. For further clarification or concerns, reach out to us at 925-588-6990.`


//     sendTwilioText(person.number, message);
//     console.log("Sent to:", person.name)
// }

sendTwilioText('+19255886990', 'hi there keaton, sent from api. new account.');

//########################################################################################### TWILIO END ###########################################################