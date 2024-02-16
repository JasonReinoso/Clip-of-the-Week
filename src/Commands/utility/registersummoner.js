/* eslint-disable linebreak-style */
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ScrapeProduct from '../../../backend/webscrape/leagueStatswebscrape.js';
import registersummoner from '../../../backend/modal/registerSummoner.js';

const data = new SlashCommandBuilder()
  .setName('registersummoner')
  .setDescription('registers summoner,bot will then report if they played a game')
  .addStringOption((option) => option.setName('summonername').setDescription('Enter the name of the summoner followed by the #').setRequired(true));

const execute = async (interaction) => {
  const summonerName = interaction.options.getString('summonername');
  await interaction.deferReply();
  try {
    const summonerRankDetail = await ScrapeProduct(summonerName);

    await registersummoner(summonerName, summonerRankDetail);
    await interaction.editReply(`${summonerName} has been registered`);
  } catch (e) {
    await interaction.editReply(`${summonerName} could not be found. Unable to register`);
    console.log(e);
  }
};

export default { data, execute };
