define([
    "ojs/ojcore",
    "knockout",
    "ojs/ojdatetimepicker"
], function (oj, ko) {
    "use strict";
    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.effectiveDate1 = ko.observable();
        self.effectiveDate2 = ko.observable();
        self.minClosureDate = ko.observable();
        self.expiryDateMinusOne = ko.observable();
        self.closureDateMinusOne = ko.observable();
        self.currency = ko.observable(null);
        self.stageIndex = params.index;
        if (self.mode() === "EDIT") {
            self.currency(self.guaranteeDetails.contractAmount.currency());
        }
        self.validateGuaranteeAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0]) {
                        if (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0])) {
                            throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
                        }
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
                        }
                    }
                }
                return true;
            }
        };
        self.continueFunc = function () {
            var commitmentTracker = document.getElementById("commitmentTracker");
            if (commitmentTracker.valid === "valid") {
              self.stages[self.stageIndex()].expanded(false);
              self.stages[self.stageIndex()].validated(true);
              self.stages[self.stageIndex() + 1].expanded(true);
            }else {
                self.stages[self.stageIndex()].validated(false);
                commitmentTracker.showMessages();
                commitmentTracker.focusOn("@firstInvalidShown");
            }
        };
        self.guaranteeDetails.contractAmount.currency = ko.computed(function () {
            return self.currency();
        });
        self.expiryDateSubscribe = self.guaranteeDetails.expiryDate.subscribe(function (newValue) {
            var date = new Date(newValue);
            if (self.claimDays()) {
                date.setDate(date.getDate() + self.claimDays());
            } else {
                date.setDate(date.getDate() + 1);
            }
            var date2 = new Date(newValue);
            date2.setDate(date2.getDate() - 1);
            self.minClosureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
            self.expiryDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
        });
        self.closureDateSubscribe = self.guaranteeDetails.closureDate.subscribe(function (newValue) {
            var date2 = new Date(newValue);
            date2.setDate(date2.getDate() - 1);
            self.closureDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
        });
        self.effectiveDateSubscribe = self.guaranteeDetails.effectiveDate.subscribe(function (newValue) {
            var date = new Date(newValue);
            date.setDate(date.getDate() + 1);
            self.effectiveDate1(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
            date.setDate(date.getDate() + 1);
            self.effectiveDate2(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
            if (newValue > self.guaranteeDetails.expiryDate() && self.guaranteeDetails.expiryDate() !== self.guaranteeDetails.closureDate()) {
                self.guaranteeDetails.expiryDate(newValue);
            } else if (newValue > self.guaranteeDetails.closureDate() && self.guaranteeDetails.expiryDate() !== self.guaranteeDetails.closureDate()) {
                self.guaranteeDetails.closureDate(newValue);
            } else if (newValue > self.guaranteeDetails.expiryDate() && self.guaranteeDetails.expiryDate() === self.guaranteeDetails.closureDate()) {
                self.guaranteeDetails.expiryDate(newValue);
                self.guaranteeDetails.closureDate(newValue);
            }
        });
    };

    vm.prototype.dispose = function () {
        this.guaranteeDetails.contractAmount.currency.dispose();
        this.expiryDateSubscribe.dispose();
        this.closureDateSubscribe.dispose();
        this.effectiveDateSubscribe.dispose();
    };
    return vm;
});
