define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/td-payout",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation"
], function (oj, ko, $, redeemPayoutInstructionsModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        var branchId;
        self.payoutInstructions = rootParams.payoutInstructions;
        self.transferOptionsList = ko.observableArray();
        self.redeemtransferOptionsLoaded = ko.observable();
        self.additionalDetails = ko.observable(false);
        self.networkTypeLoaded = ko.observable(false);
        self.networkTypeList = ko.observableArray([]);
        self.bankDetailsListLoaded = ko.observable(false);
        self.dataModel = rootParams.dataModel;
        self.accountModule = ko.observable("");
        self.additionalBankDetails = ko.observable();
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("bank-look-up");
        self.additionalDetails.subscribe(function (newValue) {
            if (newValue) {
                self.payoutInstructions.accountId.value(self.additionalDetails().account.id.value);
                self.payoutInstructions.accountId.displayValue(self.additionalDetails().account.id.displayValue);
                self.payoutInstructions.beneficiaryName(self.additionalDetails().account.partyName);
                self.payoutInstructions.branchId(self.additionalDetails().account.branchCode);
                self.payoutInstructions.accountId.displayValue(self.additionalDetails().account.id.displayValue);
                self.payoutInstructions.bankName(self.additionalDetails().address.branchName);
                if (typeof self.payoutInstructions.address === "object") {
                    self.payoutInstructions.address.line1(self.additionalDetails().address.branchAddress.postalAddress.line1);
                    self.payoutInstructions.address.line2(self.additionalDetails().address.branchAddress.postalAddress.line2);
                    self.payoutInstructions.address.city(self.additionalDetails().address.branchAddress.postalAddress.city);
                    self.payoutInstructions.address.country(self.additionalDetails().address.branchAddress.postalAddress.country);
                } else {
                    self.payoutInstructions.address(self.additionalDetails().address.branchAddress.postalAddress);
                }
            }
        });
        self.accountChanged = ko.computed(function () {
            if (self.accountNumber()) {
                self.accountModule(self.module());
                self.accountModule.subscribe(function () {
                    self.payoutInstructions.type(null);
                    redeemPayoutInstructionsModel.fetchTransferOption().done(function (data) {
                        var tempData = data.enumRepresentations[0].data;
                        if (self.module() === "ISL") {
                            var isltransferOptionsList = tempData.filter(function (options) {
                                return options.code !== "E";
                            });
                            self.transferOptionsList(isltransferOptionsList);
                            self.redeemtransferOptionsLoaded(false);
                            self.redeemtransferOptionsLoaded(true);
                        } else {
                            self.transferOptionsList(data.enumRepresentations[0].data);
                            self.redeemtransferOptionsLoaded(false);
                            self.redeemtransferOptionsLoaded(true);
                        }
                    });
                });
            }
        });
        self.transferOption = function (event) {
            if (!self.dataModel().screenBack) {
                self.payoutInstructions.accountId.displayValue(null);
                self.payoutInstructions.account("");
                self.payoutInstructions.accountId.value(null);
                self.payoutInstructions.beneficiaryName(null);
                self.payoutInstructions.branchId(null);
                self.bankDetailsListLoaded(false);
                if (typeof self.payoutInstructions.address === "object") {
                    self.payoutInstructions.address.line1(null);
                    self.payoutInstructions.address.line2(null);
                    self.payoutInstructions.address.city(null);
                    self.payoutInstructions.address.country(null);
                } else {
                    self.payoutInstructions.address(null);
                }
                self.payoutInstructions.networkType(null);
                self.payoutInstructions.clearingCode(null);
                self.dataModel().accountNumber(null);
                self.additionalBankDetails(null);
            } else {
                self.bankDetailsListLoaded(true);
                self.networkTypeLoaded(true);
            }
            self.dataModel().screenBack = false;
            if (event.detail.value !== "" && typeof event.detail.value === "string") {
                self.payoutInstructions.type(event.detail.value);
                self.dataModel().buttonSection(true);
                if (self.payoutInstructions.type() === "E") {
                    redeemPayoutInstructionsModel.fetchNetworkType().done(function (data) {
                        self.payoutInstructions.accountId.displayValue(self.payoutInstructions.accountId.value);
                        self.dataModel().networkTypeList = data.enumRepresentations[0].data;
                        self.networkTypeLoaded(true);
                    });
                } else if (self.payoutInstructions.type() === "I") {
                    redeemPayoutInstructionsModel.fetchBankDetailsList().done(function (data) {
                        self.payoutInstructions.accountId.displayValue(self.payoutInstructions.accountId.value);
                        self.dataModel().branchList = data.branchAddressDTO;
                        self.bankDetailsListLoaded(true);
                    });
                }
            }
        };
        self.bankDetails = function () {
            if (self.payoutInstructions.clearingCode) {
                redeemPayoutInstructionsModel.fetchBranch(self.payoutInstructions.networkType(), self.payoutInstructions.clearingCode()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        };
        self.setBankCode = function (bankCode) {
            self.payoutInstructions.branchId(bankCode);
        };
        self.displayAddress = ko.observable(false);
        self.bankDetailsListHandler = function () {
            self.displayAddress(false);
            if (self.payoutInstructions.branchId()) {
                if (typeof self.payoutInstructions.branchId() === "object") {
                    branchId = self.payoutInstructions.branchId()[0];
                    self.payoutInstructions.branchId(self.payoutInstructions.branchId()[0]);
                } else {
                    branchId = self.payoutInstructions.branchId();
                }
                redeemPayoutInstructionsModel.fetchBankAddress(branchId).done(function (data) {
                    if (typeof self.payoutInstructions.address === "object") {
                        self.payoutInstructions.address.line1(data.addressDTO[0].branchAddress.postalAddress.line1);
                        self.payoutInstructions.address.line2(data.addressDTO[0].branchAddress.postalAddress.line2);
                        self.payoutInstructions.address.city(data.addressDTO[0].branchAddress.postalAddress.city);
                        self.payoutInstructions.address.country(data.addressDTO[0].branchAddress.postalAddress.country);
                    } else {
                        self.payoutInstructions.address(data.addressDTO[0].branchAddress.postalAddress);
                    }
                    for (var i = 0; i < self.dataModel().branchList.length; i++) {
                        if (self.dataModel().branchList[i].id === branchId) {
                            self.payoutInstructions.bankName(self.dataModel().branchList[i].branchName);
                            break;
                        }
                    }
                    self.displayAddress(true);
                });
            }
        };
        self.closeDialog = function () {
            $("#menuButtonDialog").hide();
        };
        self.additionalBankDetails.subscribe(function (newValue) {
            if (newValue) {
                if (typeof self.payoutInstructions.address === "object") {
                    self.payoutInstructions.address.line1(self.additionalBankDetails().branchAddress.line1);
                    self.payoutInstructions.address.line2(self.additionalBankDetails().branchAddress.line2);
                    self.payoutInstructions.address.city(self.additionalBankDetails().branchAddress.city);
                    self.payoutInstructions.address.country(self.additionalBankDetails().branchAddress.country);
                } else {
                    self.payoutInstructions.address(self.additionalBankDetails().branchAddress);
                }
                self.payoutInstructions.bankName(self.additionalBankDetails().name);
            }
        });
        self.bankLookupHandler = function () {
            self.payoutInstructions.networkType("NEFT");
            $("#menuButtonDialog").trigger("openModal");
        };
        self.dispose = function () {
            self.accountChanged.dispose();
        };
    };
});
