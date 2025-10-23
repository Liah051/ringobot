const fs = require('fs');

module.exports = {
    name: 'lunch-add',
    description: 'メニューを追加します。',
    category: '昼ごはん',
    execute(message, args) {
      if(args.length === 0){
        message.reply('追加するメニューを書いてください\n例：`r.lunch-add ラーメン うどん`');
        return
      }
        try {
            const menuFilePath = 'database/lunch.json';
            const originMenuPath = 'database/lunch-origin.json';
            
            // メニューファイルの読み込み
            const menuData = fs.readFileSync(menuFilePath, 'utf8');
            const menu = JSON.parse(menuData);
            
            // オリジナルメニューファイルを読み込む
            const originMenuData = fs.readFileSync(originMenuPath, 'utf8');
            const originMenu = JSON.parse(originMenuData);

            // ユーザーIDを取得
            let userId = message.author.id;
            let userName = message.author.globalName;
            let Length = args.length;
            
          
            //アリスの場合
            if (message.author.id === '1204268421076881408' && args.length > 0) {
              if (args.length === 1){
                userId = args[args.length - 1];
                const User = message.guild.members.cache.get(userId);
                message.channel.send(`${User}、追加するメニューを書いてください\n例：\`r.lunch-add ラーメン うどん\``);
                return;
              }else{
                userId = args[args.length - 1];
                const User = message.guild.members.cache.get(userId);
                userName = User.user.globalName;
                Length = args.length - 1; 
              }
            }

            // ユーザーごとのデータを検索
            let user = menu.users.find(user => user.id === userId);
          
            

            if (!user) {
                // 新規ユーザーの場合
                message.reply(`${userName}さんは新規ユーザーのようですね。\n新しくメニューの一覧を作成しました。`);

                // 新しいユーザーデータを作成
                user = {
                    id: userId,
                    choices: originMenu.choices.concat(args.slice(0, Length)), // 新規ユーザーの場合は引数の選択肢を追加
                };

                // メニューに新しいユーザーデータを追加
                menu.users.push(user);
            }else {

                // 既存ユーザーの選択肢に新しいアイテムを追加
                user.choices = user.choices.concat(args.slice(0, Length));
            }
            // 新しいアイテムを追加
            const newItem = args.slice(0, Length).join('、');


            // 更新されたメニューをファイルに書き込む
            fs.writeFileSync(menuFilePath, JSON.stringify(menu, null, 2));

            message.reply(`${userName}さんのメニューの一覧に新しいメニュー ${newItem} が追加されました。`);
        } catch (error) {
            console.error('メニューの更新中にエラーが発生しました:', error);
            message.reply('メニューの更新中にエラーが発生しました。');
        }
    },
};
