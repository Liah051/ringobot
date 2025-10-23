// 文字列入力の検証例
function validateString(input) {
    return typeof input === 'string' && input.trim().length > 0; // 空文字列でないかをチェック
}

// ユーザー入力のサニタイズ処理例（例：HTMLエスケープ）
function sanitizeInput(input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = {
  name: 'messageCreate', // イベント名
  execute(message,client) {
    const userInput = message.content; // ユーザーからの入力を取得
    
    if (validateString(userInput)) {
        const allowedBotIds = ['1204268421076881408','1361953977016783019'];
        if (message.author.bot && !allowedBotIds.includes(message.author.id)) return;
      
        const userId = message.author.id;
      
        const sanitizedInput = sanitizeInput(userInput); // 入力をサニタイズ
        const prefix = 'r.';
        // MessageCreate イベントの処理を記述

        if (!message.content.startsWith(prefix) || message.channel.type === 'dm') return;

      
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) {
            message.reply('指定されたコマンドは存在しません。正しいコマンドを入力してください。');
        }
        else{

          try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('コマンドを実行中にエラーが発生しました！');
            }
        }
    }
  }
};
