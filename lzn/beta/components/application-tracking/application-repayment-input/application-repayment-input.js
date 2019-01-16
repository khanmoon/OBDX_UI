define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/application-repayment-input",
    "ojs/ojinputtext"
], function (oj, ko, $, ApplicationRepaymentInputModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, selectedAccount = "", index = 0, selectedAccountNumber = "", own, linked, external, getNewKoModel = function () {
                var KoModel = ApplicationRepaymentInputModel.getNewModel();
                return KoModel;
            }, getAccountIndex = function (accountList, account) {
                if (accountList && account) {
                    for (var loopIndex = 0; loopIndex < accountList.length; loopIndex++) {
                        if (accountList[loopIndex].id === account) {
                            return loopIndex;
                        }
                    }
                }
                return undefined;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.accountOptions = ko.observable([]);
        self.accountNumberOptions = ko.observable([]);
        self.isAccountTypeSelected = ko.observable(false);
        self.displayAccountDetails = ko.observable(false);
        self.name = ko.observable("");
        self.address = ko.observable("");
        self.accountTypeSelected = ko.observable("");
        self.validationTracker = ko.observable();
        self.externalAccountName = ko.observable("");
        self.externalAccountNumber = ko.observable("");
        self.externalInstitutionType = ko.observable("");
        self.externalInstitutionCode = ko.observable("");
        self.isExternalAccountSelected = ko.observable(false);
        self.uplTrackingDetails().additionalInfo.repaymentsInfo = getNewKoModel().repaymentsInfo;
        self.institutionCodeTypeOptions = ko.observable("");
        self.selectedInstitutionCodeType = ko.observable("");
        self.institutionCodeTypeLoaded = ko.observable(false);
        self.settlementModesLoaded = ko.observable(false);
        self.own = self.resource.own;
        self.external = self.resource.external;
        self.linkedExternal = self.resource.linkedExternal;
        self.isLinkedAccount = ko.observable(false);
        self.linkedAccNumber = ko.observableArray([]);
        self.defaultSettlementMode = ko.observable("");
        self.defaultAccountNumber = ko.observable("");
        own = self.resource.own.toLowerCase();
        linked = self.resource.linked.toLowerCase();
        external = self.resource.external.toLowerCase();
        self.removeSettlementModeOption = function (optionCode, thisOne) {
            if (thisOne) {
                for (index = 0; index < self.accountOptions().length; index++) {
                    if (self.accountOptions()[index].code.toLowerCase() === optionCode.toLowerCase()) {
                        self.accountOptions().splice(index, 1);
                        return;
                    }
                }
            } else {
                for (index = 0; index < self.accountOptions().length; index++) {
                    if (self.accountOptions()[index].code.toLowerCase() !== optionCode.toLowerCase()) {
                        self.accountOptions().splice(index, 1);
                        index = 0;
                    }
                }
            }
        };
        ApplicationRepaymentInputModel.fetchSettlementModes().done(function (data) {
            self.accountOptions(data.enumRepresentations[0].data);
            self.settlementModesLoaded(true);
            if (self.currentUser().isNewParty()) {
                self.removeSettlementModeOption(self.external, false);
                self.isExternalAccountSelected(true);
                self.isLinkedAccount(false);
            }
        });
        ApplicationRepaymentInputModel.fetchAccountsData().done(function (data) {
            self.accountNumberOptions(data.accounts);
            ApplicationRepaymentInputModel.fetchLinkAccounts().done(function (data) {
                self.linkedAccNumber(data.accounts);
                ApplicationRepaymentInputModel.fetchRepaymentData(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                    try {
                        if (data.account) {
                            self.defaultAccountNumber(data.account.id);
                            selectedAccountNumber = data.account.id;
                            var internalIndex = getAccountIndex(self.accountNumberOptions(), self.defaultAccountNumber());
                            var linkedExternalIndex = getAccountIndex(self.linkedAccNumber(), self.defaultAccountNumber());
                            if (internalIndex && !self.currentUser().isNewParty()) {
                                self.name(self.accountNumberOptions()[internalIndex].displayName);
                                self.address(self.accountNumberOptions()[internalIndex].branchName);
                                self.defaultSettlementMode("OWN");
                                selectedAccount = "OWN";
                                self.isExternalAccountSelected(false);
                                self.isLinkedAccount(false);
                                self.displayAccountDetails(true);
                            } else if (linkedExternalIndex && !self.currentUser().isNewParty()) {
                                self.name(self.linkedAccNumber()[linkedExternalIndex].displayName);
                                self.address(self.linkedAccNumber()[linkedExternalIndex].branchName);
                                selectedAccount = "LINKED_EXTERNAL";
                                self.isExternalAccountSelected(false);
                                self.isLinkedAccount(true);
                                self.displayAccountDetails(true);
                                self.defaultSettlementMode("LINKED_EXTERNAL");
                            } else {
                                self.defaultSettlementMode("EXTERNAL");
                                self.isExternalAccountSelected(true);
                                self.isLinkedAccount(false);
                                self.displayAccountDetails(false);
                                selectedAccount = "EXTERNAL";
                            }
                        }
                    } catch (error) {
                        self.isExternalAccountSelected(false);
                        self.isLinkedAccount(false);
                    }
                    self.dataLoaded(true);
                });
            });
        });
        self.accountTypeSelected = function (event) {
            if (event.detail.value) {
                if (event.detail.value.toLowerCase().indexOf(external) > -1 && event.detail.value.toLowerCase().indexOf(linked) === -1) {
                    self.isExternalAccountSelected(true);
                    self.isLinkedAccount(false);
                } else if (event.detail.value.toLowerCase().indexOf(own) > -1) {
                    self.isExternalAccountSelected(false);
                    self.isLinkedAccount(false);
                } else if (event.detail.value.toLowerCase().indexOf(external) > -1 && event.detail.value.toLowerCase().indexOf(linked) > -1) {
                    self.isExternalAccountSelected(false);
                    self.isLinkedAccount(true);
                }
                self.isAccountTypeSelected(true);
                self.uplTrackingDetails().additionalInfo.repaymentsInfo.account = event.detail.value;
                selectedAccount = event.detail.value;
            }
        };
        self.instutionCodeTypeSelected = function (event) {
            if (event.detail.value) {
                self.selectedInstitutionCodeType(event.detail.value);
            }
        };
        self.accountSelected = function (event) {
            if (event.detail.value) {
                self.uplTrackingDetails().additionalInfo.repaymentsInfo.accountNumber = event.detail.value;
                selectedAccountNumber = event.detail.value;
                var internalIndex = getAccountIndex(self.accountNumberOptions(), selectedAccountNumber);
                var linkedExternalIndex = getAccountIndex(self.linkedAccNumber(), selectedAccountNumber);
                if (internalIndex) {
                    self.name(self.accountNumberOptions()[internalIndex].displayName);
                    self.address(self.accountNumberOptions()[internalIndex].branchName);
                    self.displayAccountDetails(true);
                } else if (linkedExternalIndex) {
                    self.name(self.linkedAccNumber()[linkedExternalIndex].displayName);
                    self.address(self.linkedAccNumber()[linkedExternalIndex].branchName);
                    self.displayAccountDetails(true);
                } else {
                    self.name("");
                    self.address("");
                    self.displayAccountDetails(false);
                }
            }
        };
        self.submitRepaymentsInfo = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            ApplicationRepaymentInputModel.submitRepaymentInfo(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), {
                settlementAccountMode: selectedAccount,
                account: { id: selectedAccountNumber }
            });
            self.uplTrackingDetails().additionalInfo.sections[0].isComplete(true);
            self.additionalInfoAccordion().open(2);
        };
        self.addExternalAccount = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.uplTrackingDetails().additionalInfo.sections[0].isComplete(true);
            self.additionalInfoAccordion().open(2);
        };
    };
});