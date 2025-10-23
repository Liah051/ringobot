const fs = require('fs');

module.exports = {
    name: 'lunch',
    description: '今日買う昼ごはんを決めます。',
    category: '昼ごはん',
    execute(message, args) {
        try {
            // chooseLunchを実行
            this.chooseLunch(message, args);
        } catch (error) {
            console.error('メニューリストの読み込み中にエラーが発生しました:', error);
            message.reply('メニューリストの読み込み中にエラーが発生しました。');
        }
    },
    getDefaultChoices() {
        // デフォルトの選択肢を取得する関数
        const originMenuData = fs.readFileSync('database/lunch-origin.json');
        const originMenu = JSON.parse(originMenuData);
        return originMenu.choices;
    },
    chooseLunch(message, args) {
        // ユーザーごとのメニューを選択する関数
        const userMenuFilePath = 'database/lunch.json';
        const userMenuData = fs.readFileSync(userMenuFilePath, 'utf8');
        const userMenu = JSON.parse(userMenuData);

        let userId = message.author.id;
        let userName = message.author.globalName;

        // アリスの場合、引数を参照してユーザーIDを設定
        if (message.author.id === '1204268421076881408' && args.length > 0) {
            userId = args.pop();
            const user = message.guild.members.cache.get(userId);
            if (user) {
                userName = user.user.globalName;
            }
        }

        // ユーザーごとのメニューを取得
        const user = userMenu.users.find(user => user.id === userId);
        const choices = user?.choices || this.getDefaultChoices();

        // 新規ユーザーの場合
        if (!user) {
            message.reply(`${userName}さんは新規ユーザーのようですね。\n新しくメニューの一覧を作成しました。`);
            userMenu.users.push({
                id: userId,
                choices: this.getDefaultChoices(),
            });
            fs.writeFileSync(userMenuFilePath, JSON.stringify(userMenu, null, 2), 'utf8');
        }

        // 空のメニューの場合
        if (choices.length === 0) {
            return message.reply('あなたのメニューは空っぽです。');
        }

        // ランダムにメニューを選択して送信
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        message.channel.send(`今日の昼ごはんは${randomChoice}です`);
    },
};
