const express = require('express');
const path = require('path');
const Env = require('Env');

const feApp = express();

feApp.use(express.static(path.join('..', 'frontend', 'build', 'index.html')));

feApp.get('/', (request, response) => {
  response.sendFile(path.join('..', 'frontend', 'build', 'index.html'));
});

const host = Env.get('EXTERNAL_HOST');
const port = 3000;
feApp.listen(port, host, () => {
  console.log('🚀Front-end started at http://0.0.0.0:3000');
});
