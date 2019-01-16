define([
    "ojL10n!resources/nls/generic"
], function (Generic) {
    "use strict";
    var myBillsLocale = function () {
        return {
            root: {
                "header": "My Bills",
                "listAria": "My Bills List",
                "dueOn": "Due On {date}",
                "pay": "Pay",
                "daysLeft": "{days} days left",
                "billsToPay": "{count} bills to pay",
                "imageText": "No bills presented due for payment",
                "noData": "No Data To Display",
                "btns": {
                    "quickRecharge": "Quick Recharge",
                    "quickBillPay": "Quick Bill Pay",
                    "viewAllBillers": "View All Billers"
                },
                "status": {
                    "OVERDUE": "Past Due",
                    "AUTOPAY": "Autopay"
                },
                messages: {
                    "paymentNotAllowed": "Last Date of Bill Payment has Passed. Late Payment not allowed by Biller!",
                    "autoPayBiller": "An autopay has been already setup for this biller, would you still like to continue?",
                    "scheduledPay": "A schedule pay has been already setup, would you still like to continue?"
                },
                heading: {
                    billPayment: "Bill Payment"
                },
                labels: {
                    continue: "Continue"
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
    return new myBillsLocale();
});
