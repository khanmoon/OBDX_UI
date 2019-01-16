define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review-mailer-edit",
    "ojs/ojcheckboxset"
], function (ko, $, ReviewMailerEditModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("edit", "mailers");
        self.payload = params.rootModel.params.data;
        params.dashboard.headerName(self.nls.headers.heading);
        self.approverFlag = ko.observable(false);
        self.mailersPayload = ko.toJS(self.payload);
        self.mailerDetails = ko.toJS(self.payload);
        self.userRecipientsList = ko.observableArray();
        self.partyRecipientsList = ko.observableArray();
        for (var m = 0; m < self.mailersPayload.recipients.length; m++) {
            if (self.mailersPayload.recipients[m].value === "corporateuser") {
                self.mailersPayload.recipients.corp = self.nls.roles.corp;
            } else if (self.mailersPayload.recipients[m].value === "retailuser") {
                self.mailersPayload.recipients.retail = self.nls.roles.retail;
            } else if (self.mailersPayload.recipients[m].value === "administrator") {
                self.mailersPayload.recipients.admin = self.nls.roles.admin;
            } else if (self.mailersPayload.recipients[m].type === "USER") {
                self.userRecipientsList().push(self.mailersPayload.recipients[m].value);
            } else if (self.mailersPayload.recipients[m].type === "PARTY") {
                self.partyRecipientsList().push(self.mailersPayload.recipients[m].value);
            }
        }
        self.mailersPayload.userRecipientsList = self.userRecipientsList();
        self.mailersPayload.partyRecipientsList = self.partyRecipientsList();
        if (self.mailersPayload.priority === "L") {
            self.mailersPayload.priority = self.nls.fieldname.low;
        } else if (self.mailersPayload.priority === "H") {
            self.mailersPayload.priority = self.nls.fieldname.high;
        } else if (self.mailersPayload.priority === "M") {
            self.mailersPayload.priority = self.nls.fieldname.medium;
        }
        if (self.transactionId) {
            self.approverFlag(true);
        }
        self.confirmUpdateMailer = function () {
            self.mailersPayload.messageId = self.mailersPayload.messageId.value;
            ReviewMailerEditModel.updateMailer(ko.toJSON(self.payload)).done(function (data, status, jqXHR) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.nls.headers.transactionName
                }, self);
            });
        };
        self.edit = function () {
            params.dashboard.loadComponent("edit", {}, self);
        };
    };
});