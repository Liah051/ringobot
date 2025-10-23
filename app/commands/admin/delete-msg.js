module.exports = {
    name: 'dm',
    description: '指定した数のメッセージを削除します。\n例:`r.dm 3`  (メッセージを３件削除する)',
    execute(message, args) {
        const userId = message.author.id;
        const alice = '1204268421076881408'
        const administrator = '613611891054608404'
        // 引数がない場合や引数が数字でない場合のエラーハンドリング
        if (!args[0] || isNaN(args[0])) {
            return message.reply('削除するメッセージ数を数字で指定してください。');
        }
        const Count = parseInt(args[0], 10);

        // 指定された数値を整数に変換して取得
        let deleteCount;
        if (userId ===alice){
          deleteCount = parseInt(args[0], 10) + 3;
        }else if (userId === administrator){
          deleteCount = parseInt(args[0], 10) + 1;
        }else{
          deleteCount = 0;
        }
        // 指定された数だけメッセージを削除する
        if (deleteCount > 0){
          message.channel.bulkDelete(deleteCount)
              .then(deletedMessages => {
                const response = `**${Count}** 件のメッセージを削除しました。`;
                  message.channel.send(response)
                      .then(msg => {
                          // 3秒後に削除されるように設定
                          setTimeout(() => {
                              msg.delete();
                          }, 3000);
                      });
              })
              .catch(err => {
                  console.error('メッセージの削除中にエラーが発生しました:', err);
                  if (err.code === 50034) {
                      // 14日以上前のメッセージは削除できない場合のエラー
                      message.reply('14日より前のメッセージは削除できません。');
                  } else {
                      message.reply('メッセージの削除中にエラーが発生しました。');
                  }
              });
        }else{
          message.reply('管理者権限がありません。');
        }
        
    },
    category: '管理者専用'
};
