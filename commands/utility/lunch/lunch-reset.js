const fs = require('fs');

module.exports = {
    name: 'lunch-reset',
    description: 'ユーザーのメニューをリセットします。',
    category: '昼ごはん',
    execute(message, args) {
        try {
            const menuFilePath = 'database/lunch.json';
            const originMenuPath = 'database/lunch-origin.json';

            // ユーザーIDを取得
            let userId = message.author.id;
            let userName = message.author.globalName;
            let isNewUser = false;

            // アリスの場合
            if (message.author.id === '1204268421076881408' && args.length > 0) {
                
                    userId = args.pop();
                    const user = message.guild.members.cache.get(userId);
                    if (user) {
                        userName = user.user.globalName;
                    }
                
            }

            // オリジナルメニューファイルを読み込む
            const originMenuData = fs.readFileSync(originMenuPath, 'utf8');
            const originMenu = JSON.parse(originMenuData);

            // メニューに新しいユーザーデータを上書き
            const menuData = fs.readFileSync(menuFilePath, 'utf8');
            const menu = JSON.parse(menuData);

            let user = menu.users.find(user => user.id === userId);

            if (user) {
                // ユーザーが見つかった場合はメニューを上書き
                user.choices = originMenu.choices; // オリジナルメニューで上書き
            } else {
                message.reply(`${userName}さんは新規ユーザーのようですね。`);
                // 新しいユーザーデータを作成
                user = {
                    id: userId,
                    choices: originMenu.choices, // オリジナルメニューで上書き
                };
                isNewUser = true;
                // メニューに新しいユーザーデータを追加
                menu.users.push(user);
            }

            // 更新されたメニューをファイルに書き込む
            fs.writeFileSync(menuFilePath, JSON.stringify(menu, null, 2));

            message.reply(`${userName}さんのメニューが${isNewUser ? '新しく作成されました' : 'リセットされました'}。`);
        } catch (error) {
            console.error('メニューのリセット中にエラーが発生しました:', error);
            message.reply('メニューのリセット中にエラーが発生しました。');
        }
    },
};
