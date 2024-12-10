// const axios = require('axios');
// const express = require('express');

// const app = express();

// const APP_ID = '774616631286778';
// const APP_SECRET = 'c9fae58e10f52fa54bb46416c96f0240';
// const REDIRECT_URI = 'http://localhost:3000/auth/facebook/callback';

// // Initiates the Facebook Login flow
// app.get('/auth/facebook', (req, res) => {
//   const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;
//   res.redirect(url);
// });

// // Callback URL for handling the Facebook Login response
// app.get('/auth/facebook/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange authorization code for access token
//     const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);

//     const { access_token } = data;

//     // Use access_token to fetch user profile
//     const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

//     // Code to handle user authentication and retrieval using the profile data

//     res.redirect('/');
//   } catch (error) {
//     console.error('Error:', error.response.data.error);
//     res.redirect('/login');
//   }
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   // Code to handle user logout
//   res.redirect('/login');
// });




// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

// module.exports = app;


const devcert = require('devcert')
async function main() {
    let ssl = await devcert.certificateFor('my-app.test');
    https.createServer(ssl, app).listen(3000);
}

// main()

const http = require('http');
const ngrok = require('@ngrok/ngrok');

// Create webserver
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Congrats you have created an ngrok web server');
}).listen(8080, () => console.log('Node.js web server at 8080 is running...'));

// Get your endpoint online
ngrok.connect({ addr: 8080, authtoken_from_env: true })
  .then(listener => console.log(`Ingress established at: ${listener.url()}`));