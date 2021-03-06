/// <reference path="emoji.d.ts" />
/// <reference path="source.d.ts" />
declare namespace PleromaEntity {
    type Account = {
        id: string;
        username: string;
        acct: string;
        display_name: string;
        locked: boolean;
        created_at: string;
        followers_count: number;
        following_count: number;
        statuses_count: number;
        note: string;
        url: string;
        avatar: string;
        avatar_static: string;
        header: string;
        header_static: string;
        emojis: Array<Emoji>;
        moved: Account | null;
        fields: object | null;
        bot: boolean | null;
        source?: Source;
    };
}
