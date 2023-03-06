import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { NbaGameWorker } from "./workers/NbaGameWorker";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const channels = client.channels.cache.filter(
    (a: any) => a.name.toLowerCase().indexOf("alertas-nba") >= 0
  );

  for (let index = 0; index < channels.size; index++) {
    const channel = channels.at(index);

    const games = await new NbaGameWorker().executeWorker("NBA", true);

    let message = "@here :basketball: Jogos de hoje: :basketball: \n\n";

    games.forEach((game) => {
      message += `**${game.title?.trim()} as ${game.hour?.trim()}**. Transmissão em *${game.transmission?.trim()}* \n\n`;
    });

    message = message.substring(0, message.length - 2);

    await (<TextChannel>channel).send(message);
  }

  process.exit(0);
});

client.login(process.env.NBA_ALERT_DISCORD_TOKEN);
