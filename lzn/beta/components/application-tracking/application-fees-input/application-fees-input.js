define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/application-fees-input"
], function (oj, ko, $, ApplicationFeesInputModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, index, i = 0, collectString, getNewKoModel = function (model) {
                var KoModel = ApplicationFeesInputModel.getNewModel(model);
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.index = 0;
        self.feesLoaded = ko.observable(false);
        self.feesCollectionLoaded = ko.observable(false);
        self.areAllFeesSelected = ko.observable(false);
        self.isAccountSelected = ko.observable(false);
        self.accountOptions = ko.observable([]);
        self.selectedAccount = ko.observable("");
        self.isCollectAnywhere = ko.observable(false);
        self.uplTrackingDetails().additionalInfo.applicationFeesData = getNewKoModel().applicationFeesData;
        self.validationTracker = ko.observable();
        self.currencySymbol = ko.observable();
        self.uplTrackingDetails().additionalInfo.sections[0].isComplete(false);
        self.isAccountAvailable = ko.observable(false);
        self.internalAccountOptions = ko.observable("");
        var checkIfCollectSelectedAnywhere = function () {
            for (i = 0; i < self.feeTypes.length; i++) {
                if (self.feeTypes[i].collectionType === "COLLECT") {
                    self.isCollectAnywhere(true);
                    return;
                }
            }
            self.isCollectAnywhere(false);
        };
        self.feeCollectionTypeList = ko.observable([]);
        self.feesSuccessHandler = function (data) {
            self.feeTypes = data.fees;
            for (i = 0; i < self.feeTypes.length; i++) {
                if (self.isAccountAvailable()) {
                    self.feeTypes[i].collectionType = self.feeTypes[i].collectionType === undefined ? self.feeCollectionTypeList()[0].type() : self.feeTypes[i].collectionType;
                } else {
                    self.feeTypes[i].collectionType = self.feeTypes[i].collectionType === undefined || self.feeTypes[i].collectionType.toLowerCase() === collectString.toLowerCase() ? self.feeCollectionTypeList()[0].type() : self.feeTypes[i].collectionType;
                }
            }
            checkIfCollectSelectedAnywhere();
            self.currencySymbol(rootParams.baseModel.formatCurrency("1", data.fees[0].amount.currency));
            self.currencySymbol(self.currencySymbol().split("."));
            self.currencySymbol(self.currencySymbol()[0].replace(/[0-9]/g, ""));
            self.updateData();
            self.feesLoaded(true);
        };
        self.updateData = function () {
            for (index = 0; index < self.feeCollectionTypeList().length; index++) {
                self.feeCollectionTypeList()[index].amount(0);
                self.feeCollectionTypeList()[index].feesForThisType([]);
                self.feeCollectionTypeList()[index].showData(false);
            }
            self.areAllFeesSelected(true);
            for (i = 0; i < self.feeTypes.length; i++) {
                for (index = 0; index < self.feeCollectionTypeList().length; index++) {
                    if (self.feeTypes[i].collectionType.toLowerCase() === self.feeCollectionTypeList()[index].type().toLowerCase()) {
                        self.feeCollectionTypeList()[index].showData(false);
                        self.feeCollectionTypeList()[index].amount(self.feeCollectionTypeList()[index].amount() + self.feeTypes[i].amount.amount);
                        var length = self.feeCollectionTypeList()[index].feesForThisType().length;
                        self.feeCollectionTypeList()[index].feesForThisType()[length] = {
                            name: ko.observable(self.feeTypes[i].description),
                            amount: ko.observable(self.feeTypes[i].amount.amount)
                        };
                        self.feeCollectionTypeList()[index].showData(true);
                    }
                }
            }
        };
        self.collectionTypeSelected = function (event) {
            if (event.detail.value) {
                var feeTypesIndex = event.detail.value.split(",")[0];
                var value = event.detail.value.split(",")[1];
                self.feeTypes[Number(feeTypesIndex)].collectionType = value;
                self.updateData();
                checkIfCollectSelectedAnywhere();
            }
        };
        ApplicationFeesInputModel.fetchAccounts().done(function (data) {
            if (data.accounts === undefined || data.accounts.length === 0) {
                self.isAccountAvailable(false);
            } else {
                self.internalAccountOptions(data.accounts);
                self.isAccountAvailable(true);
            }
            ApplicationFeesInputModel.fetchCollectionType().done(function (data) {
                for (index = 0; index < data.enumRepresentations[0].data.length; index++) {
                    self.feeCollectionTypeList()[index] = {
                        type: ko.observable(data.enumRepresentations[0].data[index].code),
                        displayName: ko.observable(data.enumRepresentations[0].data[index].description),
                        amount: ko.observable(0),
                        feesForThisType: ko.observableArray(),
                        showData: ko.observable(false)
                    };
                }
                if (!self.isAccountAvailable()) {
                    for (index = 0; index < self.feeCollectionTypeList().length; index++) {
                        if (self.feeCollectionTypeList()[index].type().toLowerCase() === collectString.toLowerCase()) {
                            self.feeCollectionTypeList().splice(index, 1);
                        }
                    }
                }
                self.feesCollectionLoaded(true);
                ApplicationFeesInputModel.fetchAppFees(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                    self.feeTypes = data.fees;
                    for (i = 0; i < self.feeTypes.length; i++) {
                        if (self.isAccountAvailable()) {
                            self.feeTypes[i].collectionType = self.feeTypes[i].collectionType === undefined ? self.feeCollectionTypeList()[0].type() : self.feeTypes[i].collectionType;
                        } else {
                            self.feeTypes[i].collectionType = self.feeTypes[i].collectionType === undefined || self.feeTypes[i].collectionType.toLowerCase() === collectString.toLowerCase() ? self.feeCollectionTypeList()[0].type() : self.feeTypes[i].collectionType;
                        }
                    }
                    checkIfCollectSelectedAnywhere();
                    self.currencySymbol(rootParams.baseModel.formatCurrency("1", data.fees[0].amount.currency));
                    self.currencySymbol(self.currencySymbol().split("."));
                    self.currencySymbol(self.currencySymbol()[0].replace(/[0-9]/g, ""));
                    self.updateData();
                    self.feesLoaded(true);
                });
            });
        });
        self.selectedAccount.subscribe(function (newValue) {
            if (newValue !== "" && newValue) {
                self.isAccountSelected(true);
            }
        });
        self.submitApplicationFeesInfo = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var feesToBeSent = [];
            for (i = 0; i < self.feeTypes.length; i++) {
                feesToBeSent[i] = {
                    id: self.feeTypes[i].id,
                    amount: self.feeTypes[i].amount,
                    collectionType: self.feeTypes[i].collectionType
                };
            }
            if (!self.isCollectAnywhere()) {
                ApplicationFeesInputModel.updateFeesCollection(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), { fees: feesToBeSent });
            } else {
                var accountToBeSent = {
                    id: self.selectedAccount()[0],
                    type: "L"
                };
                ApplicationFeesInputModel.updateFeesCollection(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), {
                    fees: feesToBeSent,
                    account: accountToBeSent
                });
            }
            self.uplTrackingDetails().additionalInfo.sections[1].isComplete(true);
            self.additionalInfoAccordion().open(3);
        };
    };
});