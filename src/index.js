/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import {
  AuditLogEvent, Client, IntentsBitField, Events, GatewayIntentBits, Collection, REST, Routes,
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname = `file://${transtion.replace(/\\/g, '/')}`;

dotenv.config();

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
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

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
  if (!interaction.isChatInputCommand()) return;
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
  }
});

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

client.on(Events.MessageComponentCreate, async (interaction) => {
  console.log(interaction.customId);
});
