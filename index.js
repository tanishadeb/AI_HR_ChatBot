  const { RTMClient } = require('@slack/rtm-api');
  const { createEventAdapter } = require('@slack/events-api');
  const slackEvents = createEventAdapter('410ced6f86d70e38469a1ef2b03e5633');
  const port = process.env.PORT || 3000; 
  const MonkeyLearn = require('monkeylearn');
  const request = require("request"); 


  'use strict';
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));




  const token = 'xoxb-958269254994-977003679814-p2KhJN7XhSEoX1wZ2FR02upj';
  const rtm = new RTMClient(token);
  rtm.start()
  .catch(console.error);

  // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
  slackEvents.on('message', (event) => { 
    if(event.text=='hello Toby' || event.text=='Hi Toby' || event.text=='hi toby' || event.text=='Hello Toby Flenderson'|| event.mention == true)
    {  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says  ${event.text}`);
      let res = rtm.sendMessage('Hello there', event.channel);
      console.log('Message sent: ', res.ts);
    } 
    else{
    const ml = new MonkeyLearn('1a79678c16c6bffcfb9f67dfc792ce869914af99')
    let model_id = 'cl_4JhCHUiB';
    let data = [event.text];
    ml.classifiers.classify(model_id, data).then(response => {
    let info = response.body;
    let newobj = Object.keys(info); 
    let keys = info[newobj[0]];
    console.log(keys);
    console.log(Object.keys(info[newobj[0]]));
    console.log(info[newobj[0]]['classifications'][0]['tag_name']);
    let item = info[newobj[0]]['classifications'][0]['tag_name'];

    if(info[newobj[0]]['classifications'][0]['tag_name'] == 'Negative')
        {   
            const info_reply = rtm.sendMessage('Please Review your channels for potential inappropriate context' , event.user='DUCL8HMLZ');
            const channels_reply= rtm.sendMessage('Hello everyone! Just a heads up that this is a safe workspace and I advice everyone to be mindful of hurtful/offensive terms', event.channel );
            console.log('Message sent: ', info_reply.ts);
            console.log('Message sent: ', channels_reply.ts);
            return; 
        }
    }).catch(error => {
        // handle error
        console.log(error)
        // if an error is thrown during the request
        // it will also contain the (failure) response
        console.log(error.response)
    })
    }
    });
    
    // Handle errors (see `errorCodes` export)
    slackEvents.on('error', console.error);
    
    // Start a basic HTTP server
    slackEvents.start(port).then(() => {
      // Listening on path '/slack/events' by default
      console.log(`server listening on port ${port}`);
    });
