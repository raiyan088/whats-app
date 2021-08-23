const WhatsApp = require('./whats-app-api');
const express=require('express');

const app = express();

const whatsAppApi = new WhatsApp();

;(async () => {
  await whatsAppApi.start(json => {
    console.log("LISTEN RESP", json);
  }); 

})()

app.get('/send', function(req, res) {
    
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000...");
});
