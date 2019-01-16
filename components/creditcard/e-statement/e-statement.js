define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/electronic-statement",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, eStatementModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.validationTracker = ko.observable();
        self.transactionName = ko.observable();
        self.confirmSubscription = ko.observable(false);
        self.resource = ResourceBundle;
        self.payload = eStatementModel.getNewEStatementDetailsModel();
        rootParams.baseModel.registerElement("confirm-screen");
        var payload;
        self.proceedSubscriptionForStatement = function () {
            self.confirmSubscription(true);
        };
        self.updateSubscriptionForStatement = function () {
            if (self.eStatementSubsciptionDetails().status === "S") {
                payload = {
                    primaryEmailId: self.eStatementSubsciptionDetails().primaryEmailId,
                    frequency: "MNT",
                    dayOfMonth: 1,
                    month: null,
                    daysOfWeek: null,
                    status: "UNSUBSCRIBED"
                };
                self.transactionName(self.resource.eStatement.successMessage.unsubscribeEStatement);
            } else {
                payload = {
                    primaryEmailId: self.eStatementSubsciptionDetails().primaryEmailId,
                    frequency: "MNT",
                    dayOfMonth: 1,
                    month: null,
                    daysOfWeek: null,
                    status: "SUBSCRIBED"
                };
                self.transactionName(self.resource.eStatement.successMessage.eStatement);
            }
            payload = ko.toJSON(payload);
            eStatementModel.updateSubscriptionForStatement(self.eStatementSubsciptionDetails().creditCard.value, payload).done(function (data, status, jqXhr) {
                self.confirmSubscription(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName(),
                    confirmScreenExtensions: {
                      isSet: true,
                      template: "confirm-screen/cc-template",
                      taskCode: "CC_N_CUEP"
                    }
                }, self);
            }).fail(function () {
                $("#statementDialog").hide();
            });
        };
        self.cancelEstatement = function () {
            $("#statementDialog").hide();
            self.confirmSubscription(false);
        };
    };
});
