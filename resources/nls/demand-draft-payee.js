define([
    "ojL10n!resources/nls/messages-payments",
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common"

], function(Messages, Generic, Common) {
    "use strict";
    var TransactionLocale = function() {
        return {
            root: {
                payments: {
                    addrecipient_header: "Add Payee",
                    cancelConfirm: "Are you sure you want to cancel the operation?",
                    reviewHeaderInternational: "You initiated a request for International Demand Draft Payee. Please review details before you confirm!",
                    coolingPeriod: "Cooling Period Details",
                    duration: "Duration",
                    cumulativeAmount: "Cumulative Amount",
                    coolingPeriodmsz: "For the safety of your account, the fund transfer facility through Digital Platform will be available only after the following cooling period for newly added payees.",
                    demandDraftPayee: {
                        newPayee: "Transaction",
                        confirmLimit: "Payee Limit"
                    },
                    payee: {
                        SHARED: "Public",
                        NONSHARED: "Private",
                        pendingApproval: "Pending Approval",
                        demanddraft: "Demand Draft",
                        recipientname: "Payee Name",
                        drafttype: "Draft Type",
                        accdomestic: "Domestic",
                        accinternational: "International",
                        payeeaccesstype: "Access Type",
                        add: "Add",
                        addedtolist: "{name} added to your Payee list.",
                        issuedd: "You can now issue a Demand Draft to {name}.",
                        success: "Successful!",
                        payeelimitmsg: "Do you want to set daily limit for this payee?",
                        payeelimit: "Set Daily Limit",
                        review: "Review",
                        limitsuccessmsg: "Your Limit has been updated.",
                        RES: "Residence",
                        PST: "Postal",
                        WRK: "Work",
                        view: "View / Edit Payee",
                        transactionMessage: {
                            demandDraft: "Register Demand Draft"
                        },
                        confirmScreen: {
                            successMessage: "Payee added successfully.",
                            corpMaker: "Your request has been initiated successfully."
                        },
                        labels: {
                            deliveryLocation: "Delivery Location",
                            pay: "Pay",
                            viewedit: "View/Edit",
                            delete: "Delete",
                            accountName: "Account Name",
                            nickname: "Nickname",
                            acctype: "Account Type",
                            payvia: "Pay Via",
                            bnkdetails: "Bank Details",
                            dailylimit: "Daily Limit",
                            monthlylimit: "Monthly Limit",
                            payeename: "Payee Name : {name}",
                            transferMode: "Transfer Mode",
                            transferValue: "Transfer Value",
                            branchCode: "Branch Code",
                            accountNumber: "Account Number",
                            drafttype: "Draft Type",
                            payAtCity: "Pay At City",
                            payAtCountry: "Pay At Country",
                            notset: "Not Set",
                            deletePayee: "Delete Payee",
                            edit: "Edit",
                            amount: "Amount"
                        },
                        type: {
                            DEMANDDRAFT: "Demand Draft",
                            DOM: "Domestic",
                            INT: "International"
                        },
                        message: {
                            limitset: "Limit set successfully",
                            limitSetTom: "Limit set successfully and will be effective from tomorrow.",
                            efffromtom: "{amount}, effective from tomorrow"
                        },
                        coolingPeriod: {
                            days: "Up to {days} day(s)",
                            hours: "Up to {hours} hour(s)",
                            minutes: "Up to {minutes} minute(s)",
                            daysHours: "Up to {days} day(s) {hours} hour(s)",
                            daysMinutes: "Up to {days} day(s) {minutes} minute(s)",
                            hoursMinutes: "Up to {hours} hour(s) {minutes} minute(s)",
                            daysHoursMinutes: "Up to {days} day(s) {hours} hour(s) {minutes} minute(s)"
                        }
                    },
                    common: Common.payments.common,

                    messages: Messages,
                    generic: Generic
                }
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
    return new TransactionLocale();
});