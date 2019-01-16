define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/add-new-debtor",
    "ojs/ojknockout",
     "ojs/ojvalidationgroup",
     "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function (oj, ko, $, newDebtorModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(newDebtorModel.getNewModel());
                return KoModel;
            };
        if (Params.rootModel.params.isSuccess)
            ko.utils.extend(self, Params.rootModel);
        self.debtor = getNewKoModel().debtorModel;
        self.debtorName = getNewKoModel().debtorName;
        self.bankDetailsCode = ko.observable();
        if (!Params.rootModel.params.isSuccess)
            ko.utils.extend(self, Params.rootModel);
        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.debtors.initiateScreenHeader);
        self.additionalBankDetails = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.name = ko.observable();
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.showDebtorDetails = ko.observable(false);
        self.componentName = ko.observable("debtor-details");
        self.payerId = ko.observable();
        self.enableButton = ko.observable(false);
        self.clearingCodeType = ko.observable("SWI");
        self.validationTracker = ko.observable();
        Params.baseModel.registerElement([
            "confirm-screen",
            "bank-look-up"
        ]);
        Params.baseModel.registerComponent("debtor-money-request", "debtor");
        Params.baseModel.registerComponent("debtor-group-list", "debtor");
        Params.baseModel.registerComponent("review-add-new-debtor", "debtor");
        self.addDebtor = function () {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("debtorTracker"))){
                return;
            }
            var debtorName = ko.toJSON(self.debtorName);
            newDebtorModel.getDebtorGroupName(debtorName).done(function (data) {
                self.debtor.groupId(data.payerGroup.groupId);
                self.debtor.sepaDomesticPayer.bankDetails.code = self.bankDetailsCode();
                var debtor = ko.toJSON(self.debtor);
                if (self.debtor.groupId !== null) {
                    newDebtorModel.createNewPayer(debtor, data.payerGroup.groupId).done(function (data2) {
                        self.payerId(data2.domesticPayer.id);
                        self.stageOne(false);
                        Params.dashboard.loadComponent("review-add-new-debtor", {
                            payerId: self.payerId(),
                            header: Params.dashboard.headerName(),
                            groupId: self.debtor.groupId()
                        }, self);
                    }).fail(function () {
                        self.deletePayerOnFail();
                    });
                }
            });
        };
        self.cancelAddDebtor = function () {
            history.back();
        };
        self.cancelStageTwo = function () {
            if (location.hash === "#review") {
                location.hash = "";
            }
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function () {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function () {
                    self.stageOne(true);
                    self.stageTwo(false);
                });
            });
        };
        self.deletePayerOnFail = function () {
            newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function () {
                self.enableButton(false);
                self.stageOne(true);
                self.stageTwo(false);
            });
        };
        self.cancelStageThree = function () {
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function () {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function () {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageThree(false);
                });
            });
        };
        self.confirmAddDebtor = function () {
            newDebtorModel.confirmAddDebtor(self.payerId(), self.debtor.groupId()).done(function (data, status, jqXHR) {
                self.baseURL = "payments/payerGroup/" + self.debtor.groupId() + "/payers/domestic/" + self.payerId();
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.debtors.confirmAddDebtor,
                    debtor: true
                }, self);
            }).fail(function () {
                self.deletePayerOnFail();
            });
        };
        var error;
        self.validateCode = [{
            "validate": function (value) {
                if (value.length < 1) {
                    error = true;
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    error = true;
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.debtors.invalidError));
                }
            }
        }];
        self.verifyCode = function () {
            if (!error) {
                newDebtorModel.getBankDetailsBIC(self.bankDetailsCode()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        };
        self.resetCode = function () {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };
        self.openLookup = function () {
            $("#menuButtonDialog").trigger("openModal");
        };
        self.confirmAddDebtorWithAuth = function (data, status, jqXHR) {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (data.tokenValid) {
                self.stageThree(false);
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.debtors.confirmAddDebtor,
                    template: "confirm-screen/payments-template"
                }, self);
            }
        };
        self.cancelAdd = function () {
            newDebtorModel.deleteDebtor(self.payerId(), self.debtor.groupId()).done(function () {
                newDebtorModel.deleteDebtorGroup(self.debtor.groupId()).done(function () {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageThree(false);
                });
            });
        };
    };
});