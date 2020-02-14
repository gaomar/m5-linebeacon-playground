"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
require('dotenv').config();
const GAS = require('./GASPost');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);
const gas = new GAS();

const app = express();
app.use('/static', express.static('static'));

app.post("/linebot", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event, session) {
  let echo = [];
  if (event.type === 'beacon') {
    if (event.beacon.type === 'enter') {
        await gas.post(event.source.userId).then(function (ret) {
            if (ret) {
                console.log('GAS送信OK');
            }
        });
        echo = { 'type': 'text', 'text': 'ビーコン受信しました！' };
        return client.replyMessage(event.replyToken, echo);
    }
    return;
  } else if (event.type === 'follow') {
    return;
  } else {
    echo = { 'type': 'text', 'text': '申し訳ありませんが、お返事できません。' }; 
  }

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}!`);
});