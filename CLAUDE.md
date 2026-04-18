# Claude Code Implementation Summary

## Project Overview
研修用タイマーアプリケーション - HTML/CSS/JavaScript を使用したオフライン対応の講義・休憩タイマー

## Core Features Implemented

### 1. Timer Functionality
- **50分講義 + 10分/60分休憩** のサイクル管理
- **オーバータイム機能**: 講義時間終了後もカウントアップ継続
- **自動遷移**: 休憩終了後に自動的に講義開始
- **進捗バー**: リアルタイムで進行状況を表示

### 2. Audio System
- **3種類の音声**:
  - 警告音（デフォルト3分前）
  - 終了音（セッション完了時）
  - 経過音（オーバータイム中、デフォルト60秒間隔）
- **音声バリエーション**: 各音声タイプに3つのオプション
- **音量調整**: スライダーで0-100%調整
- **一時消音機能**: ミュートボタンで即座に切り替え
- **自動ミュート解除**: 講義・休憩開始時に自動的にミュート解除

### 3. User Interface
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **ダークモード**: ボタンで切り替え
- **フルスクリーン対応**: プレゼンテーション用
- **SVGアイコン**: 全ボタンをSVGアイコンで統一
- **テーマ別色分け**:
  - 講義中: 青色系
  - 休憩中: 緑色系
  - オーバータイム: 赤色系
  - 演習タイマー: オレンジ色系
- **フレキシブルレイアウト**:
  - タイマーフォントサイズが画面幅に応じて滑らかに変化
  - プログレスバーの幅が7桁の等幅フォント幅に自動調整
  - エディタ表示時はCSSコンテナクエリで左パネル幅に連動

### 4. Control Buttons (全SVGアイコン)
- **▶ 講義開始**: play triangle SVG
- **📖 講義開始（休憩中）**: book SVG
- **☕ 休憩開始（10分）**: Material Icons `local_cafe`
- **🍽 昼休憩開始（60分）**: Material Icons `dining`
- **⏹ 停止**: stop square SVG
- **⏱ 演習タイマー**: stopwatch SVG（停止ボタンの右側、講義中・オーバータイム中に表示）
- **円形アイコンデザイン**: 統一されたUI

### 5. Time Management
- **時間調整**: 設定画面で1分単位の調整
- **カスタム終了時刻設定**: 
  - リアルタイムで終了時刻を調整（-10分/-1分/+1分/+10分）
  - 現在時刻からの逆算タイマー機能
  - 秒は自動的に0にリセット
- **警告タイミング**: 1-10分で調整可能
- **経過音間隔**: 10-300秒で調整可能

### 6. Settings & Persistence
- **LocalStorage**: 全設定の自動保存
- **音声選択**: 各音声タイプの選択と保存
- **テスト機能**: 設定画面で音声のテスト再生
- **設定項目**:
  - 講義時間 (1-300分)
  - 休憩時間1 (1-120分)
  - 昼休憩時間 (1-120分)
  - 警告タイミング (1-10分)
  - 経過音間隔 (10-300秒)
  - 音量 (0-100%)

### 7. Exercise Timer
- **独立したタイマー**: 講義タイマーと並行して動作するサブタイマー
- **表示位置**: 講義タイマーの上にオレンジ色で表示
- **起動条件**: 講義中・オーバータイム中のみ表示（停止中・休憩中は非表示）
- **タイトル管理**:
  - 自由入力（datalistで過去の入力を候補表示、最大20件）
  - LocalStorageに履歴保存
- **時間調整**: -10/-1/+1/+10ボタン（オレンジ色）、デフォルト15分
- **終了時の動作**:
  - 次の演習が設定されていれば自動スタート
  - 未設定の場合はカウントアップ（オーバータイム、赤色）
- **次の演習パネル**:
  - 演習タイマーの右側に縦3行配置（ラベル / タイトル入力 / 時間＋調整ボタン）
  - 「×」ボタンで折りたたみ、「Next」ボタンで再表示
  - 演習開始時は折りたたんだ状態で起動
- **講義タイマー連動**:
  - 演習中は講義タイマーのフォントサイズを縮小（`exercise-active`クラス付与）
  - opacity 0.45 で薄表示
- **サウンド**: 講義タイマーと同一の sound1/sound2/sound3 を使用
- **停止**: 赤い⏹ボタンまたは講義タイマー停止時に連動停止

