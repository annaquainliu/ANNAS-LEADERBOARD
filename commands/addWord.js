const { SlashCommandBuilder } = require('discord.js');
const WORDS = require('../words.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`addword`)
    .setDescription(`Adds a positive or negative word to the bot's vocabulary.`)
	.addStringOption(option => option
		.setName('word')
		.setRequired(true)
		.setDescription('The word to be added.')
	)
	.addBooleanOption(option => option
		.setName('poggers')
		.setRequired(true)
		.setDescription('Positive or negative.') 
	),

    async execute(interaction) {

        if (interaction.user.username != "KlymeneArts") {
            await interaction.reply({content: `YOU CAN'T ADD WORDS!`, ephemeral: true});
            return;
        }

       const word = interaction.options.getString('word');
       const conn = interaction.options.getBoolean('poggers');

        if (WORDS.addWord(word, conn)) {
            await interaction.reply(`"${word}" has successfully been added to the bot's vernacular!`);
        }
        else {
            await interaction.reply({content: `"${word}" is already in the bot's vernacular!`, ephemeral: true});
        }
    }

};
