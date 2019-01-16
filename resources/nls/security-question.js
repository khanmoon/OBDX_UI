define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var SecurityQuestionLocale = function() {
        return {
            root: {
                securityQuestion: {
                    labels: {
                        notMaintained: "Security Questions has not been set up yet",
                        setUpNow: "Set up now",
                        securityQuestion: "Security Question",
                        questions: "Questions",
                        edit: "Edit",
                        addMore: "Add More",
                        question_list: "Question",
                        maintenance:"Maintenance"
                    },
                    headers: {
                        securityQuestion: "Security Question Maintenance",
                        VIEW: "View",
                        EDIT: "Edit",
                        CREATE: "Create",
                        REVIEW: "Review",
                        CONFIRM: "Confirm"
                    },
                    status: {
                        PENDING_APPROVAL: "In Progress",
                        REJECTED: "Rejected",
                        APPROVED: "Processed",
                        INITIATED: "Initiated",
                        COMPLETED: "Processed",
                        EXPIRED: "Expired",
                        MODIFICATION_REQUESTED: "Modification Requested"
                    },
                    messages: {
                        pleaseSelect: "Please select",
                        sec_que_placeHolder: "Type a question. Eg: What is your mother's maiden name ?",
                        questionsNotEntered: "No questions entered.",
                        emptyQuestion: "Question is empty.",
                        reviewHeader: "Review",
                        reviewHeader1: "You initiated a request for Security Question Maintenance. Please review details before you confirm!"
                    },
                    hardCodedValue: {
                        space: ""
                    },
                    placeholder: {
                        enterQuestion: "Please enter question."
                    }
                },
                common: Generic.common
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
    return new SecurityQuestionLocale();
});