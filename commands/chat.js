const { Client,GatewayIntentBits } = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { Configuration, OpenAIApi } = require('openai');
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Talk with Yume (text)')
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Input text here to chat with Yume.")
                .setRequired(true)
        ),

    execute: async (interaction) => {

        interaction.reply({content: 'This command is deprecated. Please use @Yume instead', ephemeral: true})
    
        // const client = new Client({
        //     intents: [
        //         GatewayIntentBits.Guilds,
        //         GatewayIntentBits.GuildMessages,
        //         GatewayIntentBits.GuildVoiceStates
        //     ]
        // })

        // interaction.channel.sendTyping()

        // const user = await interaction.guild.members.fetch(interaction.user.id)
        // const message = interaction.options.getString('text')
        
        
        // let messages = Array.from(await interaction.channel.messages.fetch({
        //     limit: 5,
        //     before: interaction.id
        // }))
        
        // messages = messages.map(m=>m[1])
        // messages.unshift(messages)
        
        // let users = [...new Set([...messages.map(m => m.member. displayName), client.user.username])]
        // let lastUser = users.pop()
        // let prompt = `From now on, Your name is Yume (Yu-me pronounced in japanese term). Yume is a 17 years old girl who is playful, helpful, creative, clever, and very friendly. The following is a conversation between ${users.join(', ')}, and ${lastUser}.\n\n`

        // for (let i = messages.length - 1; i >= 0; i--) {
        //     const m = messages[i]
        //     console.log(m)
        //     prompt += `Human: ${m.content}\n`
        //     console.log("prompt_fisrt:", prompt)
        // }

        // prompt += `${user.user.username}:${message}`
        // console.log("prompt:", prompt)
        
        // var openai_apiKey = config.openai
        
        // const configuration = new Configuration({
        //     apiKey: openai_apiKey,
        // });

        // const openai = new OpenAIApi(configuration);

        // //prompt += `${user.user.username}:${message}\nYume:`
        
        // const response = await openai.createCompletion({
        //     prompt,
        //     model: 'text-davinci-003',
        //     stop: ['\n'],
        //     max_tokens: 500,
        //     temperature: 0.5
        // });

        // let text = response.data.choices[0].text
        // //console.log(text)
        // text += " "
        // await interaction.channel.send(text)

        // var ready = true;
        // console.log(user.user.username)
        // async function getGptResponse() {
        //     try {
        //         const gptSend = await openai.createCompletion({
        //             model: 'text-davinci-003',
        //             prompt: `From now on, Your name is Yume (Yu-me pronounced in japanese term). Yume is a 17 years old girl who is playful, helpful, creative, clever, and very friendly. The following is a conversation between ${user.user.username} and Yume.
        //             ${user.user.username}:${message}
        //             AI: `,
        //             stop: [`${user.user.username}:`, " AI:"],
        //             max_tokens: 500,
        //             temperature: 0.5
        //         });
        //         return gptSend;
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }

        // const inVC = new EmbedBuilder()
        //     .setAuthor({ name: "Yume", iconURL: config.icon })
        //     .setDescription("**You need to be in a Voice Channel**")
        //     .setColor(0xFF9933)

        // if (ready == true) {
        //     ready = false;
        //     const gptResponse = await getGptResponse();

        //     console.log(`${message}`);
        //     console.log(`${gptResponse.data.choices[0].text}`);

        //     const text = gptResponse.data.choices[0].text;
        //     const message_sent = new EmbedBuilder()
        //         .setAuthor({ name: "Yume", iconURL: config.icon })
        //         .setDescription(`**${text}**`)
        //         .setColor(0xFF9933)

        //     await interaction.editReply({embeds: [message_sent]})
        // }
    }
}