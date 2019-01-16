define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var viewForexDealSettings = function() {
        return {
            root: {
                editForexDealSettings: {
                    header: "Forex Deal Maintenance",
                    timeLabel: "Please Enter Refresh Rate Time Period",
                    hh: "hh",
                    mm: "mm",
                    ss: "ss",
                    mins: "Min(s)",
                    secs: "Sec(s)",
                    separator: " : ",
                    label1: "Active Currency Pairs",
                    refreshTimeFrame: "Refresh Rate Window",
                    deleteAction: "Action",
                    deletemsg: "Click to delete this Currency Pair",
                    deleteIconTitle: "Click to delete this Currency Pair",
                    addPair: "Add",
                    cancel: "Cancel",
                    save: "Save",
                    back: "Back",
                    submit: "Submit",
                    reset: "Reset",
                    no: " No ",
                    yes: " Yes ",
                    reviewHeaderMsg: " Please review below settings before submitting",
                    currPairList: " Currency Pair List",
                    status: "Status",
                    transaction: "Transaction",
                    dealsListTable: "Edit Forex Deals List Table",
                    dealNumber: "Deal Number",
                    currencyLabel: "Currency",
                    currCombo: "Currency Pair",
                    currDetails: "Currency Details",
                    dealType: "Deal Type",
                    rateTypeLabel: "Transaction Type",
                    bookingDate: "Booking Date",
                    expiryDate: "Expiry Date",
                    duration: "Duration",
                    dealTyAndVal: "Deal Type and Validity",
                    bookedAmount: "Booked Amount",
                    utilizedAmount: "Utilized Amount",
                    availableAmount: "Available Amount",
                    exchgRate: "Exchange Rate",
                    settlementAccount: "Settlement Account",
                    dealAmount: "Deal Amount",
                    trnscType: "Transaction Type",
                    partyDetails: "Party Details",
                    partyId: "Party ID",
                    partyName: "Party Name",
                    dealTyAndValcomposition: "{dealpatterntype} : {validity} Days",
                    transactionDetails: "Deal Details",
                    timeVar: "{mins} min(s) : {secs} sec(s)",
                    dealPatternType: {
                        S: "Spot",
                        F: "Forward"
                    },
                    errorMessage: {
                        minorError: "Only Numeric. No Decimals or Special Characters or Alphabets.",
                        duplicateError: "{pairTemp} : Currency pair is already added to the list.",
                        noCurrSelectedToSave: " No Currency Pair selected to Save.",
                        noCurrSelectedToAdd: " No Currency Pair selected to Add.",
                        noTimeFrame: " Refresh Rate Time Frame is Mandatory when the Refresh Window is set Active.",
                        onSwitchChange: " You can add the Currency Pairs as either all Active or all In-active, but not a mixture. ",
                        validTimeFrame: " Enter a Valid Time Frame.",
                        deleteTemplateHeader: " Delete Currency Pair",
                        deleteTemplateMessage: " Are you sure you want to Delete the Currency Pair ?",
                        invalidSave: "Please Save the Edited Rows first.",
                        maxTimeLimit: " You can enter Max 60 Mins and/or 60 Secs."
                    },
                    forwardPeriodType: {
                        DAY: "1 Day",
                        WEEK: "7 Days",
                        FORTNIGHT: "15 Days",
                        MONTH: "30 Days",
                        QUARTER: "90 Days",
                        SIX_MONTHS: "180 Days",
                        YEAR: "365 Days"
                    },
                    rateType: {
                        B: "Buy",
                        S: "Sell"
                    },
                    statusCodes: {
                        A: "Active",
                        L: "Liquidated",
                        R: "Reversed",
                        C: "Canceled",
                        H: "Hold"
                    },
                    closePopup: "Close Pop-Up",
                    saveMsg: "Please click here to save",
                    saveMsgTitle: "Please click here to save",
                    editMsg: "Please click here to edit",
                    editMsgTitle: "Please click here to edit",
                    select: "Please Select",
                    typeDealNum: "Type Deal Number"
                },
                viewForexDealSettings: {
                    moveDashBoard: "Go To Dashboard"
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
    return new viewForexDealSettings();
});