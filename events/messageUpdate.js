module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    // メッセージが実際に変更された場合のみ
    if (oldMessage.content === newMessage.content) return;

    // 編集されたメッセージのログを記録するチャンネルを取得
    const logChannel = oldMessage.guild.channels.cache.get('1185138165028225095');

    if (logChannel) {
      // メッセージリンクの埋め込み
      const messageLink = `[ページへ移動](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`;

      // ログメッセージの送信
      logChannel.send({
        content: `${newMessage.author.username} がメッセージを編集しました。`,
        embeds: [
          {
            color: 0x00FF00, // 緑色（変更部分）
            author: {
              name: `${newMessage.author.tag}`,
              icon_url: newMessage.author.displayAvatarURL(),
            },
            description: `:pencil2: <@${newMessage.author.id}> が ${newMessage.channel} でメッセージを編集しました。 ${messageLink}`,
            fields: [
              {
                name: '変更前',
                value: `\`\`\`${oldMessage.content || '*内容なし*'}\`\`\``,
                inline: false,
              },
              {
                name: '変更後',
                value: `\`\`\`${newMessage.content || '*内容なし*'}\`\`\``,
                inline: false,
              },
            ],
            footer: {
              text: `${newMessage.guild.name} • ${newMessage.createdAt.toLocaleString()}`,
              icon_url: newMessage.guild.iconURL(), // サーバーのアイコンURLを追加
            },
            timestamp: newMessage.createdAt,
          },
        ],
      });
    }
  },
};
