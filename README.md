# 営業ナビ AI

企業の需要シグナルを分析し、営業アプローチ候補、会話スクリプト、メール文面、案件ステータス、再追客予定をまとめて管理するNext.js製デモアプリです。

## 起動方法

### Docker（推奨）

Docker Desktopをインストール後、次のコマンドだけでアプリ、Ollama、AIモデルを準備できます。

Windowsでは、展開したフォルダの `start.bat` をダブルクリックするだけで起動できます。Docker Desktopが停止中なら自動で起動を待ち、準備完了後にサイトをブラウザで開きます。停止するときは `stop.bat` をダブルクリックします。

コマンドで起動する場合：

```bash
docker compose up --build
```

初回は `qwen3:0.6b`（約523MB）を自動ダウンロードするため数分かかります。完了後、ブラウザで `http://localhost:3000` を開いてください。2回目以降はDocker Volumeに保存済みのモデルを再利用します。

バックグラウンド起動と停止は次の通りです。

```bash
docker compose up -d --build
docker compose down
```

営業リストとAIモデルはVolumeに残ります。データも含めて完全に削除する場合だけ `docker compose down -v` を使用してください。

使用モデルや公開ポートは環境変数で変更できます。

```bash
OLLAMA_MODEL=qwen3:1.7b APP_PORT=8080 docker compose up --build
```

Windows PowerShellでは `$env:OLLAMA_MODEL='qwen3:1.7b'` のように設定してから実行してください。

### Node.jsで直接起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。


リポジトリを取得した利用者は `docker compose up --build` で起動できます。

## 検証

```bash
npm run lint
npm run build
```

## 主な画面

- ホーム（営業活動サマリー）
- AI需要検索
- 営業パイプライン
- 営業リスト
- AI営業文作成・返信作成・DMロールプレイ
- 類似企業検索
- 設定

画面内の企業情報や分析結果はデモデータです。

## 架空企業データベース

日本標準産業分類の大分類を参考にした20業界、各100社（合計2,000社）の架空企業データを収録しています。

- `data/companies.sqlite`: SQLiteデータベース
- `data/companies.json`: アプリ・API向けJSON
- `data/companies.csv`: 表計算・一括インポート向けCSV
- `public/data/companies.json`: ブラウザから取得可能なJSON

データを再生成する場合は `npm run generate:data` を実行してください。すべてデモ用途の架空企業であり、実在の企業・団体とは関係ありません。

## OllamaローカルAI連携

AI需要ターゲット抽出は、ローカルPCで動作するOllamaへNext.js API経由で接続します。企業データや商品情報を外部のAI APIへ送信しません。

検索画面では登録商品を選択し、業界、所在地、従業員数、最低営業スコア、需要シグナル、取得件数（1〜100社）を指定できます。2,000社の架空企業データベースを条件で絞り込み、Ollamaが商品との適合理由と推奨初回トークを生成します。検索後は現在の商品・条件・検索企業を引き継いだ対話が可能です。Ollamaが停止中でも条件検索結果は表示できます。

## 類似企業分析

基準企業を選択すると、残りの企業を業界35%、従業員規模20%、売上15%、事業内容15%、所在地5%、需要シグナル5%、推奨部署5%で比較します。類似度ランキング、一致した要素、営業スコアを表示し、抽出件数は1〜50社で指定できます。処理は `app/api/lookalike/route.ts` に実装されています。

1. [Ollama公式Windows版](https://ollama.com/download/windows)をインストールします。
2. 使用モデルを取得します。

```bash
ollama pull qwen3:0.6b
```

3. Ollamaが起動した状態で本サイトを起動します。

```bash
npm install
npm run dev
```

接続先やモデルを変更する場合は `.env.example` を `.env.local` としてコピーし、`OLLAMA_URL` と `OLLAMA_MODEL` を編集してください。APIは `app/api/ollama/route.ts` に実装されています。
