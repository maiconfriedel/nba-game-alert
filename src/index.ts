import { CronJob } from "cron";
import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { fastify, FastifyInstance } from "fastify";
import { NbaGameWorker } from "./workers/NbaGameWorker";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const channel = client.channels.cache.find(
    (a: any) => a.name.toLowerCase().indexOf("nba") >= 0
  ) as TextChannel;

  new CronJob(
    process.env.NBA_ALERT_CRON_EXPRESSION as string,
    async () => {
      const games = await new NbaGameWorker().executeWorker("NBA", true);

      let message = "@here Jogos de hoje: \n\n";

      games.forEach((game) => {
        message += `**${game.title} as ${game.hour}**. Transmissão em *${game.transmission}* \n\n`;
      });

      message = message.substring(0, message.length - 2);

      channel.send(message);
    },
    null,
    true,
    "America/Sao_Paulo"
  );
});

client.login(process.env.NBA_ALERT_DISCORD_TOKEN);

const server: FastifyInstance = fastify({});

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen({
      port: Number.parseInt(process.env.PORT as string) || 3000,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
