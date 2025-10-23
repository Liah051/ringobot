const fs = require('fs');

module.exports = {
    name: 'lunch-menu',
    description: 'メニューの一覧を表示します。',
    category: '昼ごはん',
    execute(message, args) {
        try {
            let userId = message.author.id;
            let userName = message.author.globalName;

            // アリスの場合は最後の引数を取り出して userName に設定
            if (message.author.id === '1204268421076881408' && args.length > 0) {
                userId = args.pop(); // 最後の引数を取り出す
                const user = message.guild.members.cache.get(userId);
                if (user) {
                    userName = user.user.globalName;
                }
            }

            // ユーザーメニューファイルを読み込む
            const userMenuFilePath = 'database/lunch.json';
            const userMenuData = fs.readFileSync(userMenuFilePath, 'utf8');
            const userMenu = JSON.parse(userMenuData);
          
            // オリジナルメニューファイルを読み込む
            const originMenuPath = 'database/lunch-origin.json';
            const originMenuData = fs.readFileSync(originMenuPath, 'utf8');
            const originMenu = JSON.parse(originMenuData);

            // ユーザーごとの選択肢を取得
            const user = userMenu.users.find(user => user.id === userId);
            let userChoices;

            if (!user) {
                message.reply(`${userName}さんは新規ユーザーのようですね。\n新しくメニューの一覧を作成しました。`);
                // 新しいユーザーデータを作成
                const newUser = {
                    id: userId,
                    choices: originMenu.choices,
                };

                // メニューに新しいユーザーデータを追加
                userMenu.users.push(newUser);

                // 更新されたメニューをファイルに書き込む
                fs.writeFileSync(userMenuFilePath, JSON.stringify(userMenu, null, 2));

                userChoices = newUser.choices;
            } else {
                userChoices = user.choices;
            }

            // ユーザーごとの選択肢が存在する場合はそれを表示
            if (userChoices.length > 0) {
                const userMenuList = userChoices.join('\n'); // ユーザーごとのメニューリストを改行区切りの文字列に変換
                message.channel.send(`${userName}さんのメニュー:\n${userMenuList}`);
            } else {
                message.reply('あなたのメニューは空っぽです。');
            }
        } catch (error) {
            console.error('ユーザーメニューの取得中にエラーが発生しました:', error);
            message.reply('ユーザーメニューの取得中にエラーが発生しました。');
        }
    },
};
