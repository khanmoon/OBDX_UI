define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/edit-mailer",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojselectcombobox"
], function (oj, ko, EditMailerModel, $, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(EditMailerModel.getNewModel());
                return KoModel;
            };
        var i;
        ko.utils.extend(self, rootParams.rootModel);
        self.validationTracker = ko.observable();
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("text-editor");
        rootParams.baseModel.registerComponent("message-template-maintenance", "mailers");
        self.manualEnteredUsers = rootParams.rootModel.manualEnteredUsers || ko.observableArray();
        self.manualEnteredParties = rootParams.rootModel.manualEnteredParties || ko.observableArray();
        self.showUserInput = rootParams.rootModel.showUserInput || ko.observable(false);
        self.showPartyInput = rootParams.rootModel.showPartyInput || ko.observable(false);
        self.mailersPayload = ko.observable();
        self.mailersPayload(getNewKoModel().mailersModel);
        if (self.approverFlag === undefined) {
            self.mailerDetails = rootParams.rootModel.params.file;
        }
        self.description = ko.observable(self.mailerDetails.description);
        self.code = ko.observable(self.mailerDetails.code);
        self.activationDate = ko.observable(self.mailerDetails.activationDate);
        self.triggerType = ko.observable(self.mailerDetails.triggerType);
        self.emailSubject = ko.observable(self.mailerDetails.subject);
        self.emailContent = ko.observable(self.mailerDetails.messageBody);
        self.recipientsList = ko.observableArray();
        self.recipientsListLoaded = ko.observable(false);
        self.selectedRecipients = ko.observableArray([]);
        self.validateEmail = ko.observable();
        self.laterSelected = self.mailerDetails.triggerType === "MANUAL" ? ko.observable(true) : ko.observable(false);
        self.priority = ko.observable(self.mailerDetails.priority);
        rootParams.dashboard.headerName(self.nls.headers.heading);
        rootParams.baseModel.registerComponent("review-mailer-edit", "mailers");
        self.showUserClose = rootParams.rootModel.showUserClose || ko.observable(true);
        self.showPartyClose = rootParams.rootModel.showPartyClose || ko.observable(true);
        self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        if (rootParams.rootModel.params.sendHour) {
            self.sendHour = [rootParams.rootModel.params.sendHour.toString()];
        } else {
            self.sendHour = rootParams.rootModel.sendHour;
        }
        if (rootParams.rootModel.params.sendMinute) {
            self.sendMinute = [rootParams.rootModel.params.sendMinute.toString()];
        } else {
            self.sendMinute = rootParams.rootModel.sendMinute;
        }
        self.partyList = ko.observableArray();
        self.userLists = ko.observableArray();
        self.selectedUsers = ko.observableArray();
        self.selectedParties = ko.observableArray();
        self.hours = ko.observableArray();
        self.minutes = ko.observableArray();
        self.showAddUserComponent = function () {
            self.showUserInput(true);
        };
        self.showPartyAddComponent = function () {
            self.showPartyInput(true);
        };
        self.recipientsChangeHandler = function (event) {
            if (event.detail.value) {
                if (self.recipientsList().length === self.selectedRecipients().length) {
                    self.showUserInput(false);
                    self.showPartyInput(false);
                    self.manualEnteredUsers("");
                    self.manualEnteredParties("");
                }
            }
        };
        for ( i = 0; i < self.mailerDetails.recipients.length; i++) {
            if (self.mailerDetails.recipients[i].value.toLowerCase() === "corporateuser" || self.mailerDetails.recipients[i].value.toLowerCase() === "retailuser" || self.mailerDetails.recipients[i].value.toLowerCase() === "administrator") {
                self.selectedRecipients()[i] = self.mailerDetails.recipients[i].value;
            }
            if (self.mailerDetails.recipients[i].type === "USER") {
                if (!rootParams.rootModel.manualEnteredUsers) {
                    self.manualEnteredUsers().push(self.mailerDetails.recipients[i].value);
                }
                self.showUserInput(true);
            }
            if (self.mailerDetails.recipients[i].type === "PARTY") {
                if (!rootParams.rootModel.manualEnteredParties) {
                    self.manualEnteredParties().push(self.mailerDetails.recipients[i].value);
                }
                self.showPartyInput(true);
            }
        }
        for (i = 1; i < 25; i++) {
            self.hours.push(i);
        }
        for (var j = 0; j < 60; j++) {
            self.minutes.push(i);
        }
        self.changehandler = function (event) {
            if (event.detail.value) {
                if (event.detail.value === "MANUAL")
                    self.laterSelected(true);
                else
                    self.laterSelected(false);
            }
        };
        self.showUserCloseInput = function () {
            self.showUserInput(false);
        };
        self.showPartyCloseInput = function () {
            self.showPartyInput(false);
        };
        var manualEnteredUsersSubscription = self.manualEnteredUsers.subscribe(function () {
            if (self.manualEnteredUsers() === undefined || self.manualEnteredUsers() === "") {
                self.showUserClose(true);
            } else {
                self.showUserClose(false);
            }
        });
        var manualEnteredPartiesSubscription = self.manualEnteredParties.subscribe(function () {
            if (self.manualEnteredParties() === undefined || self.manualEnteredParties() === "") {
                self.showPartyClose(true);
            } else {
                self.showPartyClose(false);
            }
        });
        EditMailerModel.listEnterpriseRoles().done(function (data) {
            for (var m = 0; m < data.enterpriseRoleDTOs.length; m++) {
                if (data.enterpriseRoleDTOs[m].enterpriseRoleId.toLowerCase() === "corporateuser") {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.corp,
                        enterpriseRoleId: "corporateuser"
                    });
                }
                if (data.enterpriseRoleDTOs[m].enterpriseRoleId.toLowerCase() === "retailuser") {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.retail,
                        enterpriseRoleId: "retailuser"
                    });
                }
                if (data.enterpriseRoleDTOs[m].enterpriseRoleId.toLowerCase() === "administrator" ) {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.admin,
                        enterpriseRoleId: "administrator"
                    });
                }
            }
            self.recipientsListLoaded(true);
        });
        self.updateMailer = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.selectedRecipients().length === 0 && !self.manualEnteredParties() && !self.manualEnteredUsers()) {
                rootParams.baseModel.showMessages(null, [self.nls.errorMsg.noRecipient], "INFO");
                return;
            }
            self.mailersPayload().messageType = "B";
            self.mailersPayload().subject = self.emailSubject();
            self.mailersPayload().messageBody = self.emailContent();
            self.mailersPayload().activationDate = self.activationDate();
            self.mailersPayload().description = self.description();
            self.mailersPayload().code = self.code();
            self.mailersPayload().priority = self.priority();
            self.mailersPayload().triggerType = self.triggerType();
            self.mailersPayload().messageId = self.mailerDetails.messageId;
            self.mailersPayload().version = self.version;
            if (self.manualEnteredUsers() && self.manualEnteredUsers().length > 0) {
                if (self.manualEnteredUsers().indexOf(",") !== -1)
                    self.selectedUsers(self.manualEnteredUsers().split(","));
                else
                    self.selectedUsers().push(self.manualEnteredUsers());
            }
            if (self.manualEnteredParties() && self.manualEnteredParties().length > 0) {
                if (self.manualEnteredParties().indexOf(",") !== -1)
                    self.selectedParties(self.manualEnteredParties().split(","));
                else
                    self.selectedParties().push(self.manualEnteredParties());
            }
            for (var i = 0; i < self.selectedRecipients().length; i++) {
                if (self.selectedRecipients()[i].toLowerCase() === "corporateuser"|| self.selectedRecipients()[i].toLowerCase() === "retailuser" || self.selectedRecipients()[i].toLowerCase() === "administrator" ) {
                    self.mailersPayload().recipients().push({
                        type: "ROLE",
                        value: self.selectedRecipients()[i]
                    });
                }
            }
            if (self.selectedUsers().length > 1) {
                ko.utils.arrayForEach(self.selectedUsers(), function (item) {
                    if (item !== "") {
                        self.mailersPayload().recipients().push({
                            type: "USER",
                            value: item
                        });
                    }
                });
            } else if (self.selectedUsers().length === 1) {
                self.mailersPayload().recipients().push({
                    type: "USER",
                    value: self.selectedUsers()[0]
                });
            }
            if (self.selectedParties().length > 1) {
                ko.utils.arrayForEach(self.selectedParties(), function (item) {
                    if (item !== "") {
                        self.mailersPayload().recipients().push({
                            type: "PARTY",
                            value: item
                        });
                    }
                });
            } else if (self.selectedParties().length === 1) {
                self.mailersPayload().recipients().push({
                    type: "PARTY",
                    value: self.selectedParties()[0]
                });
            }
            rootParams.dashboard.loadComponent("review-mailer-edit", {
                data: self.mailersPayload(),
                sendHour: self.sendHour,
                sendMinute: self.sendMinute
            }, self);
        };
        self.dispose = function () {
            manualEnteredPartiesSubscription.dispose();
            manualEnteredUsersSubscription.dispose();
        };
    };
});
