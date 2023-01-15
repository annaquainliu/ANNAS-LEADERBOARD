//    https://discordapp.com/oauth2/authorize?&client_id=1061481745133879438&scope=bot&perms=274877983744
// TODO: ADD CHANNEL 
// TTO: 915442903529181184
// ELOTIHS: 720040796233138207
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const db = require('./db.js');
const WORDS = require('./words.js');
const channelID = "1063623967413379142";
var channel;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent,
]});

client.commands = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

db.connectToDatabase();

client.once(Events.ClientReady, c => {
	channel = client.channels.cache.get(channelID);
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

client.on('messageCreate', (message) => {

	const lowerCasedMsg = message.content.toLowerCase();
	const author = message.author.username;

	if (author == "ANNA'S LEADERBOARD!!" || author == "KlymeneArts" 
	|| !(containsMe(message) || lowerCasedMsg.match("anna"))) {
		console.log("exiting");
		return;
	}
	
	/*if message mentions my name :) */
	var amntOfNiceWords = countWords(WORDS.getWords("wordsILike"), lowerCasedMsg);
	var amntOfBadWords = countWords(WORDS.getWords("wordsIHate"), lowerCasedMsg);
	var netPointChange = 0;
	var positiveVibes = false;

	/*Positive vibes case. Could make this long ass if statement a function but idc */
	if (amntOfNiceWords > 0 && !(lowerCasedMsg.match("n’t") || 
	lowerCasedMsg.match("not") || lowerCasedMsg.match("arent") || 
	lowerCasedMsg.match("isnt") || lowerCasedMsg.match("doesnt") ||
	lowerCasedMsg.match("dont") || lowerCasedMsg.match("n't"))) {
		positiveVibes = true;
		channel.send(`:smile: Thanks for mentioning ${amntOfNiceWords} positive ${plural(amntOfNiceWords)} around Anna! *${message.author}* **GAINS** ${amntOfNiceWords * 25} Anna Points. :smile:
		Message: **"${message.content}"** `);
	}

	/*Bad vibes case */
	if (amntOfBadWords > 0) {
		channel.send(`:anger: *${author}* said ${amntOfBadWords} bad ${plural(amntOfBadWords)} around Anna! *${message.author}* **LOSES** ${amntOfBadWords * 25} Anna Points. :anger:
		Message: **"${message.content}"** `);
	}

	/*Neutral vibes case */
	if (amntOfBadWords == 0 && amntOfNiceWords == 0) {
		channel.send(`${message.author} gets 10 Anna Points for talking about me.
		Message: **"${message.content}"**`);
		netPointChange = 10;
	}
	else {
		/*if they negated a complement*/
		if (!positiveVibes) {
			amntOfNiceWords = 0;
		}
		netPointChange = (amntOfNiceWords * 25) - (amntOfBadWords * 25);
	}

	if (netPointChange != 0) {
		db.addPointsInDatabase(author, netPointChange);
	}

	function containsMe(msg) {
		const values = msg.mentions.users;
		var contains = false;

		values.forEach((value, key, map) => {
			if (value.username == 'KlymeneArts') {
				contains = true;
				return;
			}
		});
		return contains;
	}

	function plural(instances) {
		if (instances == 1) {
			return "word";
		}
		return "words";
	}

	function countWords(wordsArr, msg) {
		var instances = 0;
		wordsArr.forEach(word => {
			if (msg.includes(word)) {
				instances += msg.split(word).length - 1;
			}
		});
		return instances;
	}

});
// Log in to Discord with your client's token
client.login(token);