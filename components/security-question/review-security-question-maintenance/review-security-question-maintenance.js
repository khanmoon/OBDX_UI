define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/security-question",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojpagingcontrol",
    "ojs/ojknockout", "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function(oj, ko, $, ReviewSecurityQuestionModel, ResourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.securityQuestion.headers.securityQuestion);
        self.back = function() {
            history.back();
        };
        self.datasource = ko.observableArray();
        self.reviewTransactionMessage = {
            header: self.nls.securityQuestion.messages.reviewHeader,
            reviewHeader: self.nls.securityQuestion.messages.reviewHeader1
        };
        rootParams.baseModel.registerElement("confirm-screen");
        self.actionHeaderheading = ko.observable(self.nls.securityQuestion.headers.REVIEW);
        var array = [];
        for (var i = 0; i < self.params.payload.secQueMapping().length; i++) {
            array.push({ "question": self.params.payload.secQueMapping()[i].question() });

        }
        self.datasource(new oj.ArrayTableDataSource(array, { idAttribute: "question" }) || []);
        self.save = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.params.mode === "CREATE") {
                ReviewSecurityQuestionModel.createSecurityQuestion(ko.mapping.toJSON(self.params.payload)).done(function(data, status, jqXHR) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.nls.securityQuestion.labels.maintenance
                    }, self);
                });
            }
            if (self.params.mode === "UPDATE") {
                ReviewSecurityQuestionModel.updateSecurityQuestion(ko.mapping.toJSON(self.params.payload), self.params.maintenanceId).done(function(data, status, jqXHR) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.nls.securityQuestion.labels.maintenance
                    }, self);
                });
            }
        };
    };
});