const { SlashCommandBuilder } = require('discord.js');
const WORDS = require('../words.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`removeword`)
    .setDescription(`Removes a positive or negative word from the bot's vocabulary.`)
	.addStringOption(option => option
		.setName('word')
		.setRequired(true)
		.setDescription('The word to be removed.')
	)
	.addBooleanOption(option => option
		.setName('poggers')
		.setRequired(true)
		.setDescription('Positive or negative.') 
	),
    
    async execute(interaction) {

        if (interaction.user.username != "KlymeneArts") {
            await interaction.reply({content: `YOU CAN'T REMOVE WORDS!`, ephemeral: true});
            return;
        }

        const word = interaction.options.getString('word');
        const conn = interaction.options.getBoolean('poggers');

        if (WORDS.removeWord(word, conn)) {
            await interaction.reply(`"${word}" has successfully been removed from the bot's vernacular!`);
        }
        else {
            await interaction.reply({content: `"${word}" doesn't exist in the bot's vernacular yet!`, ephemeral: true});
        }

    }
    
}