### 8. Editor Integration
- **WYSIWYG エディタ**: Quill.js ベースのリッチテキストエディタ
- **分割画面レイアウト**: タイマーとエディタを左右に配置
- **リサイズ可能**: マウスドラッグで左右の幅を調整（30%-70%制約）
- **動的リサイズ**:
  - エディタとタイマーの割合を変更すると、タイマーのフォントサイズが自動調整
  - CSSコンテナクエリを使用して左パネル幅に連動
- **ズーム機能**: 50%-200%の範囲でエディタ表示を拡大/縮小
- **ドキュメント管理**:
  - 複数ドキュメントの保存・読込・削除
  - タイトル自動生成（本文の最初の行から抽出）
  - ドロップダウンで切り替え
  - LocalStorage による永続化
- **レスポンシブ**: 狭い画面でコンパクトレイアウトに自動切り替え

### 9. Data Management
- **エクスポート/インポート**: JSON形式で全設定とドキュメントを一括管理
- **タブ型設定画面**:
  - 時間設定タブ
  - 言語・サウンド設定タブ
  - データ管理タブ
  - ライセンス表示タブ
  - サポート（Buy Me a Coffee）タブ
- **データバリデーション**: インポート時の検証機能
- **選択コピー**: テキストエリアの一括選択機能
- **ローカルストレージ消去**: すべてのデータを削除して初期状態に戻す機能

### 10. Multi-language Support (i18n)
- **初回起動時の言語選択**: LocalStorageにデータがない場合、言語選択ダイアログを表示
- **日本語/英語切り替え**: 設定画面で言語選択
- **動的UI更新**: 言語変更時に即座にUIを更新
- **対応範囲**:
  - 設定画面の全ラベル
  - タブ名・ボタンテキスト
  - 音声選択ドロップダウン
  - ツールチップ（全ボタン）
  - 確認ダイアログメッセージ
  - 演習タイマー関連ラベル・プレースホルダー（`data-i18n-placeholder` / `data-i18n-title` 属性）
- **永続化**: 言語設定をLocalStorageに保存

## Technical Implementation

### File Structure
```
l_timer/
├── index.html              # メイン HTML
├── css/
│   ├── styles.css          # メインスタイルシート
│   └── quill.snow.css      # Quill.js テーマ
├── js/
│   ├── app.js              # タイマーアプリケーション
│   ├── editor.js           # エディタマネージャー
│   ├── document.js         # ドキュメント管理
│   ├── resizer.js          # リサイズマネージャー
│   ├── data-manager.js     # データエクスポート/インポート
│   └── i18n.js             # 多言語対応
├── lib/
│   └── quill.min.js        # Quill.js ライブラリ
├── audio/
│   ├── sound1-1.wav        # 警告音1
│   ├── sound1-2.wav        # 警告音2
│   ├── sound1-3.wav        # 警告音3
│   ├── sound2-1.wav        # 終了音1
│   ├── sound2-2.wav        # 終了音2
│   ├── sound2-3.wav        # 終了音3
│   ├── sound3-1.wav        # 経過音1
│   ├── sound3-2.wav        # 経過音2
│   ├── sound3-3.wav        # 経過音3
│   └── README.md           # 音声ファイル説明
├── images/
│   └── bmc_qr.png          # Buy Me a Coffee QRコード
├── README.md               # プロジェクト説明（日本語）
├── README-en.md            # プロジェクト説明（英語）
└── CLAUDE.md               # 実装サマリー
```

### Key Technologies
- **HTML5 Audio API**: 音声再生
- **Quill.js**: WYSIWYGエディタライブラリ
- **CSS Custom Properties**: テーマシステム
- **CSS Grid/Flexbox**: レスポンシブレイアウト
- **JavaScript Classes**: オブジェクト指向設計
- **LocalStorage API**: 設定・ドキュメント・演習タイトル履歴の永続化
- **Fullscreen API**: 全画面表示
- **ResizeObserver API**: レスポンシブレイアウト監視

### CSS Architecture
- **CSS Variables**: ライト/ダークテーマ対応（`--exercise-color` など演習用変数を含む）
- **Component-based**: 再利用可能なコンポーネント
- **Mobile-first**: レスポンシブデザイン
- **Animations**: ホバー効果とトランジション
- **Flexbox Modal**: 固定高さでスクロール可能な設定画面
- **CSS Container Queries**: エディタ表示時にタイマー部分の幅に応じた動的調整
- **clamp()関数**: 最小・最大値を持つ流動的なフォントサイズとレイアウト
- **等幅フォント計算**: プログレスバーの幅を7桁の等幅フォント（Courier New）幅に自動調整
- **exercise-active クラス**: 演習タイマー動作中に講義タイマーを縮小・薄表示

