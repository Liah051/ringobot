const { EmbedBuilder, Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor("#ff5555") // 赤色
      .setDescription(`<@${member.user.id}> がサーバーを脱退しました`)
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `${member.guild.name}`,
        iconURL: member.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    // 送信したいチャンネルのIDをここに指定（例: logs チャンネルなど）
    const channelId = "1185133078176346133"; // ← ここを変更してください
    const channel = member.guild.channels.cache.get(channelId);

    if (channel) {
      await channel.send({ embeds: [embed] });
    } else {
      console.warn("指定されたチャンネルが見つかりませんでした。");
    }
  },
};
