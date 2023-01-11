import axios from "axios";
import cheerio from "cheerio";
import https from "https";

async function performScraping() {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://jumperbrasil.lance.com.br/onde-ver/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    httpsAgent,
  });

  let currentIndex = 0;

  let game: any = {};
  let games: any[] = [];

  const $ = cheerio.load(axiosResponse.data);

  $(".table")
    .find("tr")
    .find("td")
    // .find("text")
    .each((index, element) => {
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
          game.game = element.children[0].data;
        }

        if (currentIndex == 5) {
          game.transmission = element.children[0].data;
          games.push(game);
          game = {};
          currentIndex = 0;
        }
      }
    });

  console.log(games.filter((a) => a.league === "NBA"));
}

performScraping();
