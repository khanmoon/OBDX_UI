define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/mailers",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojtimezonedata"
], function (oj, ko, CreateMailersModel, $, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                return ko.mapping.fromJS(CreateMailersModel.getNewModel());
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.validationTracker = ko.observable();
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("text-editor");
        rootParams.baseModel.registerComponent("message-template-maintenance", "mailers");
        self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        self.mailersPayload = ko.observable();
        self.mailersPayload(getNewKoModel().mailersModel);
        self.activationDate = rootParams.rootModel.activationDate;
        self.triggerType = rootParams.rootModel.triggerType || ko.observable();
        self.emailSubject = rootParams.rootModel.emailSubject || ko.observable();
        self.emailContent = rootParams.rootModel.emailContent || ko.observable();
        self.selectedRecipients = rootParams.rootModel.selectedRecipients || ko.observableArray([]);
        self.laterSelected = rootParams.rootModel.laterSelected || ko.observable();
        self.priority = rootParams.rootModel.priority;
        self.manualEnteredUsers = rootParams.rootModel.manualEnteredUsers || ko.observable();
        self.manualEnteredParties = rootParams.rootModel.manualEnteredParties || ko.observable();
        self.showUserInput = rootParams.rootModel.showUserInput || ko.observable(false);
        self.showPartyInput = rootParams.rootModel.showPartyInput || ko.observable(false);
        self.recipientsList = ko.observableArray();
        self.sendHour = rootParams.rootModel.sendHour || ko.observable();
        self.sendMinute = rootParams.rootModel.sendMinute || ko.observable();
        self.showPartyClose = rootParams.rootModel.showPartyClose || ko.observable(true);
        self.showUserClose = rootParams.rootModel.showUserClose || ko.observable(true);
        self.recipientsListLoaded = ko.observable(false);
        self.validateEmail = ko.observable();
        rootParams.baseModel.registerComponent("review-mailer-create", "mailers");
        self.partyList = ko.observableArray();
        self.userLists = ko.observableArray();
        self.selectedUsers = ko.observableArray();
        self.selectedParties = ko.observableArray();
        self.selectedUsers = ko.observableArray();
        self.hours = ko.observableArray();
        self.minutes = ko.observableArray();
        self.selectedTriggerType = ko.observable(true);
        rootParams.dashboard.headerName(self.nls.headers.heading);
        for (var i = 1; i < 25; i++) {
            self.hours.push(i);
        }
        for (var j = 0; j < 60; j++) {
            self.minutes.push(j);
        }
        self.showAddUserComponent = function () {
            self.showUserInput(true);
        };
        self.showPartyAddComponent = function () {
            self.showPartyInput(true);
        };
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
        self.goBack = function () {
            self.activationDate("");
            self.triggerType("IMMEDIATE");
            self.emailSubject("");
            self.emailContent("");
            self.selectedRecipients([]);
            self.priority("L");
            self.manualEnteredUsers("");
            self.manualEnteredParties("");
            self.showUserInput(false);
            self.showPartyInput(false);
            rootParams.dashboard.hideDetails();
        };
        self.recipientsChangeHandler = function (event) {
            if (event.detail.value && self.recipientsList().length === self.selectedRecipients().length) {
                self.showUserInput(false);
                self.showPartyInput(false);
                self.manualEnteredUsers("");
                self.manualEnteredParties("");
            }
        };
        CreateMailersModel.listEnterpriseRoles().done(function (data) {
            for (var m = 0; m < data.enterpriseRoleDTOs.length; m++) {
                if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "corporateuser") {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.corp,
                        enterpriseRoleId: "corporateuser"
                    });
                } else if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "retailuser") {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.retail,
                        enterpriseRoleId: "retailuser"
                    });
                } else if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "administrator") {
                    self.recipientsList.push({
                        enterpriseRoleName: self.nls.roles.admin,
                        enterpriseRoleId: "administrator"
                    });
                }
            }
            self.recipientsListLoaded(true);
        });
        var manualEnteredPartiesSubscription = self.manualEnteredParties.subscribe(function () {
            if (self.manualEnteredParties() === undefined || self.manualEnteredParties() === "") {
                self.showPartyClose(true);
            } else {
                self.showPartyClose(false);
            }
        });
        self.manualEnteredUsers.subscribe(function () {
            if (self.manualEnteredUsers() === undefined || self.manualEnteredUsers() === "") {
                self.showUserClose(true);
            } else {
                self.showUserClose(false);
            }
        });
        self.showReview = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.selectedRecipients().length === 0 && !self.manualEnteredParties() && !self.manualEnteredUsers()) {
                rootParams.baseModel.showMessages(null, [self.nls.errorMsg.noRecipient], "INFO");
                return;
            }
            if (self.manualEnteredUsers() && self.manualEnteredUsers().length > 0) {
                if (self.manualEnteredUsers().indexOf(",") !== -1) {
                    self.selectedUsers = self.manualEnteredUsers().split(",");
                } else {
                    self.selectedUsers().push(self.manualEnteredUsers());
                }
            }
            if (self.manualEnteredParties() && self.manualEnteredParties().length > 0) {
                if (self.manualEnteredParties().indexOf(",") !== -1)
                    self.selectedParties = self.manualEnteredParties().split(",");
                else
                    self.selectedParties().push(self.manualEnteredParties());
            }
            self.mailersPayload().messageType = "B";
            self.mailersPayload().subject = self.emailSubject();
            self.mailersPayload().messageBody = self.emailContent();
            if (self.activationDate() === "00:00:00") {
                self.triggerType("IMMEDIATE");
            } else {
                self.triggerType("MANUAL");
            }
            self.mailersPayload().description = self.description();
            self.mailersPayload().activationDate = self.activationDate();
            self.mailersPayload().code = self.code();
            self.mailersPayload().priority = self.priority();
            self.mailersPayload().triggerType = self.triggerType();
            for (var i = 0; i < self.selectedRecipients().length; i++) {
                if (self.selectedRecipients()[i] === "corporateuser" || self.selectedRecipients()[i] === "retailuser" || self.selectedRecipients()[i] === "administrator") {
                    self.mailersPayload().recipients().push({
                        type: "ROLE",
                        value: self.selectedRecipients()[i]
                    });
                }
            }
            if (self.selectedUsers.length > 1) {
                ko.utils.arrayForEach(self.selectedUsers, function (item) {
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
            if (self.selectedParties.length > 1) {
                ko.utils.arrayForEach(self.selectedParties, function (item) {
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
            rootParams.dashboard.loadComponent("review-mailer-create", {
                data: self.mailersPayload(),
                sendHour: self.sendHour,
                sendMinute: self.sendMinute
            }, self);
        };
        self.dispose = function () {
            manualEnteredPartiesSubscription.dispose();
        };
    };
});
