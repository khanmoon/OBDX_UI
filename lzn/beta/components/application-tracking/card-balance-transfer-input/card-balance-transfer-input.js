define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/card-balance-transfer-input",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.validationTracker = ko.observable();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        if (self.transferCards()[rootParams.id].cardId()) {
            self.maskedCardNumber = ko.observable(self.transferCards()[rootParams.id].cardId());
        } else {
            self.maskedCardNumber = ko.observable("");
        }
        self.maskedCardNumber(self.applyPattern(self.maskedCardNumber(), [
            4,
            4,
            4,
            4
        ], 0));
        self.maskedCardNumber(self.maskedCardNumber().replace(/[^\-]/g, "x"));
        $(document).on("focusin", "#cardNumber" + rootParams.id, function () {
            self.maskedCardNumber(self.transferCards()[rootParams.id].cardId());
            self.maskedCardNumber(self.applyPattern(self.maskedCardNumber(), [
                4,
                4,
                4,
                4
            ], 0));
        });
        $(document).on("focusout", "#cardNumber" + rootParams.id, function () {
            if (this.value === "xxxx-xxxx-xxxx-xxxx") {
                return;
            }
            var val = this.value.replace(/\-|\d/g, "");
            if (val.length > 0) {
                this.value = null;
                self.transferCards()[rootParams.id].cardId("");
                self.maskedCardNumber("");
            } else {
                self.transferCards()[rootParams.id].cardId(this.value.replace(/\-/g, ""));
                self.maskedCardNumber(this.value.replace(/[^\-]/g, "x"));
                this.value = this.value.replace(/[^\-]/g, "x");
            }
        });
        $(document).on("keyup", "#cardNumber" + rootParams.id, function () {
            self.maskedCardNumber(this.value);
            self.maskedCardNumber(self.maskedCardNumber().replace(/\-/g, ""));
            self.maskedCardNumber(self.applyPattern(self.maskedCardNumber(), [
                4,
                4,
                4,
                4
            ], 0));
        });
    };
});