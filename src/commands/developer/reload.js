const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
    category: 'Developer',
	execute(message, args) {
        const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`!`);
		}
        const commandFolders = fs.readdirSync(require("path").join(__dirname, "../", "../", "./commands"));
        const folderName = commandFolders.find(folder => fs.readdirSync(require("path").join(__dirname, "../", "../", `./commands/${folder}`)).includes(`${command.name}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try{
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};