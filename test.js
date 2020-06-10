var request = require('request');

var options = { 
  url: 'https://app.zenscrape.com/api/v1/get?apikey=2e4a0950-ab24-11ea-9bcd-4d4684ddfa61&url=http://example.com&render=true' 
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
}

request(options, callback);