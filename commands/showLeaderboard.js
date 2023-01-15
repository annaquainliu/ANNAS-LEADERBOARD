const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName(`annalb`)
    .setDescription(`Shows Anna's Leaderboard.`),

	async execute(interaction) {
		db.leaderboard().then(async (body) => {
			await interaction.reply({content: body});
		});
	},
};