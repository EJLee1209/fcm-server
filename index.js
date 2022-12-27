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
    // notification: {
    //   title: from,
    //   body: message,
    // },
    // notification 으로 보낼경우 포그라운드 상태에서는 받을 수 있으나
    // 백그라운드 상태에서는 받을 수 없다.
    // data 로 보낼 경우 포그라운드 백그라운드 모두 받을 수 있다. 
    data: {
      title: from,
      body: message
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

app.get('/test', (req,res)=>{
  res.send("hello")
})

server.listen(8080, function(){
  console.log("server on 8080")
})
