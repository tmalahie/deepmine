This project is a minecraft bot that uses OpenAI to generate code based on chat commands and interpret them.

# Usage

First create a `.env` file based on `.env.local` example and populate it

Then run the following commands to install dependencies

```
pip3 install -r requirements.txt
npm install
```

Finally, run the bot!

```
npm run main
```

The bot uses the file `training.js` as a training set to infer code from commands.
The more you add examples in this file, the smarter will it be!
