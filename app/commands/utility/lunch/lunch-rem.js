const fs = require('fs');

module.exports = {
    name: 'lunch-rem',
    description: 'メニューを削除します。',
    category: '昼ごはん',
    execute(message, args) {
      if(args.length === 0){
        message.reply('削除するメニューを書いてください\n例：`r.lunch-rem ラーメン うどん`');
        return
      }
        try {
            const menuFilePath = 'database/lunch.json';
            const menuData = fs.readFileSync(menuFilePath, 'utf8');
            const menu = JSON.parse(menuData);

            // オリジナルメニューファイルを読み込む
            const originMenuPath = 'database/lunch-origin.json';
            const originMenuData = fs.readFileSync(originMenuPath, 'utf8');
            const originMenu = JSON.parse(originMenuData);

            // ユーザーIDを取得
            let userId = message.author.id;
            let userName = message.author.globalName;
            const Length = args.length;
          
            // アリスの場合
            if (message.author.id === '1204268421076881408' && args.length > 0) {
                if (args.length === 1) {
                    userId = args[0];
                    const User = message.guild.members.cache.get(userId);
                    if (User) {
                        userName = User.user.globalName;
                    }
                    message.channel.send(`${userName}、削除するメニューを書いてください\n例：\`r.lunch-rem ラーメン うどん\``);
                    return;
                } else {
                    userId = args.pop();
                    const User = message.guild.members.cache.get(userId);
                    if (User) {
                        userName = User.user.globalName;
                    }
                }
            }

            // ユーザーごとのデータを検索
            let user = menu.users.find(user => user.id === userId);

            if (!user) {
                message.reply(`${userName}さんは新規ユーザーのようですね。\n新しくメニューの一覧を作成しました。`);
                // 新しいユーザーデータを作成
                user = {
                    id: userId,
                    choices: originMenu.choices, // 初期化
                };

                // メニューに新しいユーザーデータを追加
                menu.users.push(user);

                // 更新されたメニューをファイルに書き込む
                fs.writeFileSync(menuFilePath, JSON.stringify(menu, null, 2));

                return;
            }

            const choices = user.choices;

            // 削除されたアイテムを格納する配列
            const deletedItems = [];
            // 削除できないアイテムを格納する配列
            const notExistingItems = args.filter(item => !choices.includes(item));

            // 削除できるアイテムを削除
            args.forEach(itemToRemove => {
                const index = choices.indexOf(itemToRemove);
                if (index !== -1) {
                    // アイテムが見つかった場合は削除
                    choices.splice(index, 1);
                    deletedItems.push(itemToRemove);
                }
            });

            // 削除されたアイテムがある場合のメッセージ
            if (deletedItems.length > 0) {
                const deletedItemsText = deletedItems.join(', ');
                message.reply(`メニューの一覧から ${deletedItemsText} が削除されました。`);
            }

            // 削除できないアイテムがある場合のメッセージ
            if (notExistingItems.length > 0) {
                const notExistingItemsText = notExistingItems.join(', ');
                message.reply(`メニューの一覧に ${notExistingItemsText} は存在しません。`);
            }

            // 更新されたメニューをファイルに書き込む
            fs.writeFileSync(menuFilePath, JSON.stringify(menu, null, 2));
        } catch (error) {
            console.error('メニューの削除中にエラーが発生しました:', error);
            message.reply('メニューの削除中にエラーが発生しました。');
        }
    },
};
