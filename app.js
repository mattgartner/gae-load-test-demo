const dotenv = require("dotenv");
dotenv.load();
const express = require('express');
const app = express();
const Twitter = require('twitter');

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(express.static("static"));

app.get('/', (req, res) => {
  res.status(200).send('Hello world!').end();
});

app.get('/test', (req, res) => {
  res.status(200).send('Hello world!').end();
});

app.get('/twitter', (req, res) => {
  var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });
   
  var params = {
    q: '#googlecloudonboard',
    count: 10,
    result_type: 'recent',
    lang: 'en'
  }
  
    const request = client.get('search/tweets', params, function(err, data, response) {
        const tweets = data.statuses;
      if (!err) {
        res.render("twitter", {tweets: tweets});
      } else {
        console.log(err);
        res.status(200).send("Sorry, an error occurred");
      }
    });
  
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

