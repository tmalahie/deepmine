const mineflayer = require("mineflayer");
const move = require("mineflayer-move");
const { spawnSync } = require("child_process");
require("dotenv").config();

const model = process.argv[2] ?? "codex";
if (!["codex", "finetuned"].includes(model)) {
  console.error(`Invalid model: ${model}`);
  process.exit(1);
}

console.log(`Using model ${model}`);

const bot = mineflayer.createBot({
  host: process.env.MINECRAFT_HOST,
  username: process.env.MINECRAFT_USERNAME,
  password: process.env.MINECRAFT_PASSWORD,
  port: process.env.MINECRAFT_PORT,
});
move(bot);

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  message = message.toLowerCase();
  handleMessage(username, message);
});

function handleMessage(username, message) {
  try {
    console.log("Command", message);
    if (message.endsWith("]")) {
      console.log("Minecraft command, skip");
      return;
    }
    const interpretedCmd = spawnSync("python3", [`${model}.py`, message]);
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
