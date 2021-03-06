/// <reference path="account.d.ts" />
/// <reference path="status.d.ts" />
/// <reference path="tag.d.ts" />
declare namespace PleromaEntity {
    type Results = {
        accounts: Array<Account>;
        statuses: Array<Status>;
        hashtags: Array<Tag>;
    };
}
