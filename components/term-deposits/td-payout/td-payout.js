define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/td-payout",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation"
], function (oj, ko, $, payoutInstructionsModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        var transferOptions;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.transferOptionsList = ko.observableArray();
        self.transferOptionsLoaded = ko.observable();
        self.additionalDetailsTransfer = ko.observable();
        self.branchList = ko.observableArray([]);
        self.additionalBankDetails = ko.observable();
        self.displayAddress = ko.observable(false);
        self.payoutInstructions = rootParams.payoutInstructions;
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("bank-look-up");
        self.additionalDetailsTransfer.subscribe(function (newValue) {
            if (newValue) {
                self.payoutInstructions.accountId.displayValue(self.additionalDetailsTransfer().account.id.displayValue);
                self.payoutInstructions.beneficiaryName(self.additionalDetailsTransfer().account.partyName);
                self.payoutInstructions.branchId(self.additionalDetailsTransfer().account.branchCode);
                self.payoutInstructions.bankName(self.additionalDetailsTransfer().address.branchName);
                self.payoutInstructions.address.line1(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line1);
                self.payoutInstructions.address.line2(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line2);
                self.payoutInstructions.address.city(self.additionalDetailsTransfer().address.branchAddress.postalAddress.city);
                self.payoutInstructions.address.country(self.additionalDetailsTransfer().address.branchAddress.postalAddress.country);
            }
        });

        function filterTrasferOption() {
            self.transferOptionsLoaded(false);
            var options = transferOptions.filter(function (option) {
                if (rootParams.module() === "ISL" && option.code === "E") {
                    return false;
                }
                return true;
            });
            self.transferOptionsList.removeAll();
            ko.utils.arrayPushAll(self.transferOptionsList, options);
            self.transferOptionsLoaded(true);
        }
        payoutInstructionsModel.fetchTransferOption().done(function (data) {
            transferOptions = data.enumRepresentations[0].data;
            ko.utils.arrayPushAll(self.transferOptionsList, data.enumRepresentations[0].data);
            if (rootParams.module) {
                if (!self.params.id) {
                    self.moduleType.subscribe(function () {
                        filterTrasferOption();
                    });
                }
                filterTrasferOption();
            } else {
                self.transferOptionsLoaded(true);
            }
        });
        self.payoutInstructions.type.subscribe(function () {
            self.payoutInstructions.account("");
            self.payoutInstructions.accountId.value(null);
            self.payoutInstructions.accountId.displayValue(null);
            self.payoutInstructions.beneficiaryName(null);
            self.payoutInstructions.branchId(null);
            self.payoutInstructions.bankName(null);
        });
        self.payoutInstructions.branchId.subscribe(function (value) {
            self.setBankCode(value);
        });
        self.bankDetails = function () {
            if (self.payoutInstructions.clearingCode) {
                payoutInstructionsModel.fetchBranch(self.payoutInstructions.networkType(), self.payoutInstructions.clearingCode()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        };
        self.setBankCode = function (bankCode) {
            if (bankCode) {
                self.displayAddress(false);
                self.payoutInstructions.branchId(bankCode);
                if (self.payoutInstructions.branchId()) {
                    payoutInstructionsModel.fetchBankAddress(bankCode).done(function (data) {
                        ko.utils.extend(self.payoutInstructions.address, ko.mapping.fromJS(data.addressDTO[0].branchAddress.postalAddress));
                        for (var i = 0; i < self.branchList.length; i++) {
                            if (self.branchList[i].id === self.payoutInstructions.branchId()) {
                                self.payoutInstructions.bankName(self.branchList[i].branchName);
                                break;
                            }
                        }
                        self.displayAddress(true);
                    });
                }
            }
        };
        self.additionalBankDetails.subscribe(function (newValue) {
            if (newValue) {
                ko.utils.extend(self.payoutInstructions.address, ko.mapping.fromJS(self.additionalBankDetails().branchAddress));
                self.payoutInstructions.bankName(self.additionalBankDetails().name);
            }
        });
        self.bankLookupHandler = function () {
            self.payoutInstructions.networkType("NEFT");
            $("#menuButtonDialog").trigger("openModal");
        };
        var maturityInstructionSubscribe;
        if(self.rollOverType){
        maturityInstructionSubscribe = self.rollOverType.subscribe(function() {
          self.payoutInstructions.type("");
        });
        }
        else if(self.rootModelInstance.createTDData && self.rootModelInstance.createTDData.rollOverType){
          maturityInstructionSubscribe = self.rootModelInstance.createTDData.rollOverType.subscribe(function() {
            self.payoutInstructions.type("");
          });
        }
        self.dispose = function () {
          if(maturityInstructionSubscribe){
            maturityInstructionSubscribe.dispose();
          }

        };
    };
});
