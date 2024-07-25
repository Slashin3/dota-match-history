require('dotenv').config();
const express = require("express");
const https = require("https");
const { Client, IntentsBitField } = require("discord.js");

const app = express();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.username} is running`);
});

client.on("messageCreate", (message) => {
  const url = "https://api.opendota.com/api/players/370370060/wl?limit=20";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const playerData = JSON.parse(data);
      const wins = Number(playerData.win);
      const losses = Number(playerData.lose);
      const total = wins + losses;
      const mmrchange = wins * 26 - losses * 24;

      if (message.content === "w") {
        message.reply(`${wins}`);
      } else if (message.content === "l") {
        message.reply(`${losses}`);
      } else if (message.content === "wl") {
        message.reply(`${wins}-${losses} out of ${total} matches`);
      } else if (message.content === "change") {
        message.reply(`${mmrchange}`);
      }
    });
  });
});

client.login(process.env.TOKEN);
