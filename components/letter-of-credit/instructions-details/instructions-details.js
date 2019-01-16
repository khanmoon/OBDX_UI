define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model"
], function (oj, ko, $, InstuctionsModel) {
    "use strict";
    return function (params) {
        var self = this,chargesAccountLabel;
        ko.utils.extend(self, params.rootModel);
        self.chargesAccountValue = ko.observable();
        self.chargesBorneBy = ko.observable();
        self.stageIndex = params.index;
        self.showChargesAccount = ko.observable(false);
        self.availableBalance = ko.observable();
        if (self.mode() === "EDIT") {
            if (self.letterOfCreditDetails.confirmationInstruction() !== null) {
                self.chargesBorneBy(self.letterOfCreditDetails.confirmationInstruction());
            } else {
                self.chargesBorneBy([]);
            }
            if (self.letterOfCreditDetails.chargingAccountId.value() !== null) {
                self.chargesAccountValue(self.letterOfCreditDetails.chargingAccountId.value());
                chargesAccountLabel = self.chargesAccountList.filter(function (data) {
                    return data.value === self.letterOfCreditDetails.chargingAccountId.value();
                });
                if (chargesAccountLabel && chargesAccountLabel.length > 0) {
                    self.letterOfCreditDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
                    self.availableBalance(params.baseModel.formatCurrency(chargesAccountLabel[0].availableBalance.amount, chargesAccountLabel[0].availableBalance.currency));
                }
            } else {
                self.chargesAccountValue(null);
            }
        }
        self.chargesBorneByTypeOptions = ko.observableArray([
            {
                value: "BYAPPLICANT",
                label: self.resourceBundle.instructionsDetails.labels.BYAPPLICANT
            },
            {
                value: "BYCOUNTERPARTY",
                label: self.resourceBundle.instructionsDetails.labels.BYCOUNTERPARTY
            }
        ]);
        self.chargesBorneByChangeHandler = function (event) {
            if (event.detail.value) {
                self.letterOfCreditDetails.confirmationInstruction(event.detail.value);
            }
        };
        self.chargesAccountChangeHandler = function (event) {
            if (event.detail.value) {
                self.letterOfCreditDetails.chargingAccountId.value(event.detail.value);
                var chargesAccount = event.detail.value;
                chargesAccountLabel = self.chargesAccountList.filter(function (data) {
                    return data.value === chargesAccount;
                });
                if (chargesAccountLabel && chargesAccountLabel.length > 0) {
                    self.letterOfCreditDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
                    self.availableBalance(params.baseModel.formatCurrency(chargesAccountLabel[0].availableBalance.amount, chargesAccountLabel[0].availableBalance.currency));
                }
            }
        };
        self.verifyCode = function () {
            var trackerSwift;
            trackerSwift = document.getElementById("advBankSwiftCode");
            if(trackerSwift.valid === "valid"){
              if (!self.bicCodeError()) {
                  InstuctionsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                      self.additionalBankDetails(data);
                  }).fail(function () {
                      self.letterOfCreditDetails.swiftId("");
                  });
              }
            }else {
                trackerSwift.showMessages();
                trackerSwift.focusOn("@firstInvalidShown");
            }
        };
        self.resetCode = function () {
            self.additionalBankDetails(null);
            self.letterOfCreditDetails.swiftId("");
        };
        self.continueFunc = function () {
          var tracker = document.getElementById("insturctionsValidationTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            self.stages[self.stageIndex() + 1].expanded(true);
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
    };
});
