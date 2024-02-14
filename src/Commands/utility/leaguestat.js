/* eslint-disable linebreak-style */
import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder().setName('leaguerank').setDescription('shows leageu rank');

const execute = async (interaction) => {
  await interaction.reply('Pong!');
};

export default { data, execute };
