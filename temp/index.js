const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const { OpenAIApi, Configuration } = require("openai")
const config = require("./config.json");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]
});

module.exports = client;

client.commands = new Collection();

require("./handler/loader")(client);
client.login(config.token);

client.on(Events.MessageCreate, async (interaction) => {
    if (interaction.author.bot) return

    const CHANNEL_ALLOWED = "1013769824083652708"
    if (interaction.channel.id !== CHANNEL_ALLOWED) return

    var openai_apiKey = config.openai
    const configuration = new Configuration({
        apiKey: openai_apiKey,
    });

    const openai = new OpenAIApi(configuration);

    interaction.channel.sendTyping()

    let messages = Array.from(await interaction.channel.messages.fetch({
        limit: 5,
        before: interaction.id
    }))

    messages = messages.map(m => m[1])
    messages.unshift(interaction)

    let users = [...new Set([...messages.map(m => m.member.displayName), client.user.username])]
    let lastUser = users.pop()
    let prompt = `From now on, Your name is Yume (Yu-me pronounced in japanese term). Yume is a 17 years old girl who is playful, helpful, creative, clever, and very friendly. The following is a conversation between ${users.join(', ')}, and ${lastUser}. \n\n`

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        prompt += `${m.member.displayName}: ${m.content}\n`
    }
    prompt += `${client.user.username}:`
    console.log("prompt:", prompt)

    async function getGptResponse() {
        try {
            const gptSend = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: 'Your name is Yume',
                stop: ['\n'],
                max_tokens: 500,
                temperature: 0.5
            });
            return gptSend;
        } catch (err) {
            console.error(err);
        }
    }

    const response = getGptResponse().then(res => res.data.choices[0].text)
    console.log(response)
    await interaction.channel.send(response)
})


