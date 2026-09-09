# WHITE BLOOM ARGサイト
## Codex実装仕様書

> 実装開始前に `00_project.md` → `01_pages.md` → `02_game-flow.md` → `03_truth-ending-images.md` の順に**すべて読んでから**作業を開始してください。
> 一部ファイルだけを参照して独自判断で実装を開始しないでください。

# 03. TRUTH / ENDING / IMAGES

# 17. truth.html

通常サイトと明確に雰囲気を変えるが、SF・ホラー研究所にはしない。

「企業内部の研究報告書・管理資料」が露出した印象。

## タイトル

```text
花環境による心理傾向誘導試験
```

## セクション構成

### 01 研究の始まり

目的：

- 不安
- ストレス
- 怒り
- 衝動性

を薬物ではなく日常の植物環境で軽減する研究。

### 02 特殊品種開発

自然の花では、

- 香気成分量が安定しない
- 季節差がある
- 効果が弱い
- 長期試験で再現性が低い

ため、交配・選抜・組織培養等により特殊品種を開発した設定。

専門用語だけで終わらせず、平易な説明を併記する。

### 03 真っ白な原型株

使用：

```text
truth-prototype-comparison.jpg
```

一般提供株と、植物全体が白い原型株を比較。

「WHITE BLOOM」という名称は、この白い原型株を研究内部で呼んだことに由来する。

### 04 一般提供株

原型株の作用を維持しながら、一般的な花と同じ外見・色へ改良したものが定期便で提供されていたことを説明。

### 05 6段階

```text
第1段階　緊張抑制　スイートピー
第2段階　警戒低下　ラベンダー
第3段階　感情安定　ユリ
第4段階　嗜好固定　ジャスミン
第5段階　判断固定　ゼラニウム
第6段階　人格定着　ダリア
```

1種類だけでは作用が弱く、前段階で心理状態を変化させた状態で次の花へ長期間接触させることで効果を定着させる。

「毎月違う花が届く」というサービス形態自体が6段階のプログラム。

### 06 基準人格

研究途中から「精神的に安定し、対立しにくく、集団へ適応しやすい人格」を基準化。

```text
基準人格モデル 第4版

情緒安定性：高
攻撃性：低
反抗性：低
衝動性：低
集団協調性：高
嗜好偏差：低
```

研究思想を示す文：

```text
個体差は、社会的不安定要因となり得る。
```

### 07 白色化の意味

利用者の身体が白く変化したのではない。

嗜好・服装・髪型・生活環境の選択が同じ基準へ誘導された結果として、同じ白い状態を自発的に選ぶようになったことを説明。

### 08 研究施設

使用：

```text
truth-cultivation.jpg
```

特殊品種を開発・培養していた現実的な植物研究施設として表示。

### 09 家庭試験

```text
WHITE BLOOM 個人家庭試験

第3期試験：終了
長期対象者：8,421名
第6段階到達者：2,104名
基準人格一致率：目標値達成
```

### 10 次期試験

```text
次期試験
生活環境導入試験
```

対象候補：

```text
企業
教育施設
医療施設
宿泊施設
公共施設
```

研究記録：

```text
個体差の減少に伴い、集団内の心理的対立が著しく減少した。
大規模環境への導入価値は高いと判断する。
```

最終目的をそれ以上明言しない。

---

---

# 18. ENDING

TRUTH読了後、通常の `index.html` に戻す。

サイトデザインはほぼ通常状態。

数秒後、通常サイトのUIとして自然なモーダルを表示。

```text
お申し込みを受け付けました
```

続けて：

```text
WHITE BLOOM お試し便

お申し込みありがとうございます。
初回のお花の発送を受け付けました。
到着まで、もうしばらくお待ちください。
```

使用：

```text
ending-sweetpea.jpg
```

表示：

```text
第1段階　緊張抑制
系統番号：SP-04
```

```text
適用段階：第1段階
```

最後：

```text
第1段階を開始します。
```

暗転。

### 禁止

- プレイヤーの実名
- 住所
- 電話番号
- メールアドレス
- 支払情報
- 実際に個人情報を取得したような表示

「サイト上で発送受付と表示された」という範囲に留める。

---

---

# 19. X共有

暗転後：

```text
真相に到達しました
```

ボタン：

```text
Xで共有する
```

共有文：

```text
花の定期便「WHITE BLOOM」を見ていたら、変なところに辿り着きました。
#おかしなサイト
```

真相の内容は共有文に含めない。

X Intent等を利用する場合はURLエンコードを正しく行う。

---

---

# 22. 画像ファイル

基本画像：

```text
logo-white-bloom.svg

hero-white-bloom.jpg
hero-staff-arrangement.jpg
hero-delivery-preparation.jpg
hero-flower-life.jpg

about-flower-life.jpg

flower-sweetpea.jpg
flower-lavender.jpg
flower-lily.jpg
flower-jasmine.jpg
flower-geranium.jpg
flower-dahlia.jpg

prototype-sweetpea.jpg
prototype-lavender.jpg
prototype-lily.jpg
prototype-jasmine.jpg
prototype-geranium.jpg
prototype-dahlia.jpg

review-users-sheet.jpg
user-progress-sheet.jpg
convergence-users-sheet.jpg

truth-prototype-comparison.jpg
truth-cultivation.jpg
ending-sweetpea.jpg
```

