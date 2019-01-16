define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/physical-statement",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",

    "ojs/ojdatetimepicker",
    "ojs/ojfilmstrip",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, physicalStatement, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.serviceId = ko.observable();
        self.validationTracker = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        self.accountID = self.params.id ? self.params.id.value : self.additionalDetails().id.value;
        var module =self.params.module;
        self.dateValid = ko.observable();
        rootParams.baseModel.registerComponent("review-physical-statement", "accounts");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
        self.resource = ResourceBundle;
        self.reviewPhysicalStatement = ko.observable(false);
        self.submitPhysicalStatement = ko.observable(false);
        self.referenceNumber = ko.observable();
        self.physicalStatement = ko.observable(self.showPhysicalStatement());
        self.showConfirmScreen = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.reviewPhysicalStatement(true);
        };
        self.requestForPhysicalStatement = function () {
            var payload = {
                "fromDate": self.fromDate(),
                "toDate": self.toDate()
            };
            payload = ko.toJSON(payload);
            physicalStatement.requestPhysicalStatement(self.type, self.accountID, payload,module).done(function (data, status, jqXhr) {
                self.reviewPhysicalStatement(false);
                self.submitPhysicalStatement(true);
                self.showPhysicalStatement(true);
                self.physicalStatement(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    httpStatus: jqXhr.status,
                    hostReferenceNumber: data.adhocStatementReferenceNo,
                    transactionName: self.resource.accountActivity.successMessage.physicalStatementRequest,
                    template: "confirm-screen/" + (self.type === "demandDeposit" ? "casa-template" : self.type === "deposit" ? (module ==="RD"?"rd-template":"td-template") : "loan-template")
                }, self);
            }).fail(function (data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.reviewPhysicalStatement(false);
                self.submitPhysicalStatement(false);
                self.physicalStatement(false);
                $("#statementDialog").hide();
                rootParams.dashboard.backAllowed(true);
            });
        };
        self.reviewRequest = function () {
            var dateTracker = document.getElementById("dateTracker");
            if (dateTracker && dateTracker.valid !== "valid") {
                dateTracker.showMessages();
                dateTracker.focusOn("@firstInvalidShown");
                return;
            }
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (!rootParams.baseModel.large()) {
                location.hash = "review";
            }
            self.statementDates = {
                "fromDate": self.fromDate(),
                "toDate": self.toDate()
            };
            rootParams.dashboard.loadComponent("review-physical-statement", {
                mode: "review",
                data: {
                    "accountId": self.additionalDetails().id,
                    "fromDate": self.fromDate(),
                    "toDate": self.toDate()
                }
            }, self);
            self.submitPhysicalStatement(false);
            self.physicalStatement(false);
        };
        self.ok = function () {
            self.showeStatement(false);
            self.showPhysicalStatement(false);
            self.physicalStatement(false);
            $("#statementDialog").hide();
            self.filter(false);
            rootParams.dashboard.backAllowed(true);
        };
    };
});