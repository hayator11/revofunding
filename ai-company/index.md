# 🏢 AI Company — 入口（司令室）

> はやとさんの**司令室**。ここから会社全体をたどれます。
> ※ これは Obsidian 用の入口ノート。`ai-company` フォルダを Obsidian で開いて使ってください。

---

## 🧭 まず全体像
- [[README|会社の表紙]] — この会社は何か
- [[docs/governance|ガバナンス（誰が決めるか）]] — ⚠️ 最終判断は必ず hayato
- [[docs/org-chart|組織図・指揮系統]] — hayato → AI部長 → つばさ → 子会社
- [[docs/command-center|司令塔の仕組み]] — つばさが全体を動かす流れ
- [[docs/operating-rules|全社共通ルール]] — 守ること
- [[docs/worklog|作業ログ]] — やったことの記録

## 🏬 子会社（companies/）
- [[companies/README|子会社一覧]]
- [[companies/onokun-4koma/company|🎨 おのくん4コマ社]]
- [[companies/x-sns/company|📣 X・SNS投稿社]]
- [[companies/ai-style-shindan/company|🎭 AIスタイル診断社]]
- [[companies/revolink/company|🔗 レボリンク社]]
- [[companies/revofunding/company|📊 レボファンディング社（レボアート含む）]]
- [[companies/revolist-shindan/company|🧭 レボリスト診断社]]

## 💡 よく使うプロンプト・進行中の企画
- [[companies/revofunding/revoart-ideation-prompt|レボアート企画ブレスト（Cursor起動）]]
- [[companies/revolink/sekaiichi-yasashii-koukoku|「世界一やさしい広告です。」検証・設計書]] — ✅ 3判断確定・商標クリア
- [[companies/revofunding/revoart-kyokai-teiansho|レボアート×アーティスト協会 企画書【提出版】]] — 🚩 旗＋透明性の節を統合済み

## 📝 作業指示書テンプレ（templates/）
- [[templates/work-order-cursor|Cursor 用]]
- [[templates/work-order-codex|codex 用]]
- [[templates/work-order-hermes-grok|エルメス・Grok 用]]
- [[templates/schedule-intake|予定まとめ入力]]
- [[templates/secretary-talk-templates|つばさ会話テンプレート集（日常秘書業務）]] ← 🆕

## 👥 人（AI）の定義
> ⚠️ これらは `.claude/` フォルダ内（AIツール用）。Obsidian では隠れて見えないことがあります。
- AI部長（hayato代理）… `.claude/agents/ai-bucho.md`
- 秘書つばさ … `.claude/agents/tsubasa.md`
- スケジュール / メール / 資料 / 開発 担当 … `.claude/agents/*-officer.md`
- スケジュール管理スキル … `.claude/skills/schedule-management/SKILL.md`

---

## 使い方メモ（Obsidian）
- **開く**：Obsidian で「フォルダをVaultとして開く」→ `ai-company` を選ぶ
- **たどる**：上の `[[リンク]]` をクリックでノート移動
- **つなぐ**：新しいメモを1枚作り、関連ノートへ `[[...]]` でリンク
- **見渡す**：左のグラフアイコンで、ノートのつながりを地図表示
- **同期**：Obsidianで書いたら GitHub にコミット/プッシュ → AIが読める（正本は GitHub）
