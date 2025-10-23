const fs = require('fs');
const path = require('path');
const roles = require('../database/roles.json');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const roleId = roles[interaction.customId];
    if (!roleId) return; // roles.json に存在しないボタンなら無視

    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({ content: 'ロールが見つかりません。', ephemeral: true });
    }

    const member = interaction.member;

    
    if (member.roles.cache.has(roleId)) {
      // すでにロールを持っているなら、何もせずに返信だけする
      return interaction.reply({ content: `あなたが${role.name}であるのはもうわかってますから！`, ephemeral: true });
    } else {
      await member.roles.add(roleId);
      return interaction.reply({ content: `あなたは${role.name}です！\nチャンネル一覧を見てください。`, ephemeral: true });
    }
  }
};
