/* eslint-disable linebreak-style */
import {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder,
} from 'discord.js';

const createButton = (customId, label, style) => {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style);
  return button;
};

export default createButton;
