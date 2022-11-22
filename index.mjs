import * as dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
import { commandLineInput, Readline } from "./utils.mjs";
import { twitter } from "./twitter.mjs";
import { gitHub } from "./github.mjs";
import { mastodon } from "./mastodon.mjs";

(async () => {
  const bio = await commandLineInput(`${chalk.italic("Paste new bio here:")} `);
  await twitter(bio);
  await gitHub(bio);
  await mastodon(bio);
  Readline.close();
})();
