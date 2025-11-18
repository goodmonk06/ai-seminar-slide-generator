#!/usr/bin/env tsx

/**
 * Seed script to create demo slide plans
 * Usage: npm run db:seed
 */

import { saveSlidePlan, generateId } from "../lib/storage";
import { SlidePlan } from "../lib/types";

const demoPlans: Omit<SlidePlan, "id" | "createdAt" | "updatedAt" | "version" | "tags" | "metadata">[] = [
  {
    title: "機械学習入門 - 実践から学ぶAI開発",
    audience: "エンジニア初級〜中級",
    durationMinutes: 45,
    keywords: "Python, TensorFlow, 機械学習, AI",
    outlineMarkdown: `# スライド1: タイトルスライド
- 機械学習入門 - 実践から学ぶAI開発
- 講演者紹介
- 今日のゴール

# スライド2: 機械学習とは何か
- 機械学習の定義と歴史
- 従来のプログラミングとの違い
- 実世界での応用例（推薦システム、画像認識、自然言語処理）

# スライド3: 機械学習の種類
- 教師あり学習（分類と回帰）
- 教師なし学習（クラスタリング）
- 強化学習

# スライド4: 開発環境のセットアップ
- Python環境の準備
- 必要なライブラリ（NumPy, Pandas, Scikit-learn）
- Jupyter Notebookの使い方

# スライド5: 実践例：線形回帰
- 問題設定：住宅価格の予測
- データの前処理
- モデルの訓練と評価

# スライド6: 実践例：画像分類
- CNNの基礎
- TensorFlow/Kerasの使い方
- 手書き数字認識（MNIST）

# スライド7: モデルの評価指標
- 精度（Accuracy）
- 適合率と再現率
- 混同行列の読み方

# スライド8: よくある落とし穴
- 過学習とその対策
- データの偏りに注意
- 適切なハイパーパラメータの選択

# スライド9: 次のステップ
- より高度なアルゴリズム
- 実務での機械学習プロジェクト
- おすすめの学習リソース

# スライド10: まとめとQ&A
- 本日のまとめ
- 質疑応答
- 連絡先`,
  },
  {
    title: "TypeScript実践テクニック",
    audience: "フロントエンド開発者",
    durationMinutes: 30,
    keywords: "TypeScript, JavaScript, 型安全性",
    outlineMarkdown: `# スライド1: イントロダクション
- TypeScriptを使う理由
- 本セッションで学べること
- 対象者

# スライド2: TypeScriptの基礎おさらい
- 基本的な型（string, number, boolean）
- インターフェースと型エイリアス
- ジェネリクス入門

# スライド3: 高度な型システム活用
- ユニオン型とインターセクション型
- 型ガード
- 条件付き型（Conditional Types）

# スライド4: 実践的な型定義
- APIレスポンスの型付け
- フォームバリデーション
- イベントハンドラの型安全性

# スライド5: ユーティリティ型の活用
- Partial, Required, Readonly
- Pick, Omit
- Record, Extract, Exclude

# スライド6: エラーハンドリング
- Result型パターン
- カスタムエラー型の定義
- try-catchの型安全性

# スライド7: パフォーマンスとベストプラクティス
- コンパイラオプションの最適化
- strictモードの活用
- 型推論を活用したコード削減

# スライド8: 実務での活用事例
- Reactでの型定義
- Node.jsバックエンドでの活用
- テストコードの型安全性

# スライド9: まとめ
- TypeScriptを最大限活用するために
- おすすめのツールとライブラリ
- 継続的な学習リソース`,
  },
  {
    title: "アジャイル開発入門：チームで成果を出す方法",
    audience: "プロジェクトマネージャー、開発者",
    durationMinutes: 60,
    keywords: "アジャイル, スクラム, チーム開発",
    outlineMarkdown: `# スライド1: タイトル
- アジャイル開発入門
- チームで成果を出す方法
- 講師紹介

# スライド2: アジャイルとは
- アジャイルマニフェスト
- ウォーターフォールとの違い
- なぜアジャイルが必要なのか

# スライド3: スクラムフレームワーク
- スクラムの役割（PO, SM, 開発チーム）
- スクラムイベント（スプリント、デイリースタンドアップ）
- 成果物（プロダクトバックログ、スプリントバックログ）

# スライド4: スプリント計画
- ストーリーポイントの見積もり
- プランニングポーカー
- スプリントゴールの設定

# スライド5: デイリースタンドアップ
- 効果的なデイリーミーティング
- 3つの質問（昨日やったこと、今日やること、障害）
- タイムボックスの重要性

# スライド6: スプリントレビュー
- デモの準備
- ステークホルダーとのコミュニケーション
- フィードバックの収集

# スライド7: レトロスペクティブ
- KPT法（Keep, Problem, Try）
- チームの改善サイクル
- 心理的安全性の確保

# スライド8: プロダクトバックログの管理
- ユーザーストーリーの書き方
- 優先順位付け
- バックログリファインメント

# スライド9: メトリクスと可視化
- ベロシティ
- バーンダウンチャート
- サイクルタイム

# スライド10: よくある課題と解決策
- スプリント途中での要求変更
- チームメンバーの稼働率の違い
- 技術的負債への対処

# スライド11: チームビルディング
- 信頼関係の構築
- コミュニケーションのベストプラクティス
- リモートチームでの工夫

# スライド12: まとめと実践へ
- アジャイル導入のステップ
- 小さく始めて改善を重ねる
- Q&A`,
  },
];

async function seed() {
  console.log("🌱 Seeding demo slide plans...");

  try {
    for (const planData of demoPlans) {
      const now = new Date();
      const plan: SlidePlan = {
        ...planData,
        id: generateId(),
        version: 1,
        tags: [],
        metadata: {},
        createdAt: now,
        updatedAt: now,
      };

      await saveSlidePlan(plan);
      console.log(`✓ Created: ${plan.title} (ID: ${plan.id})`);
    }

    console.log("\n✨ Seeding completed successfully!");
    console.log(`\n📊 Created ${demoPlans.length} demo slide plans`);
    console.log("\nYou can now:");
    console.log("  1. Start the development server: npm run dev");
    console.log("  2. View the seeded plans in the data/ directory");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
