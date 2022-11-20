CLI script for updating bio at Twitter and GitHub in one go.

Unfortunately a bit tricky to set up.

![Video demonstration](assets/video.mp4)

## Setup

### Twitter

1. Create Twitter Developer portal app https://developer.twitter.com/en/portal/dashboard.
1. Save consumer key and consumer secret to `.env` file as `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET`.
1. Set up authentication in order to give your app read/write permissions (default is read only). You can put `http://localhost:3000/callback` as callback URL and `https://example.org` as the website. ![Twitter dashboard screenshot](assets/twitter-auth.png)

### GitHub

1. Create an access token https://github.com/settings/tokens?type=beta and save it to `.env` as `GITHUB_BEARER_TOKEN`.

## Run

```bash
source .env
node index.mjs
```

You will be asked to visit Twitter authentication page where you will get PIN to paste into the app.
