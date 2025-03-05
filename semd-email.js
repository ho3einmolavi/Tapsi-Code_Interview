const FormData = require("form-data"); // form-data v4.0.1
const Mailgun = require("mailgun.js"); // mailgun.js v11.1.0

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: 'af4c4ecbebac5a8b4f5dc59bb8a0eae9-667818f5-da3d0053',
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net/v3"
  });
  try {
    const data = await mg.messages.create("jainsta.com", {
      from: "Mailgun Sandbox <postmaster@jainsta.com>",
      to: ["Hossein Molavi <ho3einmolavi00@gmail.com>"],
      subject: "Hello Hossein Molavi",
      text: "Congratulations Hossein Molavi, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

sendSimpleMessage()