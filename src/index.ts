import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { NbaGameWorker } from "./workers/NbaGameWorker";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const channel = client.channels.cache.find(
    (a: any) => a.name.toLowerCase().indexOf("nba") >= 0
  ) as TextChannel;

  const games = await new NbaGameWorker().executeWorker("NBA", true);

  let message = "@here Jogos de hoje: \n\n";

  games.forEach((game) => {
    message += `**${game.title?.trim()} as ${game.hour?.trim()}**. Transmissão em *${game.transmission?.trim()}* \n\n`;
  });

  message = message.substring(0, message.length - 2);

  await channel.send(message);

  process.exit(0);
});

client.login(process.env.NBA_ALERT_DISCORD_TOKEN);
