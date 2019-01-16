define([
    "ojs/ojcore",
    "knockout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (oj, ko) {
    "use strict";
    var vm = function (params) {
        var self = this,chargesAccountLabel;
        ko.utils.extend(self, params.rootModel);
        self.chargesAccountValue = ko.observable();
        self.availableBalance = ko.observable();
        self.stageIndex = params.index;
        if (self.mode() === "EDIT") {
            if (self.guaranteeDetails.chargingAccountId.value() !== null) {
                self.chargesAccountValue(self.guaranteeDetails.chargingAccountId.value());
                chargesAccountLabel = self.chargesAccountList.filter(function (data) {
                    return data.value === self.guaranteeDetails.chargingAccountId.value();
                });
                if (chargesAccountLabel && chargesAccountLabel.length > 0) {
                    self.guaranteeDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
                }
            } else {
                self.chargesAccountValue([]);
            }
        }
        self.chargesAccountValueSubscribe = self.chargesAccountValue.subscribe(function (newValue) {
            var chargesAccount = newValue;
            self.guaranteeDetails.chargingAccountId.value(chargesAccount);
            var chargesAccountLabel = self.chargesAccountList.filter(function (data) {
                return data.value === chargesAccount;
            });
            if (chargesAccountLabel && chargesAccountLabel.length > 0) {
                self.guaranteeDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
            }
        });
        self.continueFunc = function () {
            var instructionsTracker = document.getElementById("instructionsTracker");
            if (instructionsTracker.valid === "valid") {
              self.stages[self.stageIndex()].expanded(false);
              self.stages[self.stageIndex()].validated(true);
              self.stages[self.stageIndex() + 1].expanded(true);
            }else {
                self.stages[self.stageIndex()].validated(false);
                instructionsTracker.showMessages();
                instructionsTracker.focusOn("@firstInvalidShown");
            }
        };
    };
    vm.prototype.dispose = function () {
        this.chargesAccountValueSubscribe.dispose();
    };
    return vm;
});
