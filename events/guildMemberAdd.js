const Canvas = require("canvas");
const path = require("path");
const { AttachmentBuilder ,EmbedBuilder} = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const canvas = Canvas.createCanvas(1024, 450);
    const ctx = canvas.getContext("2d");

    // === 📐 基準位置の変数 ===
    const avatarCenterX = 200;
    const avatarCenterY = 225;
    const avatarRadius = 125;
    const avatarSize = avatarRadius * 2;

    const boxLeftX = 420;
    const usernameBoxY = 150;
    const tagBoxY = 210;

    const welcomeTextY = 100;
    const footerY = 435;
    const memberTextX = avatarCenterX - 70;
    const memberTextY = 420;

    // === 🖼 背景 ===
    const backgroundPath = path.join(__dirname, "pictures", "welcome1.png");
    const background = await Canvas.loadImage(backgroundPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // === 🎀 ピンクの縁線（半透明）===
    ctx.lineWidth = 30;
    ctx.strokeStyle = "rgba(255, 182, 193, 0.6)";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // === 🧑‍🎨 アバター（円形） ===
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png" }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      avatar,
      avatarCenterX - avatarRadius,
      avatarCenterY - avatarRadius,
      avatarSize,
      avatarSize
    );
    ctx.restore();

    // === 🅰 タイトル ===
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("𝓦𝓮𝓵𝓬𝓸𝓶𝓮", canvas.width / 2 + 100, welcomeTextY);

    // === 👤 ユーザー名ボックスと文字 ===
    const username = member.user.globalName;
    ctx.font = "30px sans-serif";
    const usernameWidth = ctx.measureText(username).width;
    const usernamePadding = 40;
    const usernameBoxWidth = Math.max(usernameWidth + usernamePadding, 150);
    
    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(boxLeftX, usernameBoxY, usernameBoxWidth, 50);
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(username, boxLeftX + 20, usernameBoxY + 35);

    // === 🏷 タグボックスと文字（動的幅） ===
    let tag;
    if(member.user.bot){
      tag = `#${member.user.discriminator}`;
    }else{
      tag = `${member.user.username}`;
    }
    ctx.font = "25px monospace";
    const tagWidth = ctx.measureText(tag).width;
    const tagPadding = 30;
    const tagBoxWidth = Math.max(tagWidth + tagPadding, 100);
    
    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(boxLeftX, tagBoxY, tagBoxWidth, 40);
    ctx.fillStyle = "#000";
    ctx.fillText(tag, boxLeftX + 15, tagBoxY + 30);

    // === 🚪 右側の黒いバー ===
    const blackBarX = 420;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(blackBarX, footerY - 70, canvas.width - blackBarX - 15, 70);
    ctx.font = "bold 36px serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(`Welcome to ${member.guild}`, blackBarX + (canvas.width - blackBarX) / 2, footerY - 20);

    // === 🔢 メンバー数表示 ===
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#ffffcc";
    ctx.textAlign = "left";
    ctx.fillText(`${member.guild.memberCount}th member !`, memberTextX, memberTextY);

    // === 📨 送信 ===
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "welcome.png" });
    const channel = member.guild.systemChannel;
    if (channel) {
      await channel.send({
        files: [attachment],
      });
      await channel.send(`Hey <@${member.user.id}>,welcome to ${member.guild}!`);
    }
    
    // 👑 自動ロール付与
    if (member.user.bot) {
      // Bot に付けるロール
      const botRole = member.guild.roles.cache.get("1175445204963180544");
      if (botRole) await member.roles.add(botRole);
    } else {
      // 人間に付ける複数ロール
      const roleIds = ["1185163923595472957"]; // 追加したいロールIDをここに！
      const rolesToAdd = roleIds
        .map(id => member.guild.roles.cache.get(id))
        .filter(role => role); // null チェック

      if (rolesToAdd.length > 0) {
        await member.roles.add(rolesToAdd);
      }
    }
    
    // === 📘 Embed 送信処理 ===
    const logChannelId = '1185133078176346133'; // 例: '123456789012345678'
    const logChannel = member.guild.channels.cache.get(logChannelId);
    if (logChannel?.isTextBased()) {
      const createdAt = member.user.createdAt;
      const now = new Date();
      const ageMs = now - createdAt;
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      const createdAtString = `<t:${Math.floor(createdAt.getTime() / 1000)}:f>`;
      const createdAtRelative = `<t:${Math.floor(createdAt.getTime() / 1000)}:R>`;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: member.nickname || member.user.username,
          iconURL: member.user.displayAvatarURL({ dynamic: true, size: 32 }),
        })
        .setDescription(`**<@${member.id}> がサーバーに参加しました**`)
        .addFields({
          name: '⏲ アカウントの年齢:',
          value: `${createdAtString}\n${createdAtRelative}`,
        })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }))
        .setFooter({
          text: `${member.guild.name} •`,
          iconURL: member.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }
  },
};