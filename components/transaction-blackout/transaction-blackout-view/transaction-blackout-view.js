define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transaction-blackout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojmenu"
], function (oj, ko, $, ViewTransactionBlackoutModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.blackoutDetails = rootParams.blackoutDetails;
        self.userTypeOptions = ko.observableArray();
        self.showuserTypeList = ko.observable(false);
        self.userType = ko.observableArray();
        self.disabledState = ko.observable(true);
        self.transactionName = ko.observable();
        self.blackoutTime = ko.observableArray();
        self.selectedTypes = ko.observable();
        self.endDate = ko.observable();
        self.startDate = ko.observable();
        self.rendDate = ko.observable();
        self.rstartDate = ko.observable();
        self.recurring = ko.observable(false);
        self.compare = function (a, b) {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        };
        self.displayUserTypeData = function () {
            ViewTransactionBlackoutModel.fetchUserType().done(function (taskData) {
                var mapped = [];
                for (var i = 0; i < taskData.enterpriseRoleDTOs.length; i++) {
                    mapped.push({
                        "value": taskData.enterpriseRoleDTOs[i].enterpriseRoleId,
                        "label": taskData.enterpriseRoleDTOs[i].enterpriseRoleName
                    });
                }
                mapped.push({
                    "value": self.nls.transaction.prospectValue,
                    "label": self.nls.transaction.prospect
                });
                self.userTypeOptions(mapped.sort(self.compare));
                self.showuserTypeList(true);
            });
            for (var i = 0; i < self.blackoutDetails.blackoutRole().length; i++) {
                self.userType.push(self.blackoutDetails.blackoutRole()[i].roleName());
            }
        };
        self.displayUserTypeData();
        self.transactionName(self.blackoutDetails.transactionName());
        self.selectedTypes(self.blackoutDetails.frequency());
        if (self.selectedTypes() === "FULL") {
            self.startDate(self.blackoutDetails.startDate());
            self.endDate(self.blackoutDetails.endDate());
            self.recurring(false);
        } else if (self.selectedTypes() === "DAILY") {
            self.rstartDate(self.blackoutDetails.startDate());
            self.rendDate(self.blackoutDetails.endDate());
            self.recurring(true);
        }
        self.blackoutTime(self.blackoutDetails.blackoutTime());
    };
});