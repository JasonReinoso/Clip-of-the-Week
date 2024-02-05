import {
  Client, IntentsBitField,
} from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', (c) => {
  console.log(`${c.user.tag}`);
});

client.on('messageCreate', (message) => {
  console.log(message.content);
});

client.on('messageCreate', async (message) => {
  if (message.content === 'I love cortlands cock') { message.reply('I wanna fuck him too!!'); } else if (message.content === 'Bot get this bitch') {
    let string;
    await axios.get('https://insult.mattbas.org/api/insult.txt?who=Cortland').then((response) => {
      string = response.data;
    });
    message.reply(string);
  }
});

client.login(process.env.Discord_token);
