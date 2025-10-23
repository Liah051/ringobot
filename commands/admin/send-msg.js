module.exports = {
    name: 'send-msg',
    description: '指定したメッセージを送信します。\n例:`r.send-msg こんにちは`  (Botに こんにちは と送信させる)',
    category: '管理者専用',
    async execute(message, args) {
        const sendMessage = args.join(' ');
        const userId = message.author.id;
        const administrator = '613611891054608404'
        if (userId != administrator){
          return message.reply('管理者権限がありません。');
        }

        if (!sendMessage) {
            return message.reply('送信するメッセージを入力してください。');
        }

        // コマンドを実行したメッセージを削除
        await message.delete();

        message.channel.send(sendMessage);
    },
};
