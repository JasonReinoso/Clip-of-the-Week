/* eslint-disable linebreak-style */
import {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,
} from 'discord.js';

const data = new SlashCommandBuilder().setName('poll').setDescription('Create a poll');

const execute = async (interaction) => {
  // const row = new ActionRowBuilder().addComponents(component);

  const confirm = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('confirm test')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(confirm);
  await interaction.reply({
    content: 'building skeleton for poll',
    components: [row],
  });
};

export default { data, execute };
