/// <reference path="account.d.ts" />
/// <reference path="urls.d.ts" />
/// <reference path="stats.d.ts" />
declare namespace MastodonEntity {
    type Instance = {
        uri: string;
        title: string;
        description: string;
        email: string;
        version: string;
        thumbnail: string | null;
        urls: URLs;
        stats: Stats;
        languages: Array<string>;
        contact_account: Account | null;
        max_toot_chars?: number;
        registrations?: boolean;
    };
}
