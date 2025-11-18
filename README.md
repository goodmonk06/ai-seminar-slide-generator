# AI Seminar Slide Generator

講演テーマと制約を入れると、スライド構成案と各スライドのポイントを生成するツール。

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude API**
- **Markdown** 形式でのスライド出力

## Features

- 講演テーマ、対象者、時間を入力するだけでAIがスライド構成を自動生成
- セクション名＋話すポイント3つ程度のMarkdown形式で出力
- 生成した構成案のコピー・ダウンロード機能
- シンプルで使いやすいUI

## Getting Started

### 1. 環境構築

必要な環境:
- Node.js 18以上
- npm または yarn

### 2. インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd ai-seminar-slide-generator

# 依存パッケージをインストール
npm install
```

### 3. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成し、Anthropic APIキーを設定します。

```bash
cp .env.example .env
```

`.env` ファイルを編集:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Anthropic APIキーは [Anthropic Console](https://console.anthropic.com/) で取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### 5. 本番ビルド

```bash
npm run build
npm start
```

## 使い方

1. トップページで以下の情報を入力:
   - **講演テーマ**: プレゼンのタイトル・テーマ
   - **対象者**: 聴衆の属性や経験レベル
   - **講演時間**: 分単位で指定（1〜180分）
   - **キーワード**（任意）: 重視したいトピックやキーワード

2. 「スライド構成案を生成」ボタンをクリック

3. 生成されたスライド構成案が表示されます

4. 構成案をコピーまたはMarkdownファイルとしてダウンロード

## 生成されたMarkdownの活用方法

本ツールで生成されるMarkdownは、以下のような構造になっています:

```markdown
# スライド1: イントロダクション
- 自己紹介と講演の目的
- 今日学べること
- タイムライン

# スライド2: 背景と課題
- 現状の問題点
- なぜこのテーマが重要か
- 解決すべき課題
```

### KeynoteやPowerPointへの移行方法

生成されたMarkdown構成案を、実際のプレゼンテーションツールで使用する際の推奨手順:

#### Keynote (macOS)

1. 生成されたMarkdownをコピーまたはダウンロード
2. Keynoteで新規プレゼンテーションを作成
3. 各 `# スライド番号: タイトル` を新しいスライドの見出しに
4. 箇条書き（`-`）部分をスライドの本文に転記
5. テーマやデザインを適用
6. 図表、画像、グラフなどのビジュアルを追加

#### PowerPoint (Windows/macOS)

1. 生成されたMarkdownをコピーまたはダウンロード
2. PowerPointで新規プレゼンテーションを作成
3. 各 `#` で始まる見出しを新しいスライドのタイトルに
4. 箇条書き部分をスライドのコンテンツに転記
5. デザインテンプレートを適用
6. SmartArtやアイコンを追加してビジュアルを強化

#### Google Slides

1. 生成されたMarkdownをコピー
2. Google Slidesで新規プレゼンテーションを作成
3. 構成案に従ってスライドを追加
4. 各スライドにタイトルとポイントを入力
5. テーマやレイアウトを選択
6. 画像や図形を挿入

#### Markdown対応ツール（Marp, reveal.js など）

Markdown形式のままプレゼンテーションを作成したい場合:

- **Marp**: VS Code拡張機能でMarkdownから直接スライド生成
- **reveal.js**: Web上で動くMarkdownベースのプレゼンツール
- **Slidev**: 開発者向けのMarkdownプレゼンツール

これらのツールでは、生成されたMarkdownを軽微な調整だけでそのまま使用できます。

### 活用のコツ

- 生成された構成案はあくまで**たたき台**として使用
- 各スライドのポイントを参考に、詳細な内容を肉付け
- 聴衆に合わせて図表やビジュアルを追加
- 実際の講演時間に合わせてスライド数を調整
- デモやライブコーディングなど、インタラクティブな要素を追加

## プロジェクト構成

```
ai-seminar-slide-generator/
├── app/
│   ├── api/
│   │   ├── generate/       # スライド生成API
│   │   └── plans/[id]/     # スライドプラン取得API
│   ├── plans/[id]/         # スライド詳細ページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ（フォーム）
│   └── globals.css         # グローバルスタイル
├── lib/
│   ├── types.ts            # TypeScript型定義
│   ├── storage.ts          # データストレージ層
│   └── ai.ts               # AI生成ロジック
├── data/                   # 生成されたプランの保存先（.gitignore対象）
└── public/                 # 静的ファイル
```

## データストレージ

現在の実装では、生成されたスライドプランは `data/` ディレクトリにJSON形式で保存されます。本番環境では、データベース（PostgreSQL, MongoDB等）への移行を推奨します。

## ライセンス

MIT

## 開発者向け

### 環境

- Node.js 18+
- TypeScript 5+
- Next.js 16
- Anthropic Claude API (claude-3-5-sonnet-20241022)

### スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm start` - 本番サーバー起動
- `npm run lint` - ESLintチェック

## トラブルシューティング

### APIキーエラーが出る

- `.env` ファイルが正しく作成されているか確認
- `ANTHROPIC_API_KEY` が正しく設定されているか確認
- 開発サーバーを再起動

### スライド生成が遅い

- Anthropic APIは通常5-15秒程度かかります
- ネットワーク環境を確認
- API利用制限に達していないか確認
