import { Account } from './account.js'

export type InstanceRule = {
  id: string
  text: string
  hint?: string
  translations?: Record<string, { text: string; hint: string }>
}

// Account型とRule型は別途定義されているものと仮定します
// type Account = { /* ... */ };
// type Rule = { /* ... */ };

export type Instance = {
  /** サーバーのドメイン名 */
  domain: string
  /** Webサイトのタイトル */
  title: string
  /** インストールされているMastodonのバージョン */
  version: string
  /** AGPLライセンス要件に基づくソースコードのURL */
  source_url: string
  /** 管理者によって定義された短い説明文 */
  description: string
  /** このサーバーの利用状況データ */
  usage: {
    /** ユーザー関連の利用状況 */
    users: {
      /** 過去4週間のアクティブユーザー数 */
      active_month: number
    }
  }
  /** このサーバーを代表する画像 */
  thumbnail: {
    /** サムネイル画像のURL */
    url: string
    /** BlurHash (optional) */
    blurhash?: string
    /** 高DPIスクリーン用の解像度別リンク (optional) */
    versions?: {
      /** 1x解像度のサムネイルURL (optional) */
      '@1x'?: string
      /** 2x解像度のサムネイルURL (optional) */
      '@2x'?: string
    }
  }
  /** サーバー設定アイコンの利用可能なサイズ一覧 (4.3.0で追加) */
  icon?: Array<{
    /** アイコンのURL */
    src: string
    /** アイコンのサイズ ("幅x高さ" 形式) */
    size: string
  }>
  /** Webサイトとスタッフの主要言語 (ISO 639-1コード) */
  languages: string[]
  /** このWebサイトの設定値と制限 */
  configuration: {
    /** クライアントアプリ用のURL */
    urls: {
      /** ストリーミングAPIのWebsockets URL */
      streaming: string
      /** サーバーステータスページのURL (4.1.0で追加, nullable) */
      status?: string | null
      /** サーバーの「約」ページのURL (4.4.0で追加) */
      about?: string
      /** プライバシーポリシーのURL (4.4.0で追加, nullable) */
      privacy_policy?: string | null
      /** 利用規約のURL (4.4.0で追加, nullable) */
      terms_of_service?: string | null
    }
    /** VAPID公開鍵 (4.3.0で追加) */
    vapid?: {
      /** VAPID公開鍵 */
      public_key: string
    }
    /** アカウント関連の制限 */
    accounts: {
      /** アカウントごとに許可される最大フィーチャータグ数 */
      max_featured_tags: number
      /** アカウントごとに許可される最大固定ステータス数 (4.3.0で追加) */
      max_pinned_statuses?: number
    }
    /** ステータス投稿関連の制限 */
    statuses: {
      /** ステータスあたりの最大許容文字数 */
      max_characters: number
      /** ステータスに追加できるメディア添付ファイルの最大数 */
      max_media_attachments: number
      /** ステータス内の各URLが占めるとみなされる文字数 */
      characters_reserved_per_url: number
    }
    /** メディア添付ファイル関連の制限 */
    media_attachments: {
      /** アップロード可能なMIMEタイプ */
      supported_mime_types: string[]
      /** 説明文の最大文字数 (4.4.0で追加) */
      description_limit?: number
      /** アップロード可能な画像の最大サイズ (バイト単位) */
      image_size_limit: number
      /** 画像の最大ピクセル数 (幅 x 高さ) */
      image_matrix_limit: number
      /** アップロード可能な動画の最大サイズ (バイト単位) */
      video_size_limit: number
      /** 動画の最大フレームレート */
      video_frame_rate_limit: number
      /** 動画の最大ピクセル数 (幅 x 高さ) */
      video_matrix_limit: number
    }
    /** 投票関連の制限 */
    polls: {
      /** 投票ごとに許可される最大選択肢数 */
      max_options: number
      /** 投票の各選択肢の最大文字数 */
      max_characters_per_option: number
      /** 投票の最短許容期間 (秒) */
      min_expiration: number
      /** 投票の最長許容期間 (秒) */
      max_expiration: number
    }
    /** 翻訳API関連のヒント */
    translation: {
      /** 翻訳APIが利用可能かどうか */
      enabled: boolean
    }
    /** 連合が許可ドメインのみに制限されているか (4.4.0で追加) */
    limited_federation?: boolean
  }
  /** このWebサイトへの登録に関する情報 */
  registrations: {
    /** 登録が有効か */
    enabled: boolean
    /** 登録にモデレーターの承認が必要か */
    approval_required: boolean
    /** 登録が閉じている場合に表示されるカスタムメッセージ (nullable) */
    message: string | null
    /** 登録に必要な最低年齢 (4.4.0で追加, nullable) */
    min_age?: number | null
    /** 登録理由の入力が必要か (4.4.0で追加, nullable) */
    reason_required?: boolean | null
    /** 外部認証用のカスタム登録URL (4.2.0で追加, nullable) */
    url?: string | null
  }
  /** APIバージョン情報 (4.3.0で追加) */
  api_versions?: {
    /** MastodonのAPIバージョン番号 */
    mastodon: number
  }
  /** Webサイトの代表者への連絡先情報 */
  contact: {
    /** 問い合わせ用メールアドレス */
    email: string
    /** 問い合わせ用アカウント (nullable) */
    account: Account | null // Account型は外部で定義
  }
  /** このWebサイトのルール一覧 */
  rules: InstanceRule[] // Rule型は外部で定義
}
