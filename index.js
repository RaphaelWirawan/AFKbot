const mineflayer = require("mineflayer");
const { mineflayer: mineflayerViewer } = require("prismarine-viewer");

const bot = mineflayer.createBot({
  host: "ricechum.aternos.me",
  port: "41214",
  username: "bot01",
  auth: "offline",
});

// let target = null

// bot.on("spawn", () => {
//   bot.setControlState("forward", true);
//   delay * 1000;
//   bot.setControlState("backwards", true);
// });

function isNighttime(timeOfDay) {
  // Nighttime ranges from 12541 to 23458 in Minecraft
  return timeOfDay >= 12541 && timeOfDay <= 23458;
}

function findBed() {
  const bed = bot.findBlock({
    matching: (block) => bot.isABed(block),
    maxDistance: 5,
  });

  return bed;
}

let isBotSleeping = false;

bot.on("entitySleep", (entity) => {
  if (entity === bot.entity) {
    isBotSleeping = true;
  } else {
    console.log("bot already sleeping");
  }
});

bot.on("spawn", () => {
  //bot sleep function
  setInterval(() => {
    const timeOfDay = bot.time.timeOfDay;
    if (isNighttime(timeOfDay)) {
      // It's nighttime, try to sleep
      if (!isBotSleeping) {
        const bed = findBed();
        if (bed) {
          bot.sleep(bed);
        } else {
          console.log("no bed to sleep in");
        }
      }
    }
  }, 10000);

  // Set the initial direction to forward
  let direction = "forward";

  // Set an interval to change direction every 5 seconds
  setInterval(() => {
    // Toggle between 'left' and 'right' direction
    direction = direction === "left" ? "right" : "left";

    // Make the bot turn in the chosen direction for 1 second
    bot.setControlState(direction, true);
    bot.look(Math.PI / 1.5, 0);

    setTimeout(() => {
      bot.setControlState(direction, false);
    }, 2000);
    setTimeout(() => {
      bot.look(Math.PI, 0);
    }, 2000);
  }, 5000); // Change direction every 5 seconds
});

bot.once("spawn", () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true });
});

bot.on("error", (err) => {
  console.log("Bot error:", err);
});
