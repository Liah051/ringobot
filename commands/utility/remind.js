const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remind',
    description: '指定した時間後に自分にメンションで通知をします。\n例:`r.remind 1d3h30m20s 寝る時間です`  (1日3時間30分20秒後に 寝る時間です って返信させる)',
    execute(message, args) {
        const authorId = message.author.id;
        let userId = message.author.id;
        let userName = message.author.globalName;
        const alice = '1204268421076881408'
        // アリスの場合は最後の引数を取り出して userName に設定
        if (message.author.id === '1204268421076881408' && args.length > 0) {
            userId = args.pop(); // 最後の引数を取り出す
            const user = message.guild.members.cache.get(userId);
            if (user) {
                userName = user.user.globalName;
            }
        }
      
        const User = message.guild.members.cache.get(userId);
     
        if (!args[0] && authorId !== alice) {
            return message.reply('時間を指定してください。');
        }else if (!args[0] && authorId === alice) {
            return message.channel.send(`${User}、時間を指定してください。`);
        }
        

        // 入力された文字列を正規表現で解析して時間、分、秒に変換
        const timeRegex = /(\d+d)?(\d+h)?(\d+m)?(\d+s)?/i;
        const matches = args[0].match(timeRegex);

        let totalSeconds = 0;

        if (matches) {
            const days = matches[1] ? parseInt(matches[1]) * 24 * 3600 : 0;
            const hours = matches[2] ? parseInt(matches[2]) * 3600 : 0;
            const minutes = matches[3] ? parseInt(matches[3]) * 60 : 0;
            const seconds = matches[4] ? parseInt(matches[4]) : 0;

            totalSeconds = days + hours + minutes + seconds;
        }

        if (totalSeconds === 0 && authorId !== alice) {
            return message.reply('時間を正しく指定してください。');
        }else if (totalSeconds === 0 && authorId === alice) {
            return message.channel.send(`${User}、時間を正しく指定してください。`);
        }

        const reminderMessage = args.slice(1).join(' ');

        if (!reminderMessage && authorId !== alice) {
            return message.reply('通知するメッセージを入力してください。');
        }else if (!reminderMessage && authorId === alice) {
            return message.reply(`${User}、通知するメッセージを入力してください。`);
        }

        setTimeout(() => {
          if(authorId !== alice){
            message.reply(`${message.author}、${reminderMessage}`);
          }else{
            message.channel.send(`${User}、${reminderMessage}`);
          }
        }, totalSeconds * 1000); // 秒をミリ秒に変換

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('リマインダーが設定されました')
            .addFields(
                { name: '時間', value: `約 ${args[0]} 後`, inline: false },
                { name: 'メッセージ', value: reminderMessage, inline: false }
            )
            .setTimestamp();


        message.channel.send({ embeds: [embed] });
      
  },
    
  category:'便利機能'
};
