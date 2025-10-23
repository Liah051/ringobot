const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const LOG_CHANNEL_ID = '1185133078176346133'; // 通知を送りたいチャンネルID

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    const rolesPath = path.join(__dirname, '..', 'database', 'roles.json');
    const roleData = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));

    const targetRoles = ['daiakunin', 'gokuakunin', 'akunin', 'member', 'obutu', 'empty'];
    const targetRoleIds = targetRoles.map(name => roleData[name]);

    const rolePairs = targetRoles.map(target => {
      const others = targetRoles.filter(r => r !== target).map(r => roleData[r]);
      return {
        roleIdToCheck: roleData[target],
        roleIdToRemove: others,
      };
    });

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    const user = newMember.user;
    const nickname = newMember.nickname || user.username;
    const logChannel = newMember.guild.channels.cache.get(LOG_CHANNEL_ID);
    const notifiedRoleIds = new Set();

    // 対象ロールの付与チェックと削除＆通知
    for (const { roleIdToCheck, roleIdToRemove } of rolePairs) {
      if (newRoles.has(roleIdToCheck) && !oldRoles.has(roleIdToCheck)) {
        for (const roleId of roleIdToRemove) {
          await newMember.roles.remove(roleId).catch(console.error);
        }

        const embed = new EmbedBuilder()
          .setAuthor({
            name: nickname,
            iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }),
          })
          .setDescription(`**<@${user.id}> にロールが付与されました**`)
          .addFields({
            name: 'ロール:',
            value: `:white_check_mark: <@&${roleIdToCheck}>`,
            inline: false
          })
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
          .setColor('Green')
          .setFooter({
            text: `${newMember.guild.name} `,
            iconURL: newMember.guild.iconURL({ dynamic: true })
          })
          .setTimestamp();

        if (logChannel?.isTextBased()) {
          await logChannel.send({ embeds: [embed] });
        }

        notifiedRoleIds.add(roleIdToCheck);
      }
    }

    // その他の新規ロール（通知対象に含まれていない）の通知
    const addedRoles = newRoles.filter(role => 
      !oldRoles.has(role.id) &&
      !notifiedRoleIds.has(role.id) &&
      !role.managed
    );

    if (addedRoles.size > 0 && logChannel?.isTextBased()) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: nickname,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }),
        })
        .setDescription(`**<@${user.id}> にロールが付与されました**`)
        .addFields({
          name: 'ロール:',
          value: [...addedRoles.values()].map(role => `:white_check_mark: <@&${role.id}>`).join('\n'),
          inline: false
        })
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
        .setColor('Green')
        .setFooter({
          text: `${newMember.guild.name} `,
          iconURL: newMember.guild.iconURL({ dynamic: true })
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }
  }
};
