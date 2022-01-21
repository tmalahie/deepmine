const mineflayer = require("mineflayer");
const move = require("mineflayer-move");
require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.MINECRAFT_HOST,
  username: process.env.MINECRAFT_USERNAME,
  password: process.env.MINECRAFT_PASSWORD,
  port: process.env.MINECRAFT_PORT,
});

// Initialize modules
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
  switch (message) {
    case "move forward":
    case "go forward":
      bot.setControlState("forward", true);
      break;
    case "move backwards":
    case "step back":
      bot.setControlState("back", true);
      break;
    case "move to the left":
    case "go to the left":
      bot.setControlState("left", true);
      break;
    case "move to the right":
    case "go to the right":
      bot.setControlState("right", true);
      break;
    case "sprint":
    case "run":
      bot.setControlState("sprint", true);
      break;
    case "stop":
    case "stop moving":
      bot.clearControlStates();
      break;
    case "jump":
      bot.setControlState("jump", true);
      bot.setControlState("jump", false);
      break;
    case "jump a lot":
      bot.setControlState("jump", true);
      break;
    case "stop jumping":
    case "don't jump":
      bot.setControlState("jump", false);
      break;
    case "attack":
    case "attack ennemy":
    case "attack nearest ennemy":
    case "fight":
      entity = bot.nearestEntity();
      if (entity) {
        bot.attack(entity, true);
      } else {
        bot.chat("no nearby entities");
      }
      break;
    case "mount":
    case "mount nearest object":
      entity = bot.nearestEntity((entity) => {
        return entity.type === "object";
      });
      if (entity) {
        bot.mount(entity);
      } else {
        bot.chat("no nearby objects");
      }
      break;
    case "dismount":
      bot.dismount();
      break;
    case "move vehicle forward":
      bot.moveVehicle(0.0, 1.0);
      break;
    case "move vehicle backward":
      bot.moveVehicle(0.0, -1.0);
      break;
    case "move vehicle left":
      bot.moveVehicle(1.0, 0.0);
      break;
    case "move vehicle right":
      bot.moveVehicle(-1.0, 0.0);
      break;
    case "move vehicle right":
      bot.moveVehicle(-1.0, 0.0);
      break;
    case "come":
    case "come to me":
      bot.move.to(bot.players[username].entity.position);
      break;
    case "<command>":
      /* placeholder */
      break;
  }
}