### JavaScript Architecture
- **TimerApp Class**: メインアプリケーションクラス（演習タイマーロジックを内包）
- **EditorManager Class**: Quill.jsエディタ管理
- **DocumentManager Class**: ドキュメント保存・読込・削除
- **ResizerManager Class**: 分割パネルのリサイズ管理
- **DataManager Class**: 設定のエクスポート/インポート
- **I18nManager Class**: 多言語対応の翻訳管理（`data-i18n-placeholder` / `data-i18n-title` 属性対応）
- **Event-driven**: DOM イベントハンドリング
- **State Management**: アプリケーション状態管理
- **Settings Persistence**: LocalStorage による設定保存

### Exercise Timer State (TimerApp内)
```javascript
exerciseMode          // boolean: 演習タイマー動作中かどうか
exerciseSetupVisible  // boolean: セットアップパネル表示中かどうか
exerciseTimeRemaining // number: 残り秒数
exerciseIsOvertime    // boolean: オーバータイム中かどうか
exerciseInterval      // setInterval ID
exerciseTitle         // string: 現在の演習タイトル
exerciseOriginalTime  // number: 開始時の秒数（進捗バー計算用）
exerciseSetupTime     // number: セットアップ画面での分数
exerciseEndTime       // Date: 終了予定時刻（clock-based timing）
nextExerciseTitle     // string: 次の演習タイトル
nextExerciseTime      // number: 次の演習の分数
exerciseTitleHistory  // string[]: タイトル履歴（LocalStorage: 'exerciseTitleHistory'）
```

## Key Features Added During Development

### Phase 1: Basic Timer
- 基本的なタイマー機能
- 音声システム
- 設定画面

### Phase 2: UI Improvements
- アイコンボタン化
- テーマシステム
- レスポンシブデザイン
- SVGアイコン実装

### Phase 3: Advanced Features
- 消音ボタン
- 休憩中講義開始ボタン
- 終了時刻カスタマイズ機能

### Phase 4: Editor Integration
- Quill.js WYSIWYGエディタ追加
- 分割画面レイアウト
- ドラッグ可能なリサイザー
- ドキュメント管理システム
- ズーム機能

### Phase 5: Data Management & i18n
- エクスポート/インポート機能
- タブ型設定画面
- 日本語/英語切り替え
- Buy Me a Coffee サポートページ
- ライセンス表示

### Phase 6: Bug Fixes & Polish
- 音声選択のデフォルト値修正
- 色の統一性改善
- ダークモードアイコン可視性改善
- 設定画面の高さ固定
- ツールチップの多言語対応
- 全アクションボタンをSVGアイコン化

### Phase 7: Exercise Timer
- 演習タイマー機能の追加
- 講義タイマー上部への表示（オレンジ）
- タイトル入力と履歴機能（datalist）
- 次の演習の事前設定と自動スタート
- 講義タイマーの縮小・薄表示連動
- i18n対応（`data-i18n-placeholder` / `data-i18n-title` 属性の新規サポート）

## Browser Compatibility
- **Chrome/Edge**: フル機能対応
- **Firefox**: 基本機能対応
- **Safari**: 基本機能対応（音声制限あり）

## Usage Notes
- オフライン動作対応
- 設定は自動保存
- 音声ファイルは事前ダウンロード推奨
- フルスクリーンモードでプレゼンテーション使用可能

## Recent Updates
- 演習タイマー機能の追加（Phase 7）
- 全アクションボタンのSVGアイコン化
- i18n の `data-i18n-placeholder` / `data-i18n-title` 属性サポート追加
- 多言語対応（日本語/英語）の実装
- 初回起動時の言語選択ダイアログ
- WYSIWYGエディタの統合
- データエクスポート/インポート機能
- ローカルストレージ完全消去機能
- ドキュメント管理システム
- 分割画面とリサイズ機能
- タブ型設定画面
- CSSコンテナクエリによる動的フォントサイズ調整
- 7桁フォント幅に連動するプログレスバー
- タイマー枠の削除（フラットデザイン化）