画像名が実データと多少異なる場合、実装前に画像フォルダを確認し、勝手に別画像で代用しない。

---

---

# 23. 人物シートのトリミング

Codex側で実装前にトリミングを行う。

元画像は残す。

AI補正・色補正・顔変更等は行わない。

単純なcropのみ。

## review-users-sheet.jpg

4列×4行、16人。

左上から右へ：

```text
01 02 03 04
05 06 07 08
09 10 11 12
13 14 15 16
```

出力：

```text
review-human-01.jpg
review-human-02.jpg
review-human-03.jpg
review-human-04.jpg
review-human-05.jpg
review-human-06.jpg
review-human-07.jpg
review-human-08.jpg
review-human-09.jpg
review-human-10.jpg
review-human-11.jpg
review-human-12.jpg
review-human-13.jpg
review-human-14.jpg
review-human-15.jpg
review-human-16.jpg
```

各画像の縦横比・出力サイズを統一。

人物の顔を欠けさせない。

---

## user-progress-sheet.jpg

左から5分割。

生成画像下部に期間文字が含まれている場合、その文字部分はcropで除外。

出力：

```text
progress-human-00.jpg
progress-human-03.jpg
progress-human-06.jpg
progress-human-12.jpg
progress-human-18.jpg
```

対応：

```text
00 = 利用開始前
03 = 3か月
06 = 6か月
12 = 12か月
18 = 18か月
```

期間表記はHTML側で実装。

顔の位置・表示サイズが大きくズレないようcrop。

---

## convergence-users-sheet.jpg

左から5分割。

出力：

```text
convergence-human-01.jpg
convergence-human-02.jpg
convergence-human-03.jpg
convergence-human-04.jpg
convergence-human-05.jpg
```

全画像で人物位置・ダリア位置がなるべく揃うよう、同じcrop寸法を使用。

---

---

# 24. 画像の重要ルール

## 通常株

明るい商品写真。

茎・葉は自然な緑。

## 原型株

- 花
- 花芯
- 茎
- 葉
- 萼

を含む植物体全体が白。

単なる「白い品種」にしない。

背景は暗いチャコール〜黒。

## 特に重要

```text
flower-dahlia.jpg
prototype-dahlia.jpg
```

はPHASE1で交互表示するため、表示時に大きさが跳ねないようCSS側で同じ表示枠・aspect-ratio・object-fitを使用する。

---

---

# 29. 最終セルフチェック

## 通常サイト

- [ ] 最初からARGサイトに見えない
- [ ] 花の定期便サイトとして情報量が十分
- [ ] Hero4枚が自然に切り替わる
- [ ] ロゴが指定データ
- [ ] PC/SPでHeaderが崩れない
- [ ] SPで探索リセットがハンバーガー外にある
- [ ] Footer表記が完全一致

## PHASE1

- [ ] ダリアだけが重要異常
- [ ] 約0.5秒で通常／原型株を反復
- [ ] どちらの表示中でもクリック可能
- [ ] 継続利用者評価区分が表示される
- [ ] 継続利用者評価区分クリックで改変演出

## PHASE2

- [ ] 開始時は6花すべて通常色
- [ ] スクロール順に5花が白くなる
- [ ] 白くなった花は戻らない
- [ ] ダリアは最後まで通常色
- [ ] 最後にダリアが徐々に白くなる
- [ ] ダリアクリック後に初めて「定着」が出る
- [ ] 「第6段階　定着」クリックで改変演出

## PHASE3

- [ ] 異なる利用者なのにレビュー文章が完全一致
- [ ] 人物写真が徐々に似て見える
- [ ] 進行対象レビューは1件
- [ ] クリックで改変演出

## PHASE4

- [ ] 同一人物の5段階が表示される
- [ ] SPは縦並び
- [ ] 18か月画像が約3秒ごとに別人へ切り替わる
- [ ] 人物以外の構図が大きく動かない
- [ ] クリック後に人物群が中央へ収束
- [ ] 「第6段階　定着完了」
- [ ] 「基準人格モデルとの一致を確認」
- [ ] 中央画像クリックでTRUTH

## TRUTH

- [ ] 特殊品種の開発理由が説明される
- [ ] 白い原型株の正体を説明
- [ ] 一般提供株との関係を説明
- [ ] 6段階を説明
- [ ] 基準人格を説明
- [ ] 人間の白色化が身体変化ではないと説明
- [ ] 次期「生活環境導入試験」を表示
- [ ] 専門用語に平易な補足がある

## ENDING

- [ ] 通常TOPへ戻る
- [ ] 申込受付モーダル
- [ ] ending-sweetpea.jpg
- [ ] 第1段階 / SP-04
- [ ] 個人情報を表示しない
- [ ] 暗転
- [ ] X共有

## 状態管理

- [ ] リロードで壊れない
- [ ] ページ移動で壊れない
- [ ] ブラウザバックで重複演出しない
- [ ] 発見済み異常の再クリックで改変演出を再生しない
- [ ] リセットで初期状態へ戻る
- [ ] デバッグ機能が本番UIへ露出しない

---

---
