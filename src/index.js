/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import {
  EmbedBuilder, AuditLogEvent, Client, IntentsBitField, Events, GatewayIntentBits, Collection, REST, Routes, Embed,
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEmbedFromMap, pushToEmbedMap } from './Components/embeds.js';
import didSummonerWinOrLose from '../backend/controller/didSummonerWinOrLose.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname = `file://${transtion.replace(/\\/g, '/')}`;
dotenv.config();

const pollingInterval = 120000;
const channelId = process.env.channel_Id;
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
  ],
});
client.login(process.env.Discord_token);
client.commands = new Collection();

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const channel = await client.channels.fetch(channelId);
  didSummonerWinOrLose(channel, pollingInterval);
});

const checkVote = (name, usersWhoVoted, voteNumber, optionNumber, interaction) => {
  const doesUserExist = usersWhoVoted.get(name);
  console.log(doesUserExist);
  if (doesUserExist === undefined) {
    usersWhoVoted.set(name, optionNumber);
    voteNumber[optionNumber] += 1;
  } else if (doesUserExist === optionNumber) {
    console.log('same option');
    /// you cant vote for the same thing dumbass;
  } else if (doesUserExist !== optionNumber) {
    voteNumber[doesUserExist] -= 1;
    voteNumber[optionNumber] += 1;
    usersWhoVoted.set(name, optionNumber);
  }
};

async function loadCommands() {
  const foldersPath = path.join(__dirname, 'Commands');
  const commandFolders = await fs.promises.readdir(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.promises.readdir(commandsPath)).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePathtest = path.join(commandsPath, file);
      const filePath = `file://${filePathtest}`;
      try {
        const module = await import(filePath);
        const command = module.default;

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[Warning] The command at ${filePath} is missing data and execute properties`);
        }
      } catch (error) {
        console.log(`[Error] Failed to import module from ${filePath}: ${error}`);
      }
    }
  }
}

loadCommands();

// listens for events from slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`no command matching ${interaction.commandName} was found`); return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'there was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'there was an error while excuting this command!', ephemeral: true });
      }
    } /// ////////////////////////////////////////////////////
  } else if (interaction.isButton()) {
    const customId = interaction.customId.split(' '); // first element is id and second is response
    const embedFromMap = getEmbedFromMap(customId[0]);
    if (!embedFromMap) {
      await interaction.message.edit({ content: 'Poll could not be found in memeory. Poll has been closed', embeds: [], components: [] });
      return;
    }
    const voteNumber = embedFromMap.votes;

    const name = interaction.user.username;
    const userWhoVoted = embedFromMap.Users;

    const newEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle(embedFromMap.content.data.title)
      .setAuthor({ name: embedFromMap.content.data.author.name })
      .setTimestamp(new Date(embedFromMap.content.data.timestamp))
      .setFooter({ text: embedFromMap.content.data.footer.text });

    switch (customId[1]) {
      case 'response':
        checkVote(name, userWhoVoted, voteNumber, 0, interaction);
        interaction.deferUpdate();
        break;
      case 'response2':
        checkVote(name, userWhoVoted, voteNumber, 1, interaction);
        interaction.deferUpdate();
        break;
      case 'response3':
        checkVote(name, userWhoVoted, voteNumber, 2, interaction);
        interaction.deferUpdate();
        break;
      case 'response4':
        checkVote(name, userWhoVoted, voteNumber, 3, interaction);
        interaction.deferUpdate();
        break;
      case 'Vote':
        const userByVote = {};
        userWhoVoted.forEach((vote, user) => {
          if (!userByVote[vote]) userByVote[vote] = [];
          userByVote[vote].push(user);
        });
        console.log(embedFromMap.content.data);

        const voteEmbed = new EmbedBuilder().setColor('Aqua').setTitle(`${embedFromMap.content.data.title} results `);
        embedFromMap.content.data.fields.forEach((field, index) => {
          const users = userByVote[index] || [];
          voteEmbed.addFields({ name: field.name, value: ` ${users.join(', ')}` || '0' });
        });
        await interaction.reply({ embeds: [voteEmbed] });
        // interaction.deferUpdate();
        return;
    }
    let i = 0;
    embedFromMap.content.data.fields.forEach((field) => {
      newEmbed.addFields({ name: field.name, value: `> ${voteNumber[i]}`, inline: true });
      i += 1;
    });

    pushToEmbedMap(newEmbed, embedFromMap.buttons, voteNumber, userWhoVoted);
    await interaction.message.edit({ embeds: [newEmbed], components: [embedFromMap.buttons] });
  }
});/// ///////////////////////////////////////////////////////////

client.on(Events.GuildAuditLogEntryCreate, async (auditLog) => {
  const { action, executorId } = auditLog;
  const channel = client.channels.cache.get('1205390325531803648');

  if (action !== AuditLogEvent.MemberDisconnect) return;
  console.log(auditLog);

  const executor = await client.users.fetch(executorId);

  try {
    channel.send(`${executor.tag} has kicked a User`);
  } catch (e) {
    console.error(e);
  }
});
