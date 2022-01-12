const mineflayer = require("mineflayer");
const { spawnSync } = require("child_process");
require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.MINECRAFT_HOST,
  username: process.env.MINECRAFT_USERNAME,
  password: process.env.MINECRAFT_PASSWORD,
  port: process.env.MINECRAFT_PORT,
});

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  message = message.toLowerCase();
  handleMessage(message);
});

function handleMessage(message) {
  try {
    console.log("Command", message);
    const interpretedCmd = spawnSync("python3", ["main.py", message]);
    const code = interpretedCmd.stdout.toString();
    console.log("Code", code);

    eval(code);
  } catch (e) {
    bot.chat("Sorry, something went wrong");
    bot.chat(e.message);
    console.error(e);
  }
}

console.log("Ready to receive commands");