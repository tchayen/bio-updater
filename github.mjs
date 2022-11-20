import fetch from "node-fetch";

if (!process.env.GITHUB_BEARER_TOKEN) {
  throw new Error('Missing "GITHUB_BEARER_TOKEN" environment variable.');
}

export async function gitHub(bio) {
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
    console.log("GitHub: ❌");
  }
}
