define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/cheque-details",
    "ojs/ojvalidation",
    "ojs/ojradioset",
    "ojs/ojknockout-validation"
], function (ko, $, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.chequeNo = rootParams.chequeNo;
        self.showNumberSection = ko.observable(true);
        self.validationTracker = rootParams.validator;
        self.optionSelected = rootParams.defaultOption;
        if (self.optionSelected() === "Number") {
            self.showNumberSection(true);
        } else {
            self.showNumberSection(false);
        }
        self.selectChequeDetails = function (event) {
                if (event.detail.value === "Number") {
                    self.optionSelected("Number");
                    self.chequeNo.startChequeNumber(null);
                    self.chequeNo.endChequeNumber(null);
                    self.showNumberSection(true);
                } else if (event.detail.value === "Range") {
                    self.optionSelected("Range");
                    self.chequeNo.startChequeNumber(null);
                    self.chequeNo.endChequeNumber(null);
                    self.showNumberSection(false);
                }
        };
    };
});
