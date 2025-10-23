FROM node:16

# 作業ディレクトリを作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクト全体をコピー
COPY . .

# 環境変数（Koyeb の PORT が自動で割り当てられる）
ENV PORT=3000

# アプリを起動
CMD ["npm", "start"]
