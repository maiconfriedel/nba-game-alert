import axios from "axios";
import cheerio from "cheerio";
import https from "https";
import { Game } from "../models/Game";
import { stringToDate } from "../utils/stringToDate";

export class NbaGameWorker {
  async executeWorker(league: string, today: boolean) {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const axiosResponse = await axios.request({
      method: "GET",
      url: process.env.NBA_ALERT_QUERY_URL,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
      httpsAgent,
    });

    let currentIndex = 0;

    let game: Game = {};
    let games: Game[] = [];

    const $ = cheerio.load(axiosResponse.data);

    $(".table")
      .find("tr")
      .find("td")
      .each((index, element: any) => {
        if (!element.children[0].data) {
          return;
        } else {
          currentIndex++;
          if (currentIndex == 1) {
            game.date = element.children[0].data;
          }

          if (currentIndex == 2) {
            game.hour = element.children[0].data;
          }

          if (currentIndex == 3) {
            game.league = element.children[0].data;
          }

          if (currentIndex == 4) {
            game.title = element.children[0].data;
          }

          if (currentIndex == 5) {
            game.transmission = element.children[0].data;
            game.date = stringToDate(game.date + "-2022", "dd-MM-yyyy", "-");

            if (game.hour === "00:00") {
              game.date.setDate(game.date.getDate() - 1);
            }

            games.push(game);
            game = {};
            currentIndex = 0;
          }
        }
      });

    return games.filter(
      (game) =>
        game.league === league &&
        game.date?.getDate() ==
          (today ? new Date().getDate() : game.date?.getDate())
    );
  }
}
