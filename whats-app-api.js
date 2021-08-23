const puppeteer = require('puppeteer')
const path = require('path');
const fs = require('fs');

let type = 'null'
let time = 0

module.exports = class {
  constructor () {
    
  }

  async start (callback) {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      })

      const page = await browser.newPage()
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36')
      
      const sessions = fs.existsSync(path.join(__dirname, '.appstate.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, '.appstate.json'), 'utf8')) : null;
        
        
        await page.evaluateOnNewDocument(
                session => {
                    localStorage.clear();
                    localStorage.setItem('WABrowserId', session.WABrowserId);
                    localStorage.setItem('WASecretBundle', session.WASecretBundle);
                    localStorage.setItem('WAToken1', session.WAToken1);
                    localStorage.setItem('WAToken2', session.WAToken2);
                }, sessions);
        
        await page.goto('https://web.whatsapp.com/', {
            waitUntil: 'networkidle2'
        })
        
        await page.waitForSelector('[title="Ma"]');
        await page.click('[title="Ma"]')
        
        console.log('Listioning....')
        
        page._client.on( 'Network.webSocketFrameReceived', async ({ timestamp, response:{ payloadData } }) => {
          if(payloadData.includes("\"id\":\"8801736937335@c.us\"")) {
              const index = payloadData.indexOf("{")
              if(index != -1) {
                  const json = JSON.parse(payloadData.substring(index, payloadData.length -1))
                  if(type != json.type) {
		      if(json.t) {
		          time = json.t
		      }
		      let ret = {
		          type: json.type,
		          time: time
		      } 
		      callback(ret)
		      type = json.type
                  }
              }
          }
          
      })
    })
  }
}
