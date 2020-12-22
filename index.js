const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

// bot variable that initializes a new SlackBot instance which has two values, our token and app name.
const bot = new SlackBot({
  token: `${BOT_TOKEN}`,
  name: 'inspire bot'
});

/* Start handler
Our Bot does nothing now even though it's running. Let's return a message.
The bot.on handler sends the welcome message. We passed two parameters,
the 'start' and a function which holds a params variable which also holds the slack emoji.
Note: Slack emoji have codes, you can find them at https://slackmojis.com/
*/

bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    }

    bot.postMessageToChannel(
        'random',
        'Get inspired while working with @inspire_bot',
        params
    );
})
/**
We also initialized the bot.postMessageToChannel function which is a SlackBot.js method to post a message to a channel.
In this function, we pass the channel name we want to post to, the message in a string, and the params variable we declared earlier for the emoji.
I used the #random channel and sent Get inspired while working with @inspire_bot to it.


- You can also post messages to users and groups.

    // define existing username instead of 'user_name'
    bot.postMessageToUser('user_name', 'Hello world!', params);


    // define private group instead of 'private_group', where bot exist
    bot.postMessageToGroup('private_group', 'Hello world!', params);
*/

// Error Handler - a function to check for errors and return them
bot.on('error', (err) => {
    console.log(err);
})


/**************** MESSAGE HANDLER - build the main bot functionality *******************************

we'll be using the quotes JSON from the extension I built as our quotes API.
The JSON can be found with this URL: https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json

When a user mentions our bot and adds inspire me, the bot returns a random quote from inspireNuggets.
When the user types random joke, it returns a random joke from the Chuck Norris API.
And when the user types help, it returns the instruction guide.

*/
// Message Handler
bot.on('message', (data) => {
  if(data.type !== 'message') {
      return;
  }
  handleMessage(data.text);
});

// Response Handler
function handleMessage(message) {
  if(message.includes(' inspire me')) {
      inspireMe()
  } else if(message.includes(' random joke')) {
      randomJoke()
  } else if(message.includes(' help')) {
      runHelp()
  }
}



/************ Now create the function we need ***************************

inspireMe()

You can use any API you prefer, you'll just have to iterate differently to get your data depending on if your API returns an array or object - whichever it returns, it's not a big deal.
*/

function inspireMe() {
  axios.get('https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json')
    .then(res => {
      const quotes = res.data;
      const random = Math.floor(Math.random() * quotes.length);
      const quote = quotes[random].quote
      const author = quotes[random].author

      const params = {
        icon_emoji: ':male-technologist:'
      }

      bot.postMessageToChannel(
        'random',
        `:zap: ${quote} - *${author}*`,
        params
      );
    })
}

// randomJoke() We're getting the jokes from the Chuck Norris API from this endpoint https://api.chucknorris.io/jokes/random.
// This is a real API that returns a random joke on every request, so we don't have to do Math.floor() again.
function randomJoke() {
  axios.get('https://api.chucknorris.io/jokes/random')
    .then(res => {
      const joke = res.data.value;

      const params = {
        icon_emoji: ':smile:'
      }

      bot.postMessageToChannel(
        'random',
        `:zap: ${joke}`,
        params
      );

    })
}


// runHelp() - This is similar to our welcome message: we just want to return a custom text when the user adds help to the request.
function runHelp() {
  const params = {
    icon_emoji: ':question:'
  }

  bot.postMessageToChannel(
    'random',
    `Type *@inspire bot* with *inspire me* to get an inspiring techie quote, *random joke* to get a Chuck Norris random joke and *help* to get this instruction again`,
    params
  );
}
