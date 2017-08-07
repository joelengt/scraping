import messages from '~/src/messages'
import {
  noop
} from '~/src/utils'

var debug = require('debug')('riqra-service-partner:controller-ads')
var sql = require('../initializers/knex')
var Promise = require('bluebird')

// Import the dependencies
const cheerio = require("cheerio")
const req = require("tinyreq")
const whois = require('whois-json')
const GoogleScraper = require('google-scraper');
const scrapeIt = require("scrape-it");

// Find on google by keyword
function getScraperPile(urls, keyword) {
  return new Promise((resolve, reject) => {
    let elements = urls.map((elementURL, index) => {
      let urlItem = elementURL

      let web = scrapeWeb(urlItem, {content: "html"})
        .then((data) => {
          // filtrar la palabra que busco
          let text = data.content
          let word = keyword
          let result = getMatches(word, text)

          if (result.length !== 0) {
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
        return web
    })
    
    // resolve array promise
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

class AdsController {
  getStart(req, res) {
     
    let keyword = 'joel'

    const options = {
      keyword: keyword,
      language: "pe",
      tld:"com.pe",
      results: 10
    };
   
    const scraper = new GoogleScraper(options);
    let arrayToWhois = []
     
    debug('Scraping GOOGLE >> Searching: ', keyword)

    let data = scraper.getGoogleLinks
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
        let webCoincidence = result.data
        debug('Webs Coincidence keyword', result)

        debug('find websites whois ...')

        let resultFinal = []

        // find whois each web
        webCoincidence.forEach((element) => {
          if (element) {
            let urlPretty = element.url.split('://')[1].split('/')[0]
            
            // Callback interface 
            let urlDomain = 'joelgt.com'
            scrapeIt(`https://www.whois.com/whois/${urlDomain}`, {
              // Fetch the articles 
              articles: {
                listItem: ".whois_main_column",
                data: {
                  content: {
                    selector: ".df-block-raw",
                    how: "html"
                  }
                }
              }
            }, (err, page) => {
              debug('WHOIS')
              console.log(err || page);

              let elementWhois = {
                data: page.articles[0].content,
              }
              resultFinal.push(elementWhois)

            });

          }
        })

        debug('ARRAY FINAL')
        console.log(resultFinal)

        return resultFinal

      })
      .catch(function(e) {
        debug('Error')
        console.log(e);
      })
    })
    .catch(function(e) {
      console.log(e);
    })

    // Scraping all the websites
    Promise.props({
      data: data
    })
    .then((result) => {
      let webCoincidence = result.data
      debug('TODO', result)

      res.status(200).json({
        data: webCoincidence
      })

    })
    .catch(function(e) {
      debug('Error')
      console.log(e);
    })

  }
}

export {
  AdsController
}
