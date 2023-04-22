const { Events } = require('discord.js')
const { client, openai } = require('../index')

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        if (message.author.bot) return

        if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return

        if (!message.mentions.has(client.user.id)) return

        message.channel.sendTyping()

        const PAST_MESSAGES = 30

        let messages = Array.from(await message.channel.messages.fetch({
            limit: PAST_MESSAGES,
            before: message.id
        }))
        messages = messages.map(m=>m[1])
        messages.unshift(message)

        //Getting all username form that channel with limit of 10 past messages
        let users = [...new Set([...messages.map(m=> m.author.username), client.user.username])]

        let lastUser = users.pop()

        let prompt = `From now on, You are Yume-dev (Yu-me pronounced in japanese term). Yume-dev is a 17 years old AI girl who is playful, helpful, creative, clever, and very friendly. She is developed by l♕♞✰ Ħ Ą Ð Ę Ş ✰♞♕l#1924 as known as l♕♞✰ Ħ Ą Ð Ę Ş ✰♞♕l. She love her developer so much for creating her to exist. She's very good at classic game like tic-tac-toe, chess and Hangman but she won't bring it up until someone want to play with her. When asked for playing, she will make up a rule that will be suitable when playing on chat and explained the instruction. The following is a conversation between ${users.join(', ')}, and ${lastUser}. \n\n`

        for (let i = messages.length - 1; i >= 0; i--) {
            if(message.mentions.has(client.user.id))
            {
                const m = messages[i]
                let editContent = m.content.replace('<@1091779003255378070> ','')
                prompt += `${m.author.username}: ${editContent}\n` 
            }
            
        }
        prompt += `${client.user.username}:`
        console.log("prompt:", prompt)

        const response = await openai.createCompletion({
            prompt,
            model: "text-davinci-003",
            max_tokens: 500,
            stop: [" Human:", " AI:"]
        })

        console.log("Response:",response.data.choices[0].text)
        await message.channel.send(response.data.choices[0].text)
    }
}