define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var ReviewAddEditNominee = function() {
        return {
            root: {
                reviewNominee: {
                    addNominee: "Add Nominee",
                    editNominee: "Edit Nominee",
                    accountNumber: "Account Number",
                    nomineeName: "Nominee Name",
                    nomineeDOB: "Nominee Date of Birth",
                    relationShip: "Relationship",
                    nomineeAddress: "Nominee Address",
                    minorText: "Guardian details since nominee is a minor below 18 years:",
                    isMinorValue: {
                        true: "Yes",
                        false: "No"
                    },
                    nominationDetails: "Nomination Details",
                    guardianName: "Guardian Name",
                    guardianAddress: "Guardian Address",
                    editSuccessMessage: "Edit Nominee Successful.",
                    addSuccessMessage: "Add nominee Successful.",
                    addReviewHeaderMsg: "You initiated a request for adding nominee details. Please review details before you confirm!",
                    editReviewHeaderMsg: "You initiated a request for editing nominee details. Please review details before you confirm!"
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
    return new ReviewAddEditNominee();
});