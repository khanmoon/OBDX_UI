define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var UserSecurityQuestionLocale = function() {
        return {
            root: {
                userSecurityQuestion: {
                    labels: {
                        notMaintained: "User Security Questions have not been set up yet.",
                        setUpNow: "Set up now",
                        skip: "Skip",
                        securityQuestion: "Security Question",
                        answer: "Answer",
                        select: "Select Question",
                        questions: "Questions",
                        edit: "Edit",
                        userId: "User Id",
                        createUserSecurityQuestion: "Create User Security Question",
                        resetUserSecurityQuesion: "Reset User Security Question",
                        addMore: "Add More",
                        securityQuestionNumber: "Question {number}",
                        answerNumber: "Answer {number}",
                        questionConfigErrorMsg: "Security Questions have not been maintained yet. Please contact Bank Admin."
                    },
                    headers: {
                        userSecurityQuestion: "Security Question Maintenance",
                        headerName: "Security and Login",
                        VIEW: "View",
                        EDIT: "Edit",
                        CREATE: "Create",
                        REVIEW: "Review",
                        CONFIRM: "Confirm"

                    },
                    fieldname: {
                        securityHeading: "User Security Question",
                        securityText: "Security questions may be used as second level of authentication for completing your transactions. These questions can be set up later from the menu options.",
                        securityTextLine3: "Do you want to set them up now?"
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
                        duplicateQuestions: "Duplicate questions selected. Please select different questions.",
                        sec_que_placeHolder: "Type a question. Eg: What is your mother's maiden name ?",
                        reviewHeader: "Review",
                        reviewHeader1: "You initiated a request for User Security Questions. Please review details before you confirm!"
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
    return new UserSecurityQuestionLocale();
});