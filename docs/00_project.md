# WHITE BLOOM ARGサイト
## Codex実装仕様書

> 実装開始前に `00_project.md` → `01_pages.md` → `02_game-flow.md` → `03_truth-ending-images.md` の順に**すべて読んでから**作業を開始してください。
> 一部ファイルだけを参照して独自判断で実装を開始しないでください。

# 00. PROJECT / 共通実装仕様

# 0. 最重要ルール

1. 最初は「実在しそうな花の定期便サイト」として完成させる。
2. ARG部分を優先して通常サイトのデザイン・情報量を簡素化しない。
3. 進行は一本道。PHASE0 → PHASE1 → PHASE2 → PHASE3 → PHASE4 → TRUTH → ENDING。
4. 各PHASEの重要な新規異常箇所は1箇所のみ。
5. 過去に発見した異常・情報は必要に応じて残してよい。
6. PHASE進行時のサイト改変演出で表示する文言は、必ず **「サイトが改変されました」** とする。
7. 「サイト改変演出」「デバッグモード」はプロジェクト内 `modules` フォルダの既存実装を必ず使用し、類似機能を新規実装し直さない。
8. 実装開始前に `modules` 内のファイルを読み、既存API、class、data属性、初期化方法、保存方式、演出仕様を確認する。
9. modulesの仕様変更が必要な場合、勝手に全面改修せず、変更理由・影響範囲を先に報告する。
10. PC/SP双方でレイアウト崩れを起こさないことを最優先する。
11. PCのhoverのみを攻略条件にしない。すべてSPでも攻略可能にする。
12. 画像内にAI生成された文字が存在する場合、正式情報として使用しない。必要な文言はHTMLで実装する。
13. 本仕様書にないホラー演出、血、過度なグリッチ、ジャンプスケア、SF研究所風表現を追加しない。

---

---

# 1. サイト基本情報

- サイト名：WHITE BLOOM
- 表向き：花の定期便サービス
- キャッチコピー：  
  **花のある暮らしで、  
  毎日を少し豊かに。**
- 通常サイトの印象：女性的、柔らかい、上品、清潔、実在しそう
- ベースカラー：白 / アイボリー / ごく薄いピンク
- アクセント：ダスティピンク / ピンクブラウン
- 見出し：濃い赤みブラウン系
- 本文：濃いグレー
- 通常ページではARG・研究・ホラーを連想させるUIを使用しない

## フォント

- 英字：`Lora`
- 日本語見出し：`Noto Serif JP`
- 日本語本文・UI：`Noto Sans JP`

Google Fonts等を使用する場合も、読み込み失敗時のfallbackを指定する。

---

---

# 2. ページ構成

以下の4ページを基本構成とする。

```text
index.html
flowers.html
voices.html
truth.html
```

進行：

```text
index.html
  ↓
flowers.html
  PHASE1
  ↓
flowers.html
  PHASE2
  ↓
voices.html
  PHASE3
  ↓
voices.html
  PHASE4
  ↓
truth.html
  TRUTH
  ↓
index.html
  ENDING
```

PHASE状態に応じて同じページの内容を変化させる。

---

---

# 3. 共通Header

## PC

左：
- WHITE BLOOMロゴ
- ロゴクリックで `index.html`

右：
- Home
- About
- Flowers
- Plan
- How to
- Voice
- FAQ
- 探索リセット

## SP

必ず以下の並びにする。

```text
[ロゴ]        [探索リセット] [ハンバーガー]
```

### 重要

- 「探索リセット」はハンバーガーメニューの中に入れない。
- SPでも常時Header上に表示する。
- ロゴ、探索リセット、ハンバーガーが重ならない。
- 長いロゴはSP用に適切な最大幅を設定する。
- Headerの高さを固定値に依存しすぎない。

探索リセット実行時は、既存modulesの状態リセット仕様を確認して使用する。

---

---

# 4. 共通Footer

必ず以下を表示。

```text
©ぺいぽぴー
```

```text
※このWebサイトの内容はフィクションであり、実在の人物・団体とは一切関係ありません。
```

表記は変更しない。

---

---

# 5. レスポンシブ実装

## 基本

- 通常コンテンツ最大幅：約1200px
- 読み物系コンテンツ：約850px
- PC左右padding：約40px
- SP左右padding：約20px

数値はデザイン調整可能だが、固定幅による横スクロールを発生させない。

## 実装方針

- Grid / Flexを中心に実装
- `minmax()`、`clamp()`、`aspect-ratio`を適切に使用
- 不要なabsolute配置を避ける
- 画像は `object-fit: cover` を基本とし、必要に応じて画像別 `object-position`
- 重要情報を背景画像内の文字だけに依存させない
- 画像高さを固定しすぎない
- SPで横スクロールを攻略操作として使用しない
- 360px前後の端末幅でも確認する

