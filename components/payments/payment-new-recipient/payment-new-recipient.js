define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/payment-new-recipient",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation"
], function(oj, ko, $, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.transferMode = ko.observable();
        self.validationTracker = ko.observable();
        self.isPeerToPeer = ko.observable(true);
        rootParams.baseModel.registerComponent("payment-peer-to-peer", "payments");
        self.transferModeChange = function(event) {
            if (event.detail.value) {
                self.isPeerToPeer((event.detail.value === "EMAIL" || event.detail.value === "MOBILE"));
            }
        };
        self.transferModeArray = ko.observableArray([{
                code: "EMAIL",
                value: self.payments.email
            },
            {
                code: "MOBILE",
                value: self.payments.mobile
            },
            {
                code: "BANKACCOUNT",
                value: self.payments.bankAccount
            }
        ]);
    };
});