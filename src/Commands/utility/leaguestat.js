/* eslint-disable linebreak-style */
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ScrapeProduct from '../../../backend/webscrape/OPGGwebscrape.js';

const data = new SlashCommandBuilder()
  .setName('leaguerank')
  .setDescription('shows leageu rank')
  .addStringOption((option) => option.setName('summonername').setDescription('Enter the name of the summoner followed by the #').setRequired(true));

const execute = async (interaction) => {
  const summonerName = interaction.options.getString('summonername');

  const uIdata = ['Rank', 'Lp', 'Win/Loss', 'Win rate'];

  const rankEmbed = new EmbedBuilder()
    .setColor('DarkOrange')
    .setTitle(`${summonerName} rank: `)
    .setFooter({ text: 'Rank detail asked at' })
    .setTimestamp();

  await interaction.deferReply();
  try {
    const summonerRankDetail = await ScrapeProduct(summonerName);
    summonerRankDetail[3] = summonerRankDetail[3].replace('Win Rate', '');
    for (let i = 0; i < 4; i++) {
      rankEmbed.addFields({ name: uIdata[i], value: `> ${summonerRankDetail[i]}`, inline: true });
    }
    await interaction.editReply({ embeds: [rankEmbed] });
  } catch {
    await interaction.editReply(`Could not find player:${summonerName}`);
  }
};

export default { data, execute };
