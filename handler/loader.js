const fs = require('node:fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json')

module.exports = async (client) => {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles)
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    const rest = new REST({ version: '9' }).setToken(config.token);

    // Make it globally
    (async () => {
        try {
            console.log('Started searching for application commands.');
    
            await rest.put(
                Routes.applicationCommands(config.clientid),
                { body: commands },
            );
    
            console.log('Successfully loaded all application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}