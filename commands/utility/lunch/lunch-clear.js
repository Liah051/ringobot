const fs = require('fs');

module.exports = {
    name: 'lunch-clear',
    description: 'メニューをすべて削除します。',
    category: '昼ごはん',
    execute(message, args) {
        try {
            let userId = message.author.id;
            let userName = message.author.globalName;

            // アリスの場合、最後の引数がユーザーIDとして扱われる
            if (message.author.id === '1204268421076881408' && args.length > 0) {
                userId = args[args.length - 1];
                const user = message.guild.members.cache.get(userId);
                userName = user.user.globalName;
                args.pop(); // ユーザーIDを削除
            }

            const userMenuFilePath = 'database/lunch.json';
            const originMenuPath = 'database/lunch-origin.json';

            // ユーザーメニューファイルを読み込む
            const userMenuData = fs.readFileSync(userMenuFilePath, 'utf8');
            const userMenu = JSON.parse(userMenuData);

            // オリジナルメニューファイルを読み込む
            const originMenuData = fs.readFileSync(originMenuPath, 'utf8');
            const originMenu = JSON.parse(originMenuData);

            // ユーザーごとの選択肢を取得
            let user = userMenu.users.find(user => user.id === userId);

            if (!user) {
                message.reply(`${userName}さんは新規ユーザーのようですね。\n新しくメニューの一覧を作成しました。`);
                // 新しいユーザーデータを作成
                user = {
                    id: userId,
                    choices: [],
                };

                // メニューに新しいユーザーデータを追加
                userMenu.users.push(user);
            } else {
                // 既存の選択肢を空にする
                user.choices = [];
            }

            // 更新されたメニューをファイルに書き込む
            fs.writeFileSync(userMenuFilePath, JSON.stringify(userMenu, null, 2));

            message.reply(`${userName}さんのメニューをすべて削除しました。`);
        } catch (error) {
            console.error('メニューの削除中にエラーが発生しました:', error);
            message.reply('メニューの削除中にエラーが発生しました。');
        }
    },
};
