var axios = require('axios');
var fs = require('fs')
require('dotenv').config()


const cookie = `ajs_anonymous_id=${process.env.ajs_anonymous_id};_gcl_au=${process.env._gcl_au};cb_user_id=${process.env.cb_user_id};cb_group_id:${process.env.cb_group_id};cb_anonymous_id=${process.env.cb_anonymous_id};_fbp=${process.env._fpb};figma.session=${process.env['figma.session']};figma.st=${process.env['figma.st']};local_experiments=${process.env.local_experiments};figma.ref=${process.env['figma.ref']};`


var config = {
  method: 'get',
  url: 'https://www.figma.com/api/fonts',
  headers: { 
    'authority': 'www.figma.com', 
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) Figma/93.4.0 Chrome/85.0.4183.121 Electron/10.2.0 Safari/537.36', 
    'content-type': 'text/plain', 
    'accept': '*/*', 
    'sec-fetch-site': 'same-origin', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-dest': 'empty', 
    'referer': 'https://www.figma.com/files/885972051699405879/fonts', 
    'accept-language': 'en-US', 
    'cookie': cookie
  }
};

axios(config)
.then(function (response) {
  //console.log(JSON.stringify(response.data));
  if(!response.data.error){
    mapStyles(response.data.meta.fonts)
  } else {
    console.log('Error with status:', response.data.status)
  }
})
.catch(function (error) {
  console.log(error);
});


function mapStyles(data){
  let fonts = {}
  data.forEach(font => {
     fonts[font.postscript_name] = {}
     fonts[font.postscript_name]['family'] = font.family;
     fonts[font.postscript_name]['style'] = font.style;
     fonts[font.postscript_name]['weight'] = font.weight;
     fonts[font.postscript_name]['italic'] = font.italic;
     fonts[font.postscript_name]['stretch'] = font.stretch;
  })
  fs.writeFileSync('./src/data/fontmap.json',JSON.stringify(fonts,null,4), 'utf8')
  

}
