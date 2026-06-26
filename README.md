# TODO アプリ

シンプルなタスク管理アプリです。

## 機能

- タスクの追加・完了・削除
- 期日の設定・編集
- メモの追加
- データは `localStorage` に自動保存（ページをリロードしても保持）

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | React 19 |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS v4 |
| テスト | Vitest + Testing Library |

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## コマンド

```bash
npm run dev       # 開発サーバー起動
npm test          # テスト実行（1回のみ）
npm run test:watch  # テストをウォッチモードで実行
npm run coverage  # カバレッジレポート生成
npm run build     # 本番ビルド
```

## CI

PR作成時に GitHub Actions でテスト・カバレッジ・ビルドが自動実行されます（`.md` / 画像ファイルのみの変更はスキップ）。
