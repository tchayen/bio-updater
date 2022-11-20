import { commandLineInput, Readline } from "./utils.mjs";
import { twitter } from "./twitter.mjs";
import { gitHub } from "./github.mjs";

(async () => {
  const bio = await commandLineInput("Paste new bio here: ");
  await twitter(bio);
  await gitHub(bio);
  Readline.close();
})();
