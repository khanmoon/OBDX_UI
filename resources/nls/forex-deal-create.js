define([
    "ojL10n!resources/nls/messages-payments",
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common"

], function(Messages, Generic, Common) {
    "use strict";
    var ForexdealCreate = function() {
        return {
            root: {
                info: {
                    dealCreationNotAllowedInfoMessage: "Deal initiation not allowed for the logged in party"
                },
                forexDeal: {
                    header: "Initiate Forex Deal Booking",
                    partyId: "Party ID",
                    partyName: "Party Name",
                    partyDetails: "Party Details",
                    transactionDetails: "Deal Details",
                    spot: "Spot",
                    forward: "Forward",
                    currencyDetails: "Currency Details",
                    selectCurrencyCombination: "Currency Pair",
                    pleaseSelect: "Please Select",
                    buy: "Buy",
                    amount: "Amount",
                    sell: "Sell",
                    totalDays: "Total Days",
                    totalNoDays: "{bookingDate} - {valueDate} ({noOfDays} Days)",
                    initiate: "Initiate",
                    cancel: "Cancel",
                    reviewHeaderMsg: "You initiated a request for Deal Initiation. Please review details before you confirm",
                    transType: "Transaction Type",
                    duration: "Duration",
                    currencyCombination: "Currency Combination",
                    convenienceCharges: "Convenience Charges",
                    editSuccessMessage: "You have initiated your deal successfully !",
                    exchangeRate: "Exchange Rate",
                    dealType: "Deal Type",
                    validity: "Validity",
                    errorMessageAmount: "Please enter an Amount",
                    customFrequency: "Custom Frequency",
                    selectDateRange: "Select Date Range",
                    fromDate: "From",
                    toDate: "To",
                    customDays: "{noOfDays} Day(s)",
                    openDiscPopup: "Open Exchange Rate Disclaimer",
                    openDiscPopupTitle: "Open Exchange Rate Disclaimer",
                    exchangeRateDisclaimer: "This is an indicative rate only, subject to change at the time of confirmation.",

                    forexDealListTable: "Forex Deal List",
                    forexDealList: "Forex Deal",
                    date: "Date",
                    referenceNo: "Reference Number",
                    FOREX_DEAL: "Forex Deal",
                    viewlimits : "View Limits",
                    channel : "Channel",
                    showInformation: "Select channel to view its limits",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}"
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
    return new ForexdealCreate();
});