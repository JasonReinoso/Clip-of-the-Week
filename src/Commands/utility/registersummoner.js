/* eslint-disable linebreak-style */
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ScrapeProduct from '../../../backend/webscrape/OPGGwebscrape.js';

const data = new SlashCommandBuilder()
  .setName('registersummoner')
  .setDescription('registers summoner,bot will then report if they played a game');

const execute = async (interaction) => {
 await interaction.reply("under construction");
};

export default { data, execute };
