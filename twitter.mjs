import * as dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import fetch from "node-fetch";
import OAuth from "oauth-1.0a";
import chalk from "chalk";
import { commandLineInput, paramsToObject } from "./utils.mjs";

const requestTokenURL =
  "https://api.twitter.com/oauth/request_token?oauth_callback=oob";
const authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
const accessTokenURL = "https://api.twitter.com/oauth/access_token";

const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

async function getRequestToken() {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: "POST",
    })
  );

  const request = await fetch(requestTokenURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"],
    },
  });

  const response = await request.text();
  if (response.startsWith('{"errors"')) {
    throw new Error("Error.");
  }
  return paramsToObject(new URLSearchParams(response).entries());
}

async function getAccessToken({ oauth_token, oauth_token_secret }, verifier) {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: "POST",
    })
  );

  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;

  const request = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"],
    },
  });

  const response = await request.text();
  if (response.startsWith('{"errors"')) {
    throw new Error("Error.");
  }
  return paramsToObject(new URLSearchParams(response).entries());
}

async function authenticate() {
  const oAuthRequestToken = await getRequestToken();

  authorizeURL.searchParams.append(
    "oauth_token",
    oAuthRequestToken.oauth_token
  );
  console.log(
    `${chalk.italic("Please go here and authorize:")} ${chalk.bold(
      authorizeURL.href
    )}`
  );
  const pin = await commandLineInput(`${chalk.italic("Paste the PIN here:")} `);
  const oAuthAccessToken = await getAccessToken(oAuthRequestToken, pin.trim());
  return oAuthAccessToken;
}

export async function twitter(bio) {
  if (!process.env.TWITTER_CONSUMER_KEY) {
    console.log(
      'Missing "TWITTER_CONSUMER_KEY" environment variable. Skipping.'
    );
    return;
  }

  if (!process.env.TWITTER_CONSUMER_SECRET) {
    console.log(
      'Missing "TWITTER_CONSUMER_SECRET" environment variable. Skipping.'
    );
    return;
  }

  const endpointURL = `https://api.twitter.com/1.1/account/update_profile.json?description=${encodeURIComponent(
    bio
  ).toString()}`;

  const { oauth_token, oauth_token_secret } = await authenticate();

  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "POST",
      },
      token
    )
  );

  const request = await fetch(endpointURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"],
      "Content-Type": "application/json",
    },
  });

  const response = await request.json();

  if (response.description === bio) {
    console.log("Twitter: ✅");
  } else {
    console.log(response);
    console.log("Twitter: ❌");
  }
}
