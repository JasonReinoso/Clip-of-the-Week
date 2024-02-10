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
  embedOption.forEach((response) => {
    if (response === null) return;

    exampleEmbed.addFields({ name: response, value: `> ${0} `, inline: true });
    buttonActionRow.addComponents(createButton(response, response, ButtonColors[0]));
    voteNumber.push(0);
  });
  buttonActionRow.addComponents(createButton('Vote', 'Vote', ButtonColors[0]));

  await interaction.reply({ embeds: [exampleEmbed], components: [buttonActionRow] });
};

export default { data, execute };
