define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/workflow",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, WorkflowReviewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("confirm-screen");
        self.resourceBundle = resourceBundle;
        self.workflow = self.params.data;
        self.userListLoaded = ko.observable(false);
        self.userList = ko.observableArray();
        if (self.workflow.steps() && self.workflow.steps().length > 0) {
            ko.utils.arrayForEach(self.workflow.steps(), function (users) {
                WorkflowReviewModel.fetchUserDetails(users.userGroup.users()[0].userId()).done(function (response) {
                    var userDetails = {
                        firstName: response.userDTO.firstName,
                        lastName: response.userDTO.lastName,
                        username: response.userDTO.username
                    };
                    self.userList.push(userDetails);
                    if (self.workflow.steps().length === self.userList().length) {
                        self.userListLoaded(true);
                    }
                });
            });
        }
        self.getName = function (userId) {
            for (var i = 0; i < self.userList().length; i++) {
                if (userId === self.userList()[i].username) {
                    return rootParams.baseModel.format(self.resourceBundle.generic.common.userName, {
                        firstName: self.userList()[i].firstName,
                        lastName: self.userList()[i].lastName,
                        userName: self.userList()[i].username
                    });
                }
            }
        };
        self.partyName = ko.observable();
        self.workflowCode = ko.observable(self.workflow.name());
        self.showUsers = ko.observable(false);
        self.groupDescription = ko.observable(self.workflow.description());
        if (self.workflow.type() !== "ADMIN") {
            self.partyName(self.transactionDetails().partyName.fullName);
        }
    };
});