module.exports = {
    name: 'rd',
    description: '指定された最大値内で指定された個数の乱数を生成します。\n例:`r.rd 10 3`  (1以上10以下の整数をランダムに３個生成する)',
    category: 'お遊び',
    execute(message, args) {
        let count = 1;

        if (args.length < 1 || isNaN(args[0])) {
            return message.reply('最大値を指定してください。例:`r.rd 10 3`');
        }

        const maxValue = parseInt(args[0]);

        if (args.length > 1 && !isNaN(args[1])) {
            count = parseInt(args[1]);
        }

        if (maxValue <= 0 || count <= 0) {
            return message.reply('最大値と個数は1以上の整数で指定してください。');
        }

        let result = '';
        for (let i = 0; i < count + 1; i++) {
            const randomNumber = Math.floor(Math.random() * maxValue) + 1;
            result += `${randomNumber}\n`;
        }
        message.channel.send('生成された乱数は')
        setTimeout(() =>{
          message.channel.send({ content: `\n\`\`\`${result}\`\`\`` });
        }, 1500)
        
    },
};
