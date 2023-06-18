const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./scratch');

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
  console.log(localStorage.getItem('username'));
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

app.post('/send', (req, res, next) => {
  try {
    messages.push(`{${localStorage.getItem('username')}:${req.body.message}}`);
    console.log(messages);
    localStorage.setItem('messages', messages);
    res.redirect('/', { messages: localStorage.getItem('messages') });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server is up and running in port no: ${PORT}`)
);
