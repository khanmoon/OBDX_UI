define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/debtor-money-request",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function(oj, ko, $, RequestMoneyModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function(Params) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(RequestMoneyModel.getNewModel());
                return KoModel;
            };
        if (Params.rootModel && Params.rootModel.params.isSuccess)
            ko.utils.extend(self, Params.rootModel);
        self.debtorDetails = null;
        self.RequestMoneyModel = getNewKoModel().RequestMoneyModel;
        self.customDebtorName = ko.observable();
        self.selectedDebtor = ko.observable();
        self.selectedDebtorName = ko.observable();
        self.customDebtorId = ko.observable();
        self.receivedDate = ko.observable();
        if (!Params.rootModel || !Params.rootModel.params.isSuccess)
            ko.utils.extend(self, Params.rootModel);
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        Params.dashboard.isConfirmScreenVisited(false);
        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.isRequstFromListLoaded = ko.observable(true);
        self.debtorNames = ko.observableArray();
        self.showError = ko.observable(false);
        self.currencyLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.remainingCommentChars = ko.observable(40);
        self.currency = ko.observable();
        self.additionalDetails = ko.observable();
        self.isDebtorListEmpty = ko.observable(false);
        self.DebtorListRefresh = ko.observable(false);
        self.dropDownActive = ko.observable();
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.instructionId = ko.observable();
        self.externalReferenceId = ko.observable("");
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.isDateLoaded = ko.observable(true);
        self.minReceivedDate = ko.observable();
        self.debtorListExpandAll = ko.observableArray();
        self.debtorSubList = ko.observableArray();
        self.debtorSubListExpandAll = ko.observableArray();
        Params.dashboard.headerName(self.debtors.requestMoney);
        Params.baseModel.registerElement([
            "account-input",
            "amount-input",
            "comment-box",
            "confirm-screen"
        ]);
        Params.baseModel.registerComponent("add-new-debtor", "debtor");
        Params.baseModel.registerComponent("otp-verification", "payments");
        Params.baseModel.registerComponent("review-debtor-money-request", "debtor");
        self.setDebtor = function(data) {
            self.customDebtorName(data.nickName);
            self.customDebtorId(data.debtorId);
            self.RequestMoneyModel.payerId(data.debtorId);
            self.dropDownActive(false);
            self.DebtorListRefresh(false);
        };
        RequestMoneyModel.getDebtorList().done(function(data) {
            for (var i = 0; i < data.payerGroups.length; i++) {
                self.debtorListExpandAll.push({
                    debtorGroupName: data.payerGroups[i].name,
                    debtorList: data.payerGroups[i].listPayers
                });
            }
            if (data.payerGroups.length === 0) {
                self.isDebtorListEmpty(true);
            }
            if (self.debtorDetails !== null) {
                self.selectedDebtor(self.debtorDetails.name);
                self.debtorChanged(null, { option: "value" });
            }
        });
        self.refreshDropDown = function() {
            self.DebtorListRefresh(false);
            self.customDebtorName(null);
            self.debtorDetails = null;
            self.RequestMoneyModel.amount.amount("");
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.value("");
            self.receivedDate("");
            self.RequestMoneyModel.remarks("");
            self.selectedDebtor("");
            self.dropDownActive(false);
            self.DebtorListRefresh(true);
        };
        self.getHostDate = function() {
            RequestMoneyModel.getHostDate().done(function(data) {
                var date = new Date(data.currentDate.valueDate);
                self.currentDate(Params.baseModel.formatDate(date));
                date.setDate(date.getDate() + 1);
                self.tomorrow(Params.baseModel.formatDate(date));
                self.formattedToday(new Date(self.currentDate()));
                self.formattedTomorrow(new Date(self.tomorrow()));
                self.receivedDate=(self.receivedDate || self.formattedToday);
                ko.tasks.runEarly();
                self.isDateLoaded(true);
            });
        };
        self.getHostDate();
        self.debtorChanged = function(event) {
            if (event.detail.value) {
                self.debtorSubList().length = 0;
                self.debtorSubListExpandAll(self.getSubDebtorList(self.selectedDebtor() || event.detail.value));
                self.selectedDebtor(event.detail.value);
                for (var i = 0; i < self.debtorSubListExpandAll().debtorList.length; i++) {
                    self.debtorSubList.push({
                        debtorId: self.debtorSubListExpandAll().debtorList[i].id,
                        nickName: self.debtorSubListExpandAll().debtorList[i].nickName,
                        debtorType: self.debtorSubListExpandAll().debtorList[i].debtorType,
                        transferMode: self.debtorSubListExpandAll().debtorList[i].transferMode ? self.debtorSubListExpandAll().debtorList[i].transferMode : "",
                        transferValue: self.debtorSubListExpandAll().debtorList[i].transferValue ? self.debtorSubListExpandAll().debtorList[i].transferValue : ""
                    });
                }
                self.selectedDebtorName(self.selectedDebtor());
                self.customDebtorName(self.selectedDebtor());
                self.dropDownActive(true);
                if (self.debtorDetails !== null) {
                    self.setDebtor({
                        nickName: self.debtorDetails.nickName,
                        debtorId: self.debtorDetails.id
                    });
                }
            }
        };
        self.getSubDebtorList = function(groupName) {
            for (var i = 0; i < self.debtorListExpandAll().length; i++) {
                if (self.debtorListExpandAll()[i].debtorGroupName === groupName) {
                    return self.debtorListExpandAll()[i];
                }
            }
        };
        self.cancel = function() {
            history.back();
        };
        self.verifyRequest = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("requestMoneyTracker"))) {
                return;
            }
            self.RequestMoneyModel.payerId(self.RequestMoneyModel.payerId());
            self.RequestMoneyModel.startDate(self.receivedDate());
            self.RequestMoneyModel.endDate(self.receivedDate());
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.value(self.RequestMoneyModel.sepaDomestic.nominatedAccount.value());
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.displayValue(self.additionalDetails().account.id.displayValue);
            self.RequestMoneyModel.amount.currency(self.currency());
            var requestMoneyPayload = ko.toJSON(self.RequestMoneyModel);
            RequestMoneyModel.initiateRequestMoney(requestMoneyPayload).done(function(data) {
                self.instructionId(data.instructionId);
                self.stageOne(false);
                Params.dashboard.loadComponent("review-debtor-money-request", {
                    reviewMode: true,
                    header: Params.dashboard.headerName(),
                    instructionId: data.instructionId
                }, self);
            });
        };
        self.commentLengthTrack = function() {
            self.remainingCommentChars(40 - document.getElementById("note").value.length);
        };
        self.getCurrency = function() {
            RequestMoneyModel.getCurrency().done(function(data) {
                self.currency(data.bankConfigurationDTO.localCurrency);
                self.currencyLoaded(true);
            });
        };
        self.getCurrency();
        self.cancelStageTwo = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.confirmRequest = function() {
            RequestMoneyModel.confirmRequestMoney(self.instructionId()).done(function(data, status, jqXHR) {
                self.baseURL = "payments/instructions/payins/domestic/" + self.instructionId();
                self.externalReferenceId(data.externalReferenceId);
                self.stageOne(false);
                self.stageTwo(false);
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.debtors.confirmRequest,
                    debtor: true
                }, self);
            });
        };
        self.resendOTP = function() {
            RequestMoneyModel.confirmRequestMoney(self.instructionId());
        };
        self.cancelStageThree = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };
        self.getFormattedDate = function() {
            var today = Params.baseModel.getDate();
            var month = today.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = today.getDate();
            day = day < 10 ? "0" + day : day;
            var year = today.getFullYear();
            return year + "-" + month + "-" + day;
        };
        self.minReceivedDate(self.getFormattedDate());
        self.reloadComponent = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };
    };
});