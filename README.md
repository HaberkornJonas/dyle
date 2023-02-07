# DYLE - Discord YouTube Link Extractor

## Introduction

This script will allow you to extract all youtube links send in a discord channel and gather then into a single `.csv` file with some metadata like the title, publication date and start of the description.

## Prerequisits

- A discord account with access to the channel you want to extract the links from connected on the web app _(not the desktop or mobile one)_
- An API key for the YouTube Data API _(v3 at this time)_

## How to use

1. Run `npm install` at this project's root directory
2. Go on your browser, open Discord, open the DevTools (usually F12 works), open the Network tab
3. Reload the discord page, open a request that has been made to any discord api endpoint and extract the value of the Authorization header
4. Past it as the value for `DISCORD_TOKEN` in `getVideos.js`
5. Open the channel you want to target, check the call made to `https://discord.com/api/v9/channels/{DISCORD_CHANNEL_ID}/messages`
6. Copy the channel ID from this url into `DISCORD_CHANNEL_ID` in `getVideos.js`
7. Get your YouTube API key value and put it into `YOUTUBE_API_KEY` in `getVideos.js`
8. Run with `npm start`
9. Use the generated `videos.csv` file
