const { Client, Events, GatewayIntentBits, Collection } = require("discord.js")
const config = require("./config.json")
const { OpenAIApi, Configuration } = require("openai")

const configs = new Configuration({
    apiKey: config.openai
})

const openai = new OpenAIApi(configs)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        //GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})
module.exports = {
    client,
    openai
}
client.commands = new Collection();

require("./handler/loader")(client);
client.login(config.token)

const BOT_CHANNEL = "1013769824083652708"
const PAST_MESSAGES = 5

// client.on(Events.MessageCreate, async (message) => {
//     if (message.author.bot) return

//     if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return

//     if (!message.mentions.has(client.user.id)) return

//     message.channel.sendTyping()

//     let messages = Array.from(await message.channel.messages.fetch({
//         limit: PAST_MESSAGES,
//         before: message.id
//     }))
//     messages = messages.map(m=>m[1])
//     messages.unshift(message)

//     let users = [...new Set([...messages.map(m=> m.member.displayName), client.user.username])]

//     let lastUser = users.pop()

//     let prompt = `From now on, Your name is Yume (Yu-me pronounced in japanese term). Yume is a 17 years old girl who is playful, helpful, creative, clever, and very friendly. The following is a conversation between ${users.join(', ')}, and ${lastUser}. \n\n`

//     for (let i = messages.length - 1; i >= 0; i--) {
//         const m = messages[i]
//         prompt += `${m.member.displayName}: ${m.content}\n`
//     }
//     prompt += `${client.user.username}:`
//     console.log("prompt:", prompt)

//     const response = await openai.createCompletion({
//         prompt,
//         model: "text-davinci-003",
//         max_tokens: 500,
//         stop: ["\n"]
//     })

//     console.log("response", response.data.choices[0].text)
//     await message.channel.send(response.data.choices[0].text)
// })