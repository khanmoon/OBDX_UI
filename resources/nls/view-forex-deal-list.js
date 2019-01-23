define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";
    var viewForexDealList = function() {
        return {
            root: {
                viewForexDeal: {
                    header: "View Forex Deal Bookings",
                    moreOptions: "Show More Options",
                    lessOptions: "Show Less Options",
                    initiateDeal: "Initiate Deal",
                    cancel: "Cancel",
                    back: "Back",
                    reset: "Reset",
                    status: "Status",
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
                    dealTyAndVal: "Validity",
                    bookedAmount: "Booked Amount",
                    availableAmount: "Outstanding Amount",
                    exchgRate: "Exchange Rate",
                    settlementAccount: "Settlement Account",
                    dealAmount: "Booked Deal Amount",
                    trnscType: "Transaction Type",
                    partyDetails: "Party Details",
                    partyId: "Party ID",
                    partyName: "Party Name",
                    dealTyAndValcomposition: "{dealpatterntype} : {validity} Days",
                    transactionDetails: "Deal Details",
                    utilizedAmount: "Utilized Amount",
                    dealValidity: " and Validity",
                    pick: "Pick",
                    dealIdHeader: "Deal Number {dealNumber}",
                    dealDuration: "{validity} Day(s)",
                    lookUpAllDeals: "Show All Deals",
                    dealPatternType: {
                        S: "Spot",
                        F: "Forward"
                    },
                    errorMessage: {
                        minorError: "Only Alphanumeric is allowed.",
                        noDealsAvailable: "No Deals found for given criteria"
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
                    staticAlt: {
                        lookUpAllDeals: "Show All Deals",
                        initiateDeal: "Initiate Deal"
                    },
                    staticTitle: {
                        lookUpAllDeals: "Show All Deals",
                        initiateDeal: "Initiate Deal"
                    },
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    closePopup: "Close Pop-Up",
                    search: "Search",
                    select: "Please Select",
                    typeDealNum: "Type Deal Number",
                    searchDealNo: "Search Deal Number"
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
    return new viewForexDealList();
});