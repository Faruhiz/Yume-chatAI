const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice')
const { Configuration,OpenAIApi } = require('openai');
const fs = require('fs')
const { join } = require('path')
const readline = require('readline');
const voice = require('elevenlabs-node')
const Speaker = require('speaker')
const wav = require('wav')
const {
    Writable
} = require('stream');
const {
    exec
} = require('child_process');
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('talk')
        .setDescription('Talk with Yume')
        .addStringOption(option =>
            option
            .setName("text")
            .setDescription("Input text here to chat with Yume.")
            .setRequired(true)
        ),

    execute: async (interaction) => {
        await interaction.deferReply()

        var ffmpeg_path = 'ffmpeg.exe'
        const elapiKey = config.elapiKey
        const voiceID = config.voice_id;
        const fileName = 'path/to/output.mp3';
        var stability = 1.00
        var similarityBoost = 0.70
        var openai_apiKey = config.openai
        const message = interaction.options.getString('text')

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const configuration = new Configuration({
            apiKey: openai_apiKey,
        });

        const openai = new OpenAIApi(configuration);

        var ready = true;
        async function getGptResponse(VARmessage) {
            try {
                const gptSend = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                            role: "system",
                            content: "This is how a toxic entitled evil female streamer responded in a conversation. She would respond in a toxic and rude manner. She would talk about the message and would elaborate on it as well as share some of her experiences if possible. She would also go on a tangent if possible."
                        },
                        {
                            role: "user",
                            content: `This is how a kind, playful female responded in a conversation.Her name is Yu-me (Yu-me) pronounced in japanese term. She would respond in a kind and polite manner. She would talk about the message and would elaborate on it as well as share some of her experiences if possible. She would rarely go on a tangent if possible. : ${VARmessage}`
                        }
                    ],
                });
                return gptSend;
            } catch (err) {
                console.error(err);
            }
        }

        const inVC = new EmbedBuilder()
            .setAuthor({
                name: "Yume",
                iconURL: config.icon
            })
            .setDescription("**You need to be in a Voice Channel**")
            .setColor(0xFF9933)

        const message_sent = new EmbedBuilder()
            .setAuthor({
                name: "Yume",
                iconURL: config.icon
            })
            .setDescription("**Message sent successfully!**")
            .setColor(0xFF9933)

        if (!interaction.member.voice.channel) return interaction.editReply({
            embeds: [inVC],
            ephemeral: true
        })

        if (ready == true) {
            ready = false;
            const gptResponse = await getGptResponse(message);
            console.log(`${message}`);
            console.log(`${gptResponse.data.choices[0].message.content}`);
            const text = gptResponse.data.choices[0].message.content;
            voice.textToSpeechStream(elapiKey, voiceID, text, stability, similarityBoost).then(async res => {
                // console.log('res:', res);
                res.pipe(fs.createWriteStream(fileName));
                res.on('error', err => {
                    console.error(err);
                });
                res.on('end', async () => {
                    try {
                        const player = createAudioPlayer()
                        const connection = await joinVoiceChannel({
                            channelId: interaction.member.voice.channel.id,
                            guildId: interaction.guildId,
                            adapterCreator: interaction.guild.voiceAdapterCreator,
                            selfDeaf: true,
                        }).subscribe(player)
                        await interaction.editReply({embeds: [message_sent], ephemeral: true })
                        player.play(createAudioResource(join(__dirname,'../path/to/output.mp3')))
                        

                    } catch(err) {
                        console.log(err)
                    }
                })
            })
        }
        
    }
}