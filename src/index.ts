import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  var channels = c.channels.cache;

  console.log(channels);
});

client.login(process.env.DISCORD_TOKEN);

// new CronJob(
//   "00 12 * * *",
//   () => {
//     new NbaGameWorker().executeWorker("NBA", true);
//   },
//   null,
//   true,
//   "America/Sao_Paulo"
// );

// new NbaGameWorker().executeWorker("NBA", true);
