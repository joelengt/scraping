"use strict"

process.env.PROJECT_DIR = __dirname

require('require-self-ref')
require('app-module-path').addPath('~/lib')
require('~/lib/json-response')

const debug = require('debug')('riqra-service-partner:server')

const path = require('path')
const home = require('os').homedir()
const envPath = path.join(home, '.env')

debug('Server starting ENV =>', process.env.NODE_ENV)


// function scrapeOnGoogle(url, data, cb) {
//     // 1. Create the request
//     req(url, (err, body) => {
//         if (err) { return cb(err); }

//         // 2. Parse the HTML
//         let $ = cheerio.load(body)
//           , pageData = {}
//           ;

//         // 3. Extract the data
//         Object.keys(data).forEach(k => {
//             pageData[k] = $(data[k]).text();
//         });

//         // 4. Extract link
//         let anchors = $('h3.r a');
//         let links = []

//         $(anchors).each(function(i, link) {
//           let item = {}
//           item['name'] = $(link).text();
//           debug('link only >> ', link.children[0].parent)
//           // debug('link', $(link).data('href'))

//            if ($(link).attr('href') !== undefined &&
//              $(link).attr('href') !== null) {

//                let urlDirty = $(link).attr('href')
//            item['link'] = urlDirty.split("/url?q=")[1];

//               links.push(item)
//            }

//    });

//         pageData['links'] = links;

//         // Send the data in the callback
//         cb(null, pageData);
//     });
// }

// search on google
// let keyword = "gato"
// https://www.google.com.pe/search?q=
// scrapeOnGoogle("https://www.bing.com/search?q=gato" + keyword, {
//     // Get the website html
//     content: "html"
// }, (err, data) => {
//     console.log(err || data);
// });

if (process.env.NODE_ENV === 'production') {
  require('babel-polyfill')
  require('dotenv').config({path: envPath})
  require('~/dist/index')
} else {
  require('dotenv').config()
  require('~/src/index')
}
