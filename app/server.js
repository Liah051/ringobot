const { Client, GatewayIntentBits,ButtonBuilder, ActionRowBuilder, ButtonStyle, Partials, ActivityType, SlashCommandBuilder } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.MessageContent, 
            GatewayIntentBits.GuildMessages
           ],
  partials: [Partials.Channel]
});

const fs = require('fs');
const path = require('path');

// コマンドフォルダーのパス
const commandFolders = fs.readdirSync('./commands').filter(folder => fs.lstatSync(`./commands/${folder}`).isDirectory());
// コマンドを格納するMapを初期化
client.commands = new Map();

// イベントフォルダーのパス
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // コマンドを再帰的に読み込む関数
  const loadCommands = (dir, client) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            loadCommands(filePath, client); // ディレクトリの場合は再帰的に読み込む
        }
        else if (file.endsWith('.js')) {
            try {
                const command = require(`./${filePath}`);
                client.commands.set(command.name, command);
            } catch (error) {
               
            }
        }
    }
};

  const commandsDir = './commands';
  loadCommands(commandsDir,client);

  // 他の初期化処理を行う（コマンドの読み込みなど）
  const helpCommand = client.commands.get('help');
  helpCommand.commands = client.commands;
  
  // 各イベントファイルを読み込んで追加する
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  // setPresence.jsを実行する
  const setPresence = require('./settings/setPresence.js');
  setPresence.execute(client);
});


client.buttons = new Map();

const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.customId, button);
}



client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('Bot is online!');
  })
  .catch(error => {
    console.error('Bot login error:', error);
  });

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Discord Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
