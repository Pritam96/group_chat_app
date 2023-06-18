const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const localStorage = require('localStorage');

const store = require('store2');

const app = express();

const messages = [];

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 4000;

app.get('/login', (req, res, next) => {
  if (localStorage.getItem('username') !== null) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  }
});

app.post('/login', (req, res, next) => {
  try {
    localStorage.setItem('username', req.body.username);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.get('/', (req, res, next) => {
  //   console.log(localStorage.getItem('username'));
  if (localStorage.getItem('username') === null) {
    res.redirect('/login');
  } else {
    // res.send(localStorage.getItem('messages'));
    // res.sendFile(path.join(__dirname, 'views', 'chat.html'));
    let msg = '';
    if (store('messages') !== null) {
      msg = store('messages');
    }
    res.send(`${msg}<main>
      <h1>Chat Page</h1>
      <form action="/send" method="POST">
        <label for="message">Enter Your Message</label>
        <input type="text" name="message" id="message" />
        <button type="submit">Send</button>
      </form>
      <p></p>
    </main>`);
    // res.sendFile(path.join(__dirname, 'views', 'chat.html'));
  }
});

app.post('/send', (req, res, next) => {
  try {
    messages.push(`{${localStorage.getItem('username')}:${req.body.message}}`);
    // console.log(messages);
    store('messages', messages);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server is up and running in port no: ${PORT}`)
);
