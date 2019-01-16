define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var TdNomineeList = function() {
        return {
            root: {
                tdNominee: {
                  header: "Nominations",
                    accountListTable: "Td Nominee Account List Table",
                    accountNumber: "Account Number",
                    primaryHolderName: "Primary Holder Name",
                    holdingPattern: "Holding Pattern",
                    nominee: "Nominee",
                    action: "Action",
                    holdingPatternType: {
                        SINGLE: "Single",
                        JOINT: "Joint"
                    },
                    isNomineeRegistered: {
                        true: "Registered",
                        false: "Not Registered"
                    },
                    actionLabels: {
                        "SINGLE-R": "View/Edit",
                        "SINGLE-NR": "Add",
                        "JOINT-R": "View",
                        "JOINT-NR": "Know More"
                    },
                    alt: "Click here to {action}",
                    title: "Click here to {action}",
                    closePopup: "Close Pop-Up",
                    tooltipMsg1 : "Please note the facility of register nomination online is available for singly operated account only.",
                    tooltipMsg2 : "In case of accounts with multiple holders, you may download and print the Nomination Form. Get it signed by all the holders and submit it at the nearest Branch."
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
    return new TdNomineeList();
});