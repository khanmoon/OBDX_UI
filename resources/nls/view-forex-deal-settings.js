define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
    "use strict";
    var viewForexDealSettings = function() {
        return {
            root: {
                viewForexDealSettings: {
                    header: "Forex Deal Maintenance",
                    timeLabel: "Please Enter Refresh Rate Time Period",
                    hh: "hh",
                    mm: "mm",
                    ss: "ss",
                    mins: "Min(s)",
                    secs: "Sec(s)",
                    separator: " : ",
                    label1: "Add Currency Pair Details",
                    label2: "Selected Currency Pairs",
                    refreshTimeFrame: "Refresh Rate Window",
                    deleteAction: "Action",
                    deletemsg: "Click to delete this Currency Pair",
                    deleteIconTitle: "Click to delete this Currency Pair",
                    addPair: "Add",
                    cancel: "Cancel",
                    save: "Save",
                    back: "Back",
                    submit: "Submit",
                    confirm: "Confirm",
                    reset: "Reset",
                    reviewHeaderMsg: "Please review below settings before submitting",
                    currPairList: " Currency Pair List",
                    status: "Status",
                    editSettings: "Edit Active Pairs",
                    transaction: "Transaction",
                    moveDashBoard: "Moving To Dashboard",
                    dealsListTable: "Forex Deals List Table",
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
                    note: "Note",
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
                        validTimeFrame: " Enter a Valid Time Frame."
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
                    tooltipMsg1: "Please note the facility of register nomination online is available for singly operated account only.",
                    tooltipMsg2: "In case of accounts with multiple holders, you may download and print the Nomination Form. Get it signed by all the holders and submit it at the nearest Branch.",
                    search: "Search",
                    select: "Please Select",
                    typeDealNum: "Type Deal Number...."
                },
                generic: Generic,
                common: Common.payments.common
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