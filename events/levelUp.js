const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const levelFilePath = path.join(__dirname, '../database/level.json');
const rolesFilePath = path.join(__dirname, '../database/roles.json');

// XP の範囲
const MIN_XP = 5;
const MAX_XP = 10;

// XPに対応するロール（レベル → ラベル）
const levelRoles = {
  1: 'kuuki',
  3: 'invisible',
  5: 'itanoka',
  8: 'little',
  11: 'new',
  15: 'talent',
  20: 'osyaberi',
  20: 'superman',
  21: 'noisy',
  23: 'construction',
  26: 'plane',
  28: 'explotion'
};

// 対象チャンネル
const allowedChannels = [
  "1371050032119287895", "1371050032119287896",
  "1371458502442352682", "1371050032366878801",
  "1371050032366878800", "1371363620327260201",
  "1371050032568074351", "1371050032568074352"
];

// レベルアップに必要なXPを返す関数
function getXpForNextLevel(level) {
  if (level <= 10) {
    return 5 * level;
  }
  if (11 <= level && level <= 26) {
    return 10 * Math.floor(Math.sqrt(Math.pow(level, 2) - 100));
  }
  if (27 <= level) {
    return 10 * (level - 3);
  }
}

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || allowedChannels.includes(message.channel.id)) return;

    // レベルデータ読み込み
    let levelData;
    try {
      const rawData = fs.readFileSync(levelFilePath);
      levelData = JSON.parse(rawData);
    } catch (err) {
      console.error('レベルデータの読み込みに失敗しました:', err);
      return;
    }

    // roles.json 読み込み
    let roleData = {};
    try {
      const rawRoleData = fs.readFileSync(rolesFilePath);
      roleData = JSON.parse(rawRoleData);
    } catch (err) {
      console.error('ロールデータの読み込みに失敗しました:', err);
    }

    const userId = message.author.id;
    let user = levelData.users.find(u => u.id === userId);

    if (!user) {
      user = { id: userId, level: 0, xp: 0 };
      levelData.users.push(user);
    }

    // XP をランダムで加算
    const xpGain = Math.floor(Math.random() * (MAX_XP - MIN_XP + 1)) + MIN_XP;
    user.xp += xpGain;

    const xpNeeded = getXpForNextLevel(user.level);
    if (user.xp >= xpNeeded) {
      user.xp = 0;
      user.level++;

      // 🎉 レベルアップ通知
      const levelUpChannel = message.client.channels.cache.get('1185133078176346133');
      if (levelUpChannel) {
        levelUpChannel.send(`🎉 ${message.author} さんのレベルが ${user.level - 1} から ${user.level} に上がりました！`);
      } else {
        console.warn('レベルアップ通知チャンネルが見つかりませんでした。');
      }

      // 🏅 ロール付与
      const roleLabel = levelRoles[user.level];
      if (roleLabel && roleData[roleLabel]) {
        const roleId = roleData[roleLabel];
        const guild = message.guild;

        try {
          const member = await guild.members.fetch(userId);
          if (!member.roles.cache.has(roleId)) {
            await member.roles.add(roleId);
            console.log(`${message.author.tag}さんがLv.${user.level}になったのでロール"${roleLabel}"を付与しました！`);
          }
        } catch (err) {
          console.error('ロールの付与に失敗しました:', err);
        }
      }
    }

    // ファイルに保存
    try {
      fs.writeFileSync(levelFilePath, JSON.stringify(levelData, null, 2));
    } catch (err) {
      console.error('レベルデータの保存に失敗しました:', err);
    }
  }
};
