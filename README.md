This project is a minecraft bot that uses OpenAI to interpret chat commands by generating code and executing it.<br />
The bot itself is based on MineFlayer: https://github.com/PrismarineJS/mineflayer

# Usage

First create a `.env` file based on `.env.local` example and populate it

Then run the following commands to install dependencies

```
pip3 install -r requirements.txt
npm install
```

Finally, run the bot!

```
node main.js
```

The bot uses the file `training.js` as a training set to infer code from commands.<br />
The more you add examples in this file, the smarter will it be!

## (Advanced) Use fine-tuned model

By default, the bot uses the basic OpenAI [Codex](https://beta.openai.com/docs/engines/codex-series-private-beta) model. You can use a [fine-tuned model](https://beta.openai.com/docs/guides/fine-tuning) instead by adding an argument to the command:

```
node main.js finetuned
```

This model theorically gives better results than the Codex model but needs to be trained before for it to work. To train the model, run this command:

```
python3 train.py
```

After this command, you'll have to wait a few minutes that the model is effectively trained (done by OpenAI servers in the background).<br />
To verify that the model has been trained successfully, you can run a test command here:

```
python3 finetuned.py "Jump!"
```

And check that you get back a valid javascript code.
