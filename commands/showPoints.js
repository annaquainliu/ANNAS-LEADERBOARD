const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName(`showpoints`)
    .setDescription(`Shows how many points you have and how much USD you can exhange for it.`),

	async execute(interaction) {
        db.checkPoints(interaction.user.username).then(async result => {
            if (result.exists) {    
                await interaction.reply({content: `You currently have ${result.points} Anna Points. You can exhange that for $${result.points / 10000000}.`, ephemeral: true});
            }
            else {
                await interaction.reply({content: "You don't have any points yet!", ephemeral: true});
            }
        });
	},
};