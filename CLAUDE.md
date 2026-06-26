# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ルール

- **変更内容、ファイルの種類にかかわらず、変更を加えるときは必ずブランチを作成すること。**
- **機能変更・追加は、テストを先に作成してからコードを実装すること（TDD）。**

## コマンド

```bash
npm run dev          # 開発サーバー起動 (Vite)
npm test             # テスト実行（一回のみ）
npm run test:watch   # テストをウォッチモードで実行
npm run coverage     # カバレッジレポート生成
npm run build        # 本番ビルド
```

単一テストファイルの実行:

```bash
npx vitest run src/test/App.test.jsx
```

## アーキテクチャ

React + Vite + Tailwind CSS (v4) のシンプルなSPA。状態管理は `localStorage` に永続化するシンプルなuseState。

**状態の流れ:**

```
App.jsx（状態ルート）
  ├── TodoForm.jsx   — テキスト入力 + 期日入力 → onAdd(text, dueDate) コールバック
  └── TodoList.jsx   — todos 配列を受け取り TodoItem を列挙
        └── TodoItem.jsx — 個別タスク表示、完了トグル・削除・期日編集
```

**Todoオブジェクトの形状:**

```js
{ id: number, text: string, completed: boolean, dueDate: string }
```

`localStorage` キーは `'todos'` 固定。旧フォーマット（`id` なし）からの移行ロジックが `App.jsx` の `loadTodos()` にある。

## テスト構成

テストファイルは `src/test/` に配置。`@testing-library/react` + `@testing-library/user-event` + jsdom を使用。セットアップファイルは `src/test/setup.js`。

カバレッジ対象は `src/**/*.{js,jsx}`（`main.jsx` と `src/test/` は除外）。

## CI

PRを作成するとGitHub Actions（`.github/workflows/ci.yml`）がtest → coverage → buildを実行する。
