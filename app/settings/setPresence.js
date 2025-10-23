const { ActivityType } = require('discord.js');

module.exports = {
  name: 'setPresence', // 任意のイベント名
  execute(client) {
    // ステータスの設定
    client.user.setPresence({
      activities: [{
        type: ActivityType.Custom,
        name: 'Custom Status', // このnameは無視される
        state: 'サーバーを管理しています',//最初に絵文字を追加するべき
        emoji: {
          name:'',//上で追加した絵文字
        },
      }],
      status: 'online', // 'online', 'idle', 'dnd', 'invisible'
    });
  },
};
