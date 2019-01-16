define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var userListDetailsLocale = function() {
        return {
            root: {
                header: {
                    userList: "Search Results",
                    userID: "User ID",
                    contact: "Contact Details",
                    initials: "Initials",
                    mapping: "Mapping",
                    details: "User List Details",
                    fullName: "Full Name",
                    userName: "User Name"
                },
                info: {
                    recordNotFound: "No such record found."
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
    return new userListDetailsLocale();
});