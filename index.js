var express = require('express')
var app = express()
var server = require('http').createServer(app);
var admin = require('firebase-admin')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var serviceAccount = require("./smart-portfolio-d96fe-firebase-adminsdk-rb06g-38daf4dd27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-portfolio-d96fe-default-rtdb.firebaseio.com"
});

app.post('/push',(req, res)=>{
  const body = req.body;
  const token = body.token;
  const from = body.from;
  const message = body.message;

  let pushMessage = {
    notification: {
      title: from,
      body: message,
    },
    token: token,
  }

  admin
  .messaging()
  .send(pushMessage)
  .then(function(response) {
    console.log('Successfully send message : ', response)
    res.send(true)
  })
  .catch(function (err) {
    console.log('Error Sending message !! : ', err)
    res.send(false)
  })
})

server.listen(8080, function(){
  console.log("server on 8080")
})
