define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var TaskAspects = function() {
        return {
            root: {
                header: {
                    transactionAspects: "Transaction Aspects"
                },
                common: {
                    transaction: "Transaction",
                    reviewHeader: "Review",
                    reviewHeader1: "You initiated a request for Transaction Aspects. Please review details before you confirm!",
                    pleaseSelect: "Please Select any transaction",
                    mode: {
                        VIEW: "View",
                        EDIT: "Edit",
                        REVIEW: "Review",
                        NOASPECTS: "View"
                    },
                    message: "No aspects found for this transaction",
                    aspects: "Aspects",
                    "grace-period": "Grace Period",
                    "account-access": "Account Access",
                    "working-window": "Working Window",
                    "account-relationship": "Customer Relationship Matrix",
                    limit: "Limits",
                    approval: "Approval",
                    audit: "Audit",
                    blackout: "Transaction Blackout",
                    "2fa": "2 Factor Authentication",
                    ereceipt: "E-Receipt",
                    maintenance: "Maintenance"
                },
                generic: Generic.common
            },
            ar: false,
            fr: true,
            cs: false,
            sv: false,
            en: false,
            "en-us": false,
            el: false
        };
    };
    return new TaskAspects();
});