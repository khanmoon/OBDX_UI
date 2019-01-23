define([
    "ojL10n!resources/nls/messages-payments",
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common"

], function(Messages, Generic, Common) {
    "use strict";
    var ForexdealBooking = function() {
        return {
            root: {
                forexDealBooking: {
                    applyDeal: "Apply Forex Deal",
                    preBookedDeals: "Pre Booked Deals",
                    yes: "Yes",
                    no: "No",
                    listDeals: "List Deals",
                    pleaseSelect: "Please Select",
                    usePreExistingDeals: "Use Pre-existing Deals",
                    dealNumber: "Deal Number",
                    lookUpDealNo: "Look Up Deal Number",
                    lookUpDealNoTitle: "Look Up Deal Number",
                    invalidError: "Please enter a valid Deal Number",
                    dealType: "Deal Type",
                    exchangeRate: "Exchange Rate",
                    searchDealNumber: "Search Deal Number",
                    spot: "Spot",
                    forward: "Forward",
                    invalidDealNo: "Invalid Deal Number"
                },

                generic: Generic,
                common: Common.payments.common,
                messages: Messages
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
    return new ForexdealBooking();
});