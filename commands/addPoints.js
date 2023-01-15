const { SlashCommandBuilder } = require('discord.js');
const db = require('../db.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName(`giveannapoints`)
    .setDescription(`Give your Anna Points to a person.`)
	.addNumberOption(option => option
		.setName('quantity')
		.setRequired(true)
		.setDescription('The amount of Anna Points you want to give')
	)
	.addUserOption(option => option
		.setName('user')
		.setRequired(true)
		.setDescription('The user to receive Anna Points') 
	),

	async execute(interaction) {

		const recipient = interaction.options.getUser('user');
		const recipientName = recipient.username;
		const user = interaction.user;
		const userName = user.username;
		const numPoints = interaction.options.getNumber('quantity');

		/*People cannot give KlymeneArts Anna Points*/
		if (recipientName == 'KlymeneArts') {
			await interaction.reply({content: "You can't give Anna Points to Anna! >:)", ephemeral: true});
			return;
		}

		if (recipientName == userName) {
			await interaction.reply({content: "You can't give Anna Points to yourself. Brog.", ephemeral: true});
			return;
		}

		/*If the number is a float*/
		if (Number(numPoints) === numPoints && numPoints % 1 !== 0) {
			await interaction.reply({content: "Stop trying the infinite money glitch. Brog.", ephemeral: true});
			return;
		}

		if (numPoints < 0 && userName != "KlymeneArts") {
			await interaction.reply({content: "You can't add negative points! >:(", ephemeral: true});
			return;
		}

		const promise = db.giveAnnaPoints(userName, recipientName, numPoints);
		
		promise.then(async retValue => {
			if (retValue == "success") {
				if (numPoints < 0) {
					/*This would only happen if KlymeneArts removes points */
					await interaction.reply(`${user} **REMOVED** ${numPoints * -1} Anna Points from ${recipient} :angry:`);
				} else {
					await interaction.reply({content:`${user} gave ${numPoints} Anna Points to ${recipient} :money_mouth:`});
				}
			}
			else if (retValue == "not enough points") {
				await interaction.reply({content: "You don't have enough Anna Points.", ephemeral: true});
			}	
			else {
				await interaction.reply({content:`You don't exist on the leaderboard yet!`, ephemeral: true});
			}
		});
	},
};