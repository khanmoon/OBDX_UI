define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/electronic-statement",
    "ojs/ojknockout",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, eStatementModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.validationTracker = ko.observable();
        self.resource = ResourceBundle;
        self.encryptedAccountNumber = self.params.id ? self.params.id.displayValue : self.additionalDetails().id.displayValue;
        self.primaryEmailID = ko.observable();
        self.accountID = self.params.id ? self.params.id.value : self.additionalDetails().id.value;
        var module =self.params.module;
        self.subscribeConfirmScreen = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.referenceNumber = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
        self.showConfirmScreen = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showeStatement(false);
            self.subscribeConfirmScreen(true);
        };
        self.primaryEmailID(rootParams.dashboard.userData.userProfile.emailId);
        self.subscribeForStatement = function () {
            var payload = {
                primaryEmailId: self.primaryEmailID(),
                frequency: "MNT",
                dayOfMonth: 1,
                month: null,
                daysOfWeek: null,
                status: "S"
            };
            payload = ko.toJSON(payload);
            eStatementModel.subscribeEStatement(self.type, self.accountID, payload,module).done(function (data, status, jqXhr) {
                if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                    return;
                }
                self.showeStatement(true);
                self.subscribeConfirmScreen(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    httpStatus: jqXhr.status,
                    referenceNumber: jqXhr.responseJSON.referenceNumber,
                    transactionName: self.resource.eStatement.successMessage.eStatement,
                    template: "confirm-screen/" + (self.type === "demandDeposit" ? "casa-template" : self.type === "deposit" ? (module ==="RD"?"rd-template":"td-template"): "loan-template")
                }, self);
            }).fail(function () {
                $("#statementDialog").hide();
                rootParams.dashboard.backAllowed(true);
            });
        };
        self.unSubscribeForStatement = function () {
            var payload = {
                primaryEmailId: self.primaryEmailID(),
                frequency: "MNT",
                dayOfMonth: 1,
                month: null,
                daysOfWeek: null,
                status: "U"
            };
            payload = ko.toJSON(payload);
            eStatementModel.subscribeEStatement(self.type, self.accountID, payload,module).done(function (data, status, jqXhr) {
                if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                    return;
                }
                self.showeStatement(false);
                self.subscribeConfirmScreen(true);
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resource.eStatement.successMessage.unsubscribeEStatement
                }, self);
            });
        };
    };
});