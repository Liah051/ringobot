// ヘルプコマンド
module.exports = {
    name: 'help',
    description: '利用可能なコマンド一覧を表示します。',
    hidden: false,
    execute(message, args) {
        const data = [];

        // コマンド一覧を取得（this.commands が未定義の場合は client.commands を使用）
        const commandsCollection = this.commands || message.client.commands;

        // コレクションから配列に変換（Map 形式の場合が多いため）
        const commands = Array.isArray(commandsCollection)
            ? commandsCollection
            : Array.from(commandsCollection.values());

        // hidden: true のコマンドを除外してカテゴリごとにグループ化
        const categories = {};
        commands.forEach(command => {
            if (command.hidden) return;
            const category = command.category || 'General';
            if (!categories[category]) categories[category] = [];
            categories[category].push(command);
        });

        // カテゴリごとに表示文を作成
        for (const category in categories) {
            const commandList = categories[category]
                .map(command => `**r.${command.name}**: ${command.description || '説明なし'}`)
                .join('\n');
            data.push(`**${category}**\n${commandList}`);
        }

        // メッセージ送信
        message.channel.send(data.join('\n'), { split: true });
    },
    category: '便利機能'
};
