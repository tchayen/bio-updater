import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export async function mastodon(bio) {
  if (!process.env.MASTODON_BEARER_TOKEN) {
    console.log(
      'Missing "MASTODON_BEARER_TOKEN" environment variable. Skipping.'
    );
    return;
  }

  const request = await fetch(
    "https://mastodon.social/api/v1/accounts/update_credentials",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${process.env.MASTODON_BEARER_TOKEN}`,
      },
      body: "note=" + encodeURIComponent(bio),
    }
  );
  const response = await request.json();

  if (response.source.note === bio) {
    console.log("Mastodon: ✅");
  } else {
    console.log(response);
    console.log("Mastodon: ❌");
  }
}
