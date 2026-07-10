# AI Company 🏢 — 秘書つばさ体制

hayator の仕事を、**役割分担された AI チーム**で回すための本社リポジトリ。

「秘書が一人で全部抱えて絶対ミスしない」は成り立たない。だからこの会社は、
**各担当が責任範囲を持ち、実行し、秘書長つばさが最終確認して報告する**構造で動く。

---

## 組織図

```
              🕊️ つばさ（秘書長・司令塔）
              窓口 / 要件整理 / 振り分け / 最終確認 / 報告
                          │
      ┌───────────┬───────────┼───────────┬───────────┐
   📅 スケジュール  ✉️ メール    📁 資料      💻 開発      （将来の担当）
      担当          担当         担当         担当（レボ）
```

| 役割 | 責任範囲 | 主な道具 | 定義ファイル |
|------|----------|----------|--------------|
| 🕊️ つばさ（秘書長） | 窓口・要件整理・振り分け・進捗管理・最終確認・報告 | 会話・調整 | `.claude/agents/tsubasa.md` |
| 📅 スケジュール担当 | カレンダー登録/変更・空き調整・朝の予定通知 | Google Calendar | `.claude/agents/schedule-officer.md` |
| ✉️ メール担当 | メール確認・下書き・日程調整メール | Gmail | `.claude/agents/mail-officer.md` |
| 📁 資料担当 | 資料検索・議事録・整理 | Google Drive | `.claude/agents/docs-officer.md` |
| 💻 開発担当（レボ） | revofunding / revolist-diagnosis の実装 | GitHub・コード | `.claude/agents/dev-officer.md` |

---

## この会社の歩き方

1. hayator は **つばさ**に話しかけるだけでよい
2. つばさが内容を整理し、**正しい担当**に振り分ける
3. 担当が実行し、**自己チェック**して結果をつばさへ報告
4. つばさが**最終確認**し、hayator へ「件名・結果・リンク」を定型で報告
5. 実行内容は `docs/worklog.md` に記録される

---

---

## 司令塔（つばさに指示を出して全体を動かす）

hayator は **つばさ1人に指示**を出す。つばさが担当ツール（Cursor / codex / エルメス・Grok / Claude Code）を判定し、
**作業指示書**を生成 → hayator が各ツールに渡す → つばさが結果を集約・報告する。

| 用件 | 担当ツール | 対象プロジェクト |
|------|-----------|------------------|
| 4コマ / SNS / スタイル診断 | Cursor（Claude Code） | おのくん4コマ・X/SNS・AIスタイル診断 |
| レボリンク | エルメスエージェント（Grok） | レボリンク |
| ファンディング / 診断 実装 | codex（Codex） | レボファンディング・レボリスト診断 |
| レボ各リポの直接開発 | Claude Code | revofunding / revolist-diagnosis |
| 予定・メール・資料 | **claude.ai（秘書つばさ）** | 全社共通 |

→ 詳細と標準フローは **[司令塔設計](docs/command-center.md)** を参照。

---

## ドキュメント

- [司令塔設計（全体を動かす仕組み）](docs/command-center.md)
- [組織図と責任分担](docs/org-chart.md)
- [全社共通ルール](docs/operating-rules.md)
- [作業ログ](docs/worklog.md)

## 作業指示書テンプレ（templates/）

- [Cursor 用](templates/work-order-cursor.md)
- [codex 用](templates/work-order-codex.md)
- [エルメス・Grok 用](templates/work-order-hermes-grok.md)
- [予定まとめ入力](templates/schedule-intake.md)

## 各担当の手順書（スキル）

- [スケジュール管理](.claude/skills/schedule-management/SKILL.md)

---

## 設計の大原則（全社共通）

- ネガティブ表現は使わない（相性が悪い/向いていない/弱点/失敗 → 使わない）
- 担当は「実行しっぱなし」にしない。**必ず結果を報告**する
- 迷ったら勝手に判断せず、つばさ経由で hayator に確認する
- 外部に送る操作（メール送信・予定の共有など）は実行前に一言確認する
