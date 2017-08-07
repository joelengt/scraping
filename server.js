"use strict"

process.env.PROJECT_DIR = __dirname

require('require-self-ref')
require('app-module-path').addPath('~/lib')
require('~/lib/json-response')

const debug = require('debug')('riqra-service-partner:server')

const path = require('path')
const home = require('os').homedir()
const envPath = path.join(home, '.env')
var Promise = require('bluebird')

debug('Server starting ENV =>', process.env.NODE_ENV)

// Import the dependencies
const cheerio = require("cheerio"),
      req = require("tinyreq");

// Define the scrape function
function scrapeWeb(url, data) {
  return new Promise ((resolve, reject) => {
    // 1. Create the request
    req(url, (err, body) => {
      if (err) { return reject(err); }

      // 2. Parse the HTML
      let $ = cheerio.load(body),
      pageData = {};

      // 3. Extract the data
      Object.keys(data).forEach(k => {
          pageData[k] = $(data[k]).text()
      });

      // 4. Extract link
      let anchors = $('a')
      let links = []

      $(anchors).each(function(i, link) {
        let item = {}
        item['name'] = $(link).text()

         if ($(link).attr('href') !== undefined &&
            $(link).attr('href') !== null) {

           if ($(link).attr('href').indexOf('http') === -1) {
             item['link'] = url + $(link).attr('href')
           } else {
             item['link'] = $(link).attr('href')
           }

           links.push(item)
         }

      });

      pageData['links'] = links

      // Send the data in the callback
      resolve(pageData)
    });
  })
}

function getMatches(needle, haystack) {
    var myRe = new RegExp("\\b" + needle + "\\b((?!\\W(?=\\w))|(?=\\s))", "gi"),
      myArray, myResult = [];
    while ((myArray = myRe.exec(haystack)) !== null) {
      myResult.push(myArray.index);
    }
    return myResult;
}

// Find on google by keyword
let keyword = "joel"
const GoogleScraper = require('google-scraper');
 
const options = {
  keyword: keyword,
  language: "pe",
  tld:"com.pe",
  results: 10
};
 
const scraper = new GoogleScraper(options);
let arrayToWhois = []
 
debug('Scraping GOOGLE >> Searching: ', keyword)

scraper.getGoogleLinks
  .then(function(value) {
    debug('Scraping GOOGLE >> Searching End')
    debug('Scraping webs >> Searching...')

    // Extract some data from website
    console.log(value)
    let urls = value

    // Scraping all the websites
    Promise.props({
      data: getScraperPile(urls, keyword)
    })
    .then((result) => {
      debug('FIN', result.data[0])
    })
    .catch(function(e) {
      debug('Error')
      console.log(e);
    })
  })
  .catch(function(e) {
    console.log(e);
  })



function getScraperPile(urls, keyword) {
  return new Promise((resolve, reject) => {
    let elements = []

    urls.forEach((elementURL, index) => {
      debug(index, 'element', elementURL)
      let urlItem = elementURL

      let web = scrapeWeb(urlItem, {content: "html"})
        .then((data) => {
          // filtrar la palabra que busco
          let text = data.content
          let word = keyword
          let result = getMatches(word, text)

          if (result.length === 0) {
            debug('No hay resultados en la pagina')
          } else {
            debug('Resultados', result)
            let element = {
              url: urlItem,
              coincidencia: result
            }
            return element
          }
        })
        .catch(function(e) {
          debug('Error')
          console.log(e);
        })

      elements.push(web)
    })

    Promise.all(elements)
    .then((result) => {
      resolve(result)
    })
    .catch(function(e) {
      debug('Error')
      reject(e)
    })    
  })
}


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

// if (process.env.NODE_ENV === 'production') {
//   require('babel-polyfill')
//   require('dotenv').config({path: envPath})
//   require('~/dist/index')
// } else {
//   require('dotenv').config()
//   require('~/src/index')
// }
