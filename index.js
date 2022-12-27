var express = require('express')
var app = express()
var server = require('http').createServer(app);
var admin = require('firebase-admin')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var serviceAccount = require("./smart-portfolio-d96fe-firebase-adminsdk-rb06g-38daf4dd27.json");
const { credential } = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-portfolio-d96fe-default-rtdb.firebaseio.com"
});

// admin.initializeApp({
//   credential : admin.credential.cert({
//     "projectId" : "smart-portfolio-d96fe" ,
//     "private_key" : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrfQ5mNLH+DM9g\nKMb0zI+5j8+SF/4geS9dX2v2tuiiDxedS0l53cmmqNWgaLnhOiZH9ujkCm24uD/p\nOtc7PpMJET9xxY8trveohevCJPUMl5Lcv3v7SDUosay4Z9OVgR4ZQFKprKrYS7Sm\n0MCgdYhaMptKG2kZVp7J/0DkZNB2aZZIYXR8KkfBHHGXyFnM7ta0cfVvCHKZaGeW\n2ODjET1X9pTMbpKfsJFyerQ+jpXGcL9F7Qxk/5AUcRKj+yeNEtjr0c7bPxbdO4yw\nUa9OwD9y1GtUKSFloFwZJb+bXLWIzvUC9qtUG0tF7k7VPcX6kcAOX3IEjcinthSH\nGimEaJRLAgMBAAECggEAB5VGF7rozAUg/m2PLrAFAv2a/ijVcfYp5AUeLxCzhMcK\nEkiL/TmTey0oFSnMXmtF2hTPA5Z6d5qeKOATOGlx8wqyNYO46xo7lVYmsLUVqPLi\n6aQGBXyR7TS+IIFm18uX2yH/BcW+4EWovV+pxO6tkt9+Am7n3Nj5uJDy+6aBmVrL\nQmbtXhrT9ffI4sGvOAp6jWGXQ32sD0URNpnWlmzY4gmZOgu/e7CoSMfHghPiHk3e\nqcraikxSNNPJYFFAdrx9743TrVP3ynZ12aUokU7rDMlsNu2/GWDuBkmYGLbgMCLa\n8Djd3bzcWSzoccdM6WOQMcyM9btA/mihEgpaU3vRgQKBgQDsQ7/pkG93g/kOhkgX\n3a+Izifh/GPQlc9/hNWweHAWmAqdY4jc94MYnrZ459zcgYxGEaZlohMYkxmzJK52\nDUsXJv7J/KLcd7xYIh/a9uhT4w5OnDgkv9pJ6hgYHGFD/u11qX0jt6jKE5jZRL73\nA5loZK7m0YNMxriSLU09U3gH4QKBgQC50CR6ZiWx9RPw47Eyw8/ykltVQGKYvmsa\n+04rn4E8DI43wBaDWsg9g7pQBaei0KRuojWpT02XvCyZnRoYgDnUI4rT1DfHWAwp\nxN/VieMyFJc0idU/J3MWUQIi9q5ViOfDRg7Po/rjmcDpDF21o7cCkAGR41egTa2F\npf9rO+FxqwKBgQC/np8q7oMJOtcniY81FA5G9XTxW0MVLDvTX8f0TWoTWRLa3Zxm\nIrSHpkm2O88sZEGBntUG/vFf8AZa/fglNNjfGThyV9061D3EeUC+1ZxOVQwIg7kh\nTRzc7+jEvVfBzyOGV4VwD4ftBQHlzVTYgGnOekJEYE6OWWne3LEVePoT4QKBgHAV\nKavbaemKl9i6v+yLSShdOFKYX+EbG6hO5rxRnrcGK9NdPzdEz3yrtPsILjJ8AHPr\nzMqwV3GrxIt0xIT68+cO+XMFlA/fAJdBdnNslWtkGEFM0yEhPr67ZrqIamiWCJc1\n70E4/OHFoSPynaQvePlGvGuv4u+Da6QumX+pwze5AoGBANcWIDdQT790xAFBy26m\ngOJ/Vp4uPnoDl9nFyQwgiAql5Bn4PTzcz/HJxhWOcy8Ovn5mX1kkgzQABH8baBPr\nuG3C+5PV7yqnQVSDhlGpYl4DVMCOvYxkqz+iezwkVeRqu4l5pqJZ67ue0PtnbsrU\nM/k+YqNyDqxRNvXKPJli0Wm3\n-----END PRIVATE KEY-----\n",
//     "client_email" : "firebase-adminsdk-rb06g@smart-portfolio-d96fe.iam.gserviceaccount.com"
//   }),
//   databaseURL : "https://smart-portfolio-d96fe-default-rtdb.firebaseio.com"
// })

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

server.listen(process.env.PORT || 8080, function(){
  console.log("server on 8080")
})
