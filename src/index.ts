import { CronJob } from "cron";
import { NbaGameWorker } from "./workers/NbaGameWorker";

new CronJob(
  "00 12 * * *",
  () => {
    new NbaGameWorker().executeWorker("NBA");
  },
  null,
  true,
  "America/Sao_Paulo"
);
