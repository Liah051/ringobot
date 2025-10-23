const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'setup-role',
  description: 'ロール選択用ボタンメッセージを送信します',
  hidden: true,
  execute(message) {
    const userId = message.author.id;
    const administrator = '613611891054608404'
    if (userId != administrator){
      return message.reply('管理者権限がありません。');
    }
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('member')
        .setLabel('⭕読むよ')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('gokuakunin')
        .setLabel('❌読まねぇよ')
        .setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({
      content: '今度こそルールを読めよ！',
      components: [row]
    });
  }
};
