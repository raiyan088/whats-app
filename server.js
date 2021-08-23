const WhatsApp = require('./whats-app-api');

const whatsAppApi = new WhatsApp();

;(async () => {
  await whatsAppApi.start(json => {
    console.log("LISTEN RESP", json);
  }); 

})()