---

---

# 20. ゲーム状態

実際の保存キー名・APIは既存modulesを確認して決定する。

最低限、概念上以下の状態を管理できるようにする。

```text
currentPhase
phase1Discovered
phase2Discovered
phase3Discovered
phase4Discovered
truthReached
endingReached
```

PHASE2については必要に応じて、

```text
whitenedSweetpea
whitenedLavender
whitenedLily
whitenedJasmine
whitenedGeranium
dahliaWhitened
```

等の途中状態も保持する。

ただし既存modulesの状態管理設計が存在する場合、それに合わせる。

## 必須

- リロードで進行が消えない
- ページ移動で進行が消えない
- ブラウザバックで異常発見演出が無限再生されない
- 発見済み異常を再クリックしても同じ「サイトが改変されました」を再生しない
- 現在PHASEに応じたページ状態を復元する

---

---

# 21. modules

実装開始前に必ず `modules` フォルダを確認。

対象：

- サイト改変演出
- デバッグモード

## サイト改変演出

原則、

**異常を初めて発見し、PHASEが進行した時に1回だけ**

再生。

作品固有で新しい改変overlayを作らない。

表示文：

```text
サイトが改変されました
```

既存modules側で表示文差し替えAPI等がある場合、それを使用。

## デバッグ

既存デバッグ機能を流用し、

- PHASE切替
- 状態確認
- リセット
- 必要であれば改変演出テスト

ができる状態にする。

本番通常操作ではデバッグUI・デバッグ専用情報を露出させない。

---

---

# 25. アニメーション

通常サイト：

- 柔らかいfade
- 上品なhover
- Heroクロスフェード

ARG異常：

- 必要な箇所のみ
- 過度な点滅禁止
- 長すぎる演出禁止
- 操作不能時間を増やしすぎない

`prefers-reduced-motion: reduce` に対応。

Reduced Motionでも異常内容とゲーム進行が理解できるようにする。

---

---

# 26. アクセシビリティ・操作

- クリック対象は `<button>` / `<a>` 等、適切な要素を使用
- キーボードfocusを消さない
- 画像だけを唯一の情報源にしない
- `alt`を設定
- 装飾画像は適切に空alt
- SPでタップ領域を十分確保
- 0.5秒の画像切替タイミングに操作を依存させない
- ノイズや点滅を強くしすぎない

---

---

# 27. 実装順序

Codexは一度にすべてを雑に実装せず、以下の順で進める。

## STEP A

既存ファイル・フォルダ確認。

- modules
- images
- styles / scss
- js
- HTML
- 既存package環境

既存構造を壊さない。

## STEP B

人物シートをcropし、画像ファイルを準備。

## STEP C

通常サイトを完成。

- Header
- Footer
- index
- flowers
- voices
- Hero
- PC/SP

この段階で「普通の花の定期便サイト」として完成していることを確認。

## STEP D

状態管理とmodules接続。

## STEP E

PHASE1。

## STEP F

PHASE2。

## STEP G

PHASE3。

## STEP H

PHASE4。

## STEP I

TRUTH。

## STEP J

ENDING / X共有。

## STEP K

PC/SP全プレイテスト。

---

---

# 28. Codexによる独自解釈を禁止する項目

以下を変更しない。

- WHITE BLOOMという名称
- 6種類の花
- 花と作用の対応
- PHASE順
- PHASE1の0.5秒ダリア
- PHASE1で最初から「定着」を出さない
- PHASE2開始時は全花通常色
- PHASE2のスクロール順
- PHASE2で最後にダリアが白くなる
- PHASE3の完全一致レビュー
- PHASE4の18か月人物切替
- 基準人格
- TRUTH内容
- ENDINGのスイートピー
- X共有文
- 「サイトが改変されました」という文言
- Headerの探索リセット位置
- Footerのcopyright・フィクション表記
- 既存modulesの再利用方針

仕様上判断できない点があれば、勝手に補完せず確認する。

---

---

# 30. 完成条件

以下をすべて満たした時点で完成とする。

1. PCでPHASE0からENDINGまで一本道で完走できる。
2. SPでPHASE0からENDINGまで同じ内容で完走できる。
3. hoverを使用しなくても攻略できる。
4. リロード・ページ移動・ブラウザバックを行っても進行状態が破綻しない。
5. 通常サイトのデザインがARG実装によって崩れていない。
6. 重要異常が各PHASEで1箇所に整理されている。
7. 画像・文言・PHASE順が本仕様書と一致する。
8. 既存modulesを使用している。
9. PC/SPで横スクロール、要素重なり、画像の極端な切れ、Header崩れがない。
10. 最終プレイ後、コンソールエラー・404画像・未使用デバッグ表示がない。

---

以上の仕様に従って実装してください。

---
