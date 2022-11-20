import chalk from "chalk";
import { commandLineInput, Readline } from "./utils.mjs";
import { twitter } from "./twitter.mjs";
import { gitHub } from "./github.mjs";

(async () => {
  const bio = await commandLineInput(`${chalk.italic("Paste new bio here:")} `);
  await twitter(bio);
  await gitHub(bio);
  Readline.close();
})();
