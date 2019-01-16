define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review-mailer-create",
    "ojs/ojcheckboxset"
], function (ko, $, ReviewMailerCreateModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("mailer-create", "mailers");
        self.payload = params.rootModel.params.data;
        self.mailersPayload = ko.toJS(self.payload);
        if (!self.transactionId)
            params.dashboard.headerName(self.nls.headers.heading);
        self.userRecipientsList = ko.observableArray();
        self.partyRecipientsList = ko.observableArray();
        self.approverFlag = ko.observable(false);
        for (var m = 0; m < self.mailersPayload.recipients.length; m++) {
            if (self.mailersPayload.recipients[m].value.toLowerCase() === "corporateuser") {
                self.mailersPayload.recipients.corp = self.nls.roles.corp;
            } else if (self.mailersPayload.recipients[m].value.toLowerCase() === "retailuser") {
                self.mailersPayload.recipients.retail = self.nls.roles.retail;
            } else if (self.mailersPayload.recipients[m].value.toLowerCase() === "administrator") {
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
        self.confirmMailer = function () {
            ReviewMailerCreateModel.createMailers(ko.toJSON(self.payload)).done(function (data, status, jqXHR) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.nls.headers.transactionName
                }, self);
            });
        };
    };
});
