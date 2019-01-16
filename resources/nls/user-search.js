define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var UserSearchLocale = function() {
        return {
            root: {
                userSearch: {
                    header2: "Note",
                    createDescription: "This is used to map file identifiers to different users of a party. All the existing file types maintained for the party are shown, from which admin can select the file identifiers to be mapped to different users. At any stage it can be modified and new file identifiers can be mapped or existing ones can be unmapped.",
                    userfimap: "User File Identifier Mapping",
                    userList: "Users List",
                    user: "{firstName} {lastName}",
                    initials: "Initials",
                    userDetails: "User Details",
                    number: "Contact Details",
                    mapping: "Mapping",
                    back: "Back",
                    cancelTransaction: "Are you sure you want to cancel the maintenance?",
                    cancel: "Cancel",
                    viewlist: "View List"
                },
                generic: Generic
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
            "en-us": false,
            el: true
        };
    };
    return new UserSearchLocale();
});