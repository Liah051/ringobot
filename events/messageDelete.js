const { EmbedBuilder, Events } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guild || (!message.content && message.attachments.size === 0)) return;

    const embed = new EmbedBuilder()
      .setColor("#ff0000") // 🔴 赤色
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`:wastebasket: <@${message.author.id}> が送信したメッセージが <#${message.channel.id}> で削除されました。`)
      .setFooter({
        text: `${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    if (message.content) {
      embed.addFields({
        name: "📝 削除されたメッセージ",
        value: message.content.length > 1024 ? message.content.slice(0, 1021) + "..." : message.content,
      });
    }

    const imageAttachment = message.attachments.find(a => a.contentType?.startsWith("image/"));
    const otherAttachments = message.attachments.filter(a => !a.contentType?.startsWith("image/") || a.id !== imageAttachment?.id);

    if (imageAttachment) {
      embed.setImage(imageAttachment.url);
    }

    if (otherAttachments.size > 0) {
      const fileLinks = otherAttachments.map(a => `[${a.name}](${a.url})`).join("\n");
      embed.addFields({
        name: "📎 添付ファイル",
        value: fileLinks.length > 1024 ? fileLinks.slice(0, 1021) + "..." : fileLinks,
      });
    }

    const logChannelId = "1185138165028225095"; // ← ここを置き換えてください
    const logChannel = message.guild.channels.cache.get(logChannelId);

    if (logChannel?.isTextBased()) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.warn("ログチャンネルが見つからないか、テキストチャンネルではありません。");
    }
  },
};
