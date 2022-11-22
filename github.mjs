import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export async function gitHub(bio) {
  if (!process.env.GITHUB_BEARER_TOKEN) {
    console.log(
      'Missing "GITHUB_BEARER_TOKEN" environment variable. Skipping.'
    );
    return;
  }

  const request = await fetch("https://api.github.com/user", {
    method: "PATCH",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_BEARER_TOKEN}`,
    },
    body: JSON.stringify({
      bio,
    }),
  });

  const response = await request.json();
  if (response.bio === bio) {
    console.log("GitHub: ✅");
  } else {
    console.log(response);
    console.log("GitHub: ❌");
  }
}
