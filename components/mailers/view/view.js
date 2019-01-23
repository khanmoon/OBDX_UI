define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/mailers",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset"
], function (oj, ko, UsersModel, $, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.mailerDetails = rootParams.rootModel.params;
        rootParams.baseModel.registerComponent("edit", "mailers");
        self.viewFlag = ko.observable(false);
        self.deleteFlag = ko.observable(false);
        self.version = ko.observable();
        self.status = ko.observable();
        self.recipientsListLoaded = ko.observable(false);
        self.recipientsList = ko.observableArray();
        self.selectedRecipients = ko.observableArray();
        rootParams.dashboard.headerName(self.nls.headers.heading);
        var dateobj = new Date(self.mailerDetails.activationDate);
        rootParams.baseModel.registerElement("confirm-screen");

        self.deleteNo = function(){
          $("#deleteMailer").hide();
        };

        self.openModal = function(){
          $("#deleteMailer").trigger("openModal");
        };

        self.deleteMailer = function () {
            UsersModel.deleteMailer(self.mailerDetails.messageId.value).done(function (data, status, jqXhr) {
                self.httpStatus = jqXhr.status;
                var statusMessage;
                if (self.httpStatus && self.httpStatus !== 202) {
                    statusMessage = self.nls.fieldname.completed;
                }
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.headers.transactionDeleteName,
                    confirmScreenExtensions: {
                        successMessage: self.nls.fieldname.deleteSuccessMessage,
                        statusMessages: statusMessage,
                        isSet: true,
                        template: "confirm-screen/mailers"
                    }
                }, self);
            }).fail(function () {
                $("#deleteMailer").hide();
            });
        };
        self.readMailer = function () {
          Promise.all([UsersModel.readMailer(self.mailerDetails.messageId.value),UsersModel.listEnterpriseRoles()]).then(function (response){
                var data = response[0],
                 data1 = response[1];
                 for (var m = 0; m < data1.enterpriseRoleDTOs.length; m++) {
                   if (data1.enterpriseRoleDTOs[m].enterpriseRoleId === "corporateuser") {
                     self.recipientsList.push({
                       enterpriseRoleName: self.nls.roles.corp,
                       enterpriseRoleId: "corporateuser"
                     });
                   } else if (data1.enterpriseRoleDTOs[m].enterpriseRoleId === "retailuser") {
                     self.recipientsList.push({
                       enterpriseRoleName: self.nls.roles.retail,
                       enterpriseRoleId: "retailuser"
                     });
                   } else if (data1.enterpriseRoleDTOs[m].enterpriseRoleId === "administrator") {
                     self.recipientsList.push({
                       enterpriseRoleName: self.nls.roles.admin,
                       enterpriseRoleId: "administrator"
                     });
                   }
                 }
                 self.recipientsListLoaded(true);
                 self.mailerDetails = data.mailer;
                self.mailerName = data.mailer.description;
                self.code = data.mailer.code;
                self.activationDate = data.mailer.activationDate;
                self.priority = data.mailer.priority;
                self.subject = data.mailer.subject;
                self.mailBody = data.mailer.messageBody;
                self.version = data.mailer.version;
                self.status = data.mailer.status;
                if (self.priority === "L") {
                    self.priority = self.nls.fieldname.low;
                } else if (self.priority === "H") {
                    self.priority = self.nls.fieldname.high;
                } else if (self.priority === "M") {
                    self.priority = self.nls.fieldname.medium;
                }
                if (self.sendTime === "IMMEDIATE") {
                    self.sendTime = self.nls.fieldname.immediate;
                } else if (self.mailerDetails.triggerType === "MANUAL") {
                    self.sendTime = rootParams.baseModel.format(resourceBundle.fieldname.manualTrigger, {
                        hour: dateobj.getHours(),
                        minute: dateobj.getMinutes()
                    });
                }
                self.mailersPayload = {
                    recipients: {
                        "corp": "",
                        "retail": "",
                        "admin": ""
                    }
                };
                self.userRecipientsList = ko.observableArray();
                self.partyRecipientsList = ko.observableArray();
                for (m = 0; m < data.mailer.recipients.length; m++) {
                    if (data.mailer.recipients[m].value === "corporateuser") {
                        self.mailersPayload.recipients.corp = self.nls.roles.corp;
                        self.selectedRecipients.push(data.mailer.recipients[m].value);
                    } else if (data.mailer.recipients[m].value === "retailuser") {
                        self.mailersPayload.recipients.retail = self.nls.roles.retail;
                        self.selectedRecipients.push(data.mailer.recipients[m].value);
                    } else if (data.mailer.recipients[m].value === "administrator") {
                        self.mailersPayload.recipients.admin = self.nls.roles.admin;
                        self.selectedRecipients.push(data.mailer.recipients[m].value);
                    } else if (data.mailer.recipients[m].type === "USER") {
                        self.userRecipientsList().push(data.mailer.recipients[m].value);
                    } else if (data.mailer.recipients[m].type === "PARTY") {
                        self.partyRecipientsList().push(data.mailer.recipients[m].value);
                    }
                }
                self.mailersPayload.userRecipientsList = self.userRecipientsList();
                self.mailersPayload.partyRecipientsList = self.partyRecipientsList();
                self.viewFlag(true);
              });
     };

        self.backOnView = function () {
            rootParams.dashboard.loadComponent("mailers-base", {}, self);
            self.searchFlag(true);
            self.viewFlag(false);
        };
        self.edit = function () {
            rootParams.dashboard.loadComponent("edit", {
                file: self.mailerDetails,
                sendHour: dateobj.getHours(),
                sendMinute: dateobj.getMinutes()
            }, self);
        };
        self.readMailer();
    };
});
