/* eslint-disable linebreak-style */
import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

const data = new SlashCommandBuilder()
  .setName('i_hate_jbwc')
  .setDescription('Insultcort')
  .addStringOption((option) => option.setName('name')
    .setDescription('Insult anyone you want'));

const execute = async (interaction) => {
  const name = interaction.options.getString('name');
  const response = await axios.get(`https://insult.mattbas.org/api/insult.txt?who=${name}`);
  console.log(response);
  await interaction.reply(response.data);
};
export default { data, execute };
