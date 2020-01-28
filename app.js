const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
 
app.use(bodyParser.json());
 
app.set('views', __dirname + '/views'); // Render on browser
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/views'));
 
const server = app.listen(5000);
 
app.get('/', function (req, res) {
  res.render('index');
});
 
 
 const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'fc8ba588',
  apiSecret: 'lbikomM9aonOYCN9',
});

nexmo.verify.request({
  number: '919488482021',
  brand: 'Nexmo',
  code_length: '4'
}, (err, result) => {
  console.log(err ? err : result)
});

nexmo.verify.control({
  request_id: 'REQUEST_ID',
  cmd: 'cancel'
}, (err, result) => {
  console.log(err ? err : result)
});


nexmo.verify.check({
  request_id: 'REQUEST_ID',
  code: 'CODE'
}, (err, result) => {
  console.log(err ? err : result)
});