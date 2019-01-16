define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/td-topup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (ko, $, TopupModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.additionalTdDetails = ko.observable();
        self.additionalSourceDetails = ko.observable();
        self.calculateMaturityLoaded = ko.observable(false);
        self.validationTracker = ko.observable();
        self.tdAccountDetailsFetched = ko.observable(false);
        self.topUpDetailsConfirm = ko.observable();
        self.tdDetails = ko.observable();
        self.currentTask = ko.observable();
        self.topUplimit = ko.observable({
            min: null,
            max: null,
            currency: null
        });
        var confirmScreenExtensions = {};
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        rootParams.dashboard.headerName(self.locale.topUp.topUp);
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerComponent("td-transactionDone", "term-deposits");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-td-topup", "term-deposits");
        if (self.params.module && self.params.module === "ISL") {
            self.calculateMaturity = ko.observable(false);
        }
        var getNewKoModel = function () {
            return ko.mapping.fromJS(TopupModel.getNewModel());
        };
        self.rootModelInstance = self.rootModelInstance || getNewKoModel();
        self.accountsParser = function (data) {
            var tempData = data;
            if (tempData.accounts) {
                var filteredAccounts = tempData.accounts.filter(function (account) {
                    return account.productDTO.facilityParameter && account.productDTO.facilityParameter.isTopupAllowed;
                });
                tempData.accounts = filteredAccounts;
            }
            return tempData;
        };
        var subscription = self.rootModelInstance.account.value.subscribe(function (value) {
            TopupModel.fetchAccountDetails(value).done(function (data) {
                self.tdAccountDetailsFetched(false);
                self.tdDetails(data.termDepositDetails);
                self.rootModelInstance.currentPrincipal.amount(self.tdDetails().availableBalance.amount);
                self.rootModelInstance.currentPrincipal.currency(self.tdDetails().availableBalance.currency);
                self.rootModelInstance.amount.currency(self.tdDetails().currencyCode);
                for (var i = 0; i < data.termDepositDetails.productDTO.amountParameters.length; i++) {
                    if (data.termDepositDetails.productDTO.amountParameters[i].currency === self.tdDetails().currencyCode) {
                        self.topUplimit().max = data.termDepositDetails.productDTO.amountParameters[i].maxAmount.amount;
                        self.topUplimit().currency = self.tdDetails().currencyCode;
                        if (data.termDepositDetails.productDTO.amountParameters[i].incrementStep > 1) {
                            self.topUplimit().min = data.termDepositDetails.productDTO.amountParameters[i].incrementStep;
                        } else {
                            self.topUplimit().min = null;
                        }
                        break;
                    }
                }
                self.tdAccountDetailsFetched(true);
            });
        });
        if (self.params.id) {
            self.rootModelInstance.account.value(self.params.id.value);
        }
        self.topUpVerifyConfirm = function () {
          self.currentTask("TD_F_OTD");

            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("topuptd"))) {
                return;
            }
            TopupModel.topUp(self.rootModelInstance.account.value(), false, ko.mapping.toJSON(self.rootModelInstance)).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.locale.topUp.topUp,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.topUpDetail.topUpReferenceNumber,
                    confirmScreenExtensions: {
                      isSet: true,
                      taskCode: self.currentTask(),
                      template: "confirm-screen/td-template"
                    }
                }, self);
            });
        };
        self.toggleTopup = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("topuptd"))) {
                return;
            }
            TopupModel.topUp(self.rootModelInstance.account.value(), true, ko.mapping.toJSON(self.rootModelInstance)).done(function (data) {
                ko.utils.extend(self.rootModelInstance, ko.mapping.fromJS(data.topUpDetail));
                rootParams.dashboard.loadComponent("review-td-topup", {
                    mode: "review",
                    data: self.rootModelInstance,
                    confirmScreenExtensions : confirmScreenExtensions
                }, self);
            });
        };
        self.calculateMaturityAmount = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("topuptd"))) {
                return;
            }
            TopupModel.topUp(self.rootModelInstance.account.value(), true, ko.mapping.toJSON(self.rootModelInstance)).done(function (data) {
                self.topUpDetailsConfirm(data);
                self.calculateMaturityLoaded(true);
            });
        };
        self.resetHandler = function () {
            self.rootModelInstance.amount.amount(null);
            self.calculateMaturityLoaded(false);
        };
        self.dispose = function () {
            subscription.dispose();
        };
    };
});
