# WHITE BLOOM ARGサイト
## Codex実装仕様書

> 実装開始前に `00_project.md` → `01_pages.md` → `02_game-flow.md` → `03_truth-ending-images.md` の順に**すべて読んでから**作業を開始してください。
> 一部ファイルだけを参照して独自判断で実装を開始しないでください。

# 01. PAGES / 通常サイト・ページ構成

# 6. index.html

## 通常時セクション

1. Hero
2. Concept
3. 今月の花
4. WHITE BLOOMについて
5. お届けする花
6. 料金プラン
7. ご利用の流れ
8. 利用者の声
9. FAQ
10. CTA
11. Footer

PHASE0では異常を出さない。

---

---

# 7. Heroスライドショー

Heroは固定画像ではなくスライドショーにする。

使用画像：

```text
hero-white-bloom.jpg
hero-staff-arrangement.jpg
hero-delivery-preparation.jpg
hero-flower-life.jpg
```

順序：

1. 花のメインビジュアル
2. スタッフが花束を制作
3. スタッフが配送準備
4. 利用者の生活に花がある写真

## 動作

- 自動再生
- 約5〜6秒ごと
- ゆっくりしたクロスフェード
- 派手なスライド移動は禁止
- 手動操作を付ける場合は控えめなdot / arrow
- `prefers-reduced-motion` 時は動きを抑える
- SPでは人物・花が不自然に切れないよう画像別に `object-position` を調整

Hero上のコピーはHTMLで表示する。

---

---

# 8. flowers.html 通常状態

4〜9月の花を掲載。

```text
4月  スイートピー
5月  ラベンダー
6月  ユリ
7月  ジャスミン
8月  ゼラニウム
9月  ダリア
```

通常画像：

```text
flower-sweetpea.jpg
flower-lavender.jpg
flower-lily.jpg
flower-jasmine.jpg
flower-geranium.jpg
flower-dahlia.jpg
```

PC：3列を基本  
SP：1列

通常時は一般的な花の紹介カードとして実装し、以下のような普通の情報を掲載する。

- 花の名前
- 花言葉
- 香り
- おすすめの飾り場所
- お手入れ

PHASE0では研究情報を表示しない。

---

---

# 13. voices.html 通常状態

通常の「利用者の声」ページ。

PHASE0〜2の通常状態では、一般的なレビューを掲載。

ただし以下のレビューは補助伏線として使用可能。

```text
ラベンダーなのに、今まで嗅いだことのない香りでした。
```

```text
普通のスイートピーより香りがずっと長く残ります。
```

```text
近所の花屋さんに見せたら、品種が分からないと言われました。
```

これらは進行クリック対象にしない。

---

---
