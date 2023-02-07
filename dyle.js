const fs = require("fs");
const axios = require("axios");

const DISCORD_CHANNEL_ID = "<TO_COMPLETE>";
const DISCORD_TOKEN = "<TO_COMPLETE>";
const YOUTUBE_API_KEY = "<TO_COMPLETE>";

let videos = [];
let lastMessageId = "";

async function get50MoreMessages() {
  try {
    const response = await axios.get(
      `https://discord.com/api/v9/channels/${DISCORD_CHANNEL_ID}/messages?limit=25${
        lastMessageId ? "before=" + lastMessageId : ""
      }`,
      {
        headers: {
          Accept: "application/json",
          Authorization: DISCORD_TOKEN,
        },
      }
    );

    if (response.status === 200) {
      lastMessageId = response.data[response.data.length - 1].id;
      await Promise.all(
        response.data.map(async (m) => {
          const urls = m.content.split(" ").filter((s) => s.startsWith("http"));
          for (const url of urls) {
            const id = youtube_parser(url);
            if (id) {
              const metadata = await getYoutubeVideoMetadata(id);
              videos.push(
                `https://youtu.be/${id},${metadata.title},${metadata.publishedAt},${metadata.description}`
              );
            }
          }
        })
      );
    }
  } catch (e) {
    console.error(e);
  }
}

// Source: https://stackoverflow.com/a/8260383/10358602
function youtube_parser(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

async function getYoutubeVideoMetadata(videoId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (response.status === 200) {
      return {
        title: response.data.items[0].snippet.title.replace(/,/g, ";"),
        publishedAt: response.data.items[0].snippet.publishedAt,
        description:
          response.data.items[0].snippet.description
            .replace(/,/g, ";") // Avoiding , as they are the deliiters of the .csv file
            .split("\n")[0] || "-", // Only keeping the first line of description to avoid all promotional links and keep it short
      };
    }
  } catch (e) {
    console.error(e);
    return {
      title: "Error",
      publishedAt: "1970-01-01T00:00:00Z",
      description: "Error",
    };
  }
}

async function main() {
  let previousCount = 0;
  do {
    previousCount = videos.length;
    console.log(`[🔎] Got ${previousCount} videos, searching for more...`);
    await get50MoreMessages();
  } while (false && previousCount != videos.length);

  console.log(
    `[📦] Found no new videos, stopping here, found ${videos.length} videos!`
  );
  console.log("[💾] Writting into videos.csv...");
  fs.writeFile(
    `${__dirname}/videos.csv`,
    `Link,Title,PublishedAt,Description\n${videos.join("\n")}`,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("[✅] Done!");
      }
    }
  );
}

main();
