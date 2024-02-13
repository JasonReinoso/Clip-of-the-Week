/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line linebreak-style
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import {
  EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, Component, ComponentType, embedLength,
} from 'discord.js';
import createButton from '../../Components/button.js';
import { pushToEmbedMap } from '../../Components/embeds.js';

const ButtonColors = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link];

const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a poll')
  .addStringOption((option) => option.setName('pollquestion')
    .setDescription('The question to be asked')
    .setRequired(true))
  .addStringOption((option) => option.setName('response')
    .setDescription('Choice1')
    .setRequired(true))
  .addStringOption((option) => option.setName('response2')
    .setDescription('choice2')
    .setRequired(true))
  .addStringOption((option) => option.setName('response3')
    .setDescription('choice3'))
  .addStringOption((option) => option.setName('response4')
    .setDescription('choice4'));

const execute = async (interaction) => {
  const executorName = interaction.member.nickname !== null && interaction.member.nickname !== undefined
    ? interaction.member.nickname
    : interaction.member.user.tag;

  const pollQuestion = interaction.options.getString('pollquestion');
  const embedOption = [];
  const slashOption = ['response', 'response2', 'response3', 'response4'];

  for (const option of slashOption) {
    embedOption.push(interaction.options.getString(option));
  }

  const exampleEmbed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle(pollQuestion)
    .setAuthor({ name: `${executorName} asked: ` })
    .setFooter({ text: 'Poll started at ' })
    .setTimestamp();

  const buttonActionRow = new ActionRowBuilder();
  const voteNumber = [];
  const { timestamp } = exampleEmbed.data;
  for (let i = 0; i < embedOption.length; i++) {
    if (embedOption[i] === null) continue;

    exampleEmbed.addFields({ name: embedOption[i], value: `> ${0} `, inline: true });
    buttonActionRow.addComponents(createButton(`${timestamp} ${slashOption[i]}`, embedOption[i], ButtonColors[0]));
    voteNumber.push(0);
  }
  buttonActionRow.addComponents(createButton(`${timestamp} Vote`, 'Show result', ButtonColors[0]));
  const usersWhoVoted = new Map();
  pushToEmbedMap(exampleEmbed, buttonActionRow, voteNumber, usersWhoVoted);

  await interaction.reply({ embeds: [exampleEmbed], components: [buttonActionRow] });
};

export default { data, execute };
