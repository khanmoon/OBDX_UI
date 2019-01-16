define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transaction-blackout",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ReviewTransactionBlackoutModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, reviewBlackoutData;
        self.resourceBundle = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.transactionName = ko.observable();
        var getNewKoModel = function () {
            var KoModel = ReviewTransactionBlackoutModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.blackoutPayload = self.rootModelInstance().blackout;
        self.userTypeOptions = ko.observableArray();
        self.showuserTypeList = ko.observable(false);
        self.userType = ko.observableArray();
        self.disabledState = ko.observable(true);
        self.approverReview = ko.observable(false);
        self.transactions = ko.observableArray();
        self.blackoutTime = ko.observableArray();
        self.selectedTypes = ko.observable();
        self.endDate = ko.observable();
        self.startDate = ko.observable();
        self.rendDate = ko.observable();
        self.rstartDate = ko.observable();
        self.recurring = ko.observable(true);
        var i;
        if (rootParams.blackoutData) {
            reviewBlackoutData = rootParams.blackoutData;
            for (i = 0; i < reviewBlackoutData.blackoutRole().length; i++) {
                self.userType.push(reviewBlackoutData.blackoutRole()[i]);
            }
            if (self.prevMode() === "CREATE") {
                self.transactionName(reviewBlackoutData.taskCode().split("~")[1]);
            } else {
                self.transactionName(reviewBlackoutData.transactionName());
            }
            self.blackoutTime(reviewBlackoutData.blackoutTime());
            self.selectedTypes(reviewBlackoutData.frequency());
            if (self.selectedTypes() === "FULL") {
                self.startDate(reviewBlackoutData.startDate());
                self.endDate(reviewBlackoutData.endDate());
                self.recurring(false);
            } else if (self.selectedTypes() === "DAILY") {
                self.rstartDate(reviewBlackoutData.startDate());
                self.rendDate(reviewBlackoutData.endDate());
                self.recurring(true);
            }
        } else if (!self.params.data.taskCode) {
            self.mode = ko.observable("APPROVE");
            ReviewTransactionBlackoutModel.readTB(self.params.data.blackoutId()).done(function (data) {
                reviewBlackoutData = data.transactionBlackout;
                if (reviewBlackoutData.taskCode) {
                    ReviewTransactionBlackoutModel.fetchTaskName(reviewBlackoutData.taskCode).done(function (data) {
                        self.transactionName(data.task.name);
                    });
                }
                for (i = 0; i < reviewBlackoutData.blackoutRole.length; i++) {
                    self.userType.push(reviewBlackoutData.blackoutRole[i].roleName);
                }
                self.blackoutTime(reviewBlackoutData.blackoutTime);
                self.selectedTypes(reviewBlackoutData.frequency);
                if (self.selectedTypes() === "FULL") {
                    self.recurring(false);
                    self.startDate(reviewBlackoutData.startDate);
                    self.endDate(reviewBlackoutData.endDate);
                } else if (self.selectedTypes() === "DAILY") {
                    self.recurring(true);
                    self.rstartDate(reviewBlackoutData.startDate);
                    self.rendDate(reviewBlackoutData.endDate);
                }
            });
            self.approverReview(true);
        } else {
            self.mode = ko.observable("APPROVE");
            reviewBlackoutData = self.params.data;
            self.approverReview(true);
            for (i = 0; i < reviewBlackoutData.blackoutRole().length; i++) {
                self.userType.push(reviewBlackoutData.blackoutRole()[i].roleName());
            }
            if (reviewBlackoutData.taskCode) {
                ReviewTransactionBlackoutModel.fetchTaskName(reviewBlackoutData.taskCode()).done(function (data) {
                    self.transactionName(data.task.name);
                });
            }
            self.blackoutTime(reviewBlackoutData.blackoutTime());
            self.selectedTypes(reviewBlackoutData.frequency());
            if (self.selectedTypes() === "FULL") {
                self.startDate(reviewBlackoutData.startDate());
                self.endDate(reviewBlackoutData.endDate());
                self.recurring(false);
            } else if (self.selectedTypes() === "DAILY") {
                self.rstartDate(reviewBlackoutData.startDate());
                self.rendDate(reviewBlackoutData.endDate());
                self.recurring(true);
            }
        }
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
            ReviewTransactionBlackoutModel.fetchUserType().done(function (taskData) {
                var mapped = [];
                for (var i = 0; i < taskData.enterpriseRoleDTOs.length; i++) {
                    if (taskData.enterpriseRoleDTOs[i].enterpriseRoleId !== "administrators") {
                        mapped.push({
                            "value": taskData.enterpriseRoleDTOs[i].enterpriseRoleId,
                            "label": taskData.enterpriseRoleDTOs[i].enterpriseRoleName
                        });
                    }
                }
                mapped.push({
                    "value": self.resourceBundle.transaction.prospectValue,
                    "label": self.resourceBundle.transaction.prospect
                });
                self.userTypeOptions(mapped.sort(self.compare));
                self.showuserTypeList(true);
            });
        };
        self.displayUserTypeData();
        self.edit = function () {
            if (self.prevMode() === "CREATE") {
                self.mode("CREATE");
            } else if (self.prevMode() === "EDIT") {
                self.mode("EDIT");
            }
        };
        self.getTime = function (time) {
            return time.substring(1, 6);
        };
        self.confirm = function () {
            var i;
            self.blackoutPayload.blackoutId(reviewBlackoutData.blackoutId());
            for (i = 0; i < reviewBlackoutData.blackoutRole().length; i++) {
                self.blackoutRole = {
                    "blackoutId": null,
                    "roleName": null
                };
                self.blackoutRole.blackoutId = reviewBlackoutData.blackoutId();
                self.blackoutRole.roleName = reviewBlackoutData.blackoutRole()[i];
                self.blackoutPayload.blackoutRole.push(self.blackoutRole);
            }
            self.blackoutPayload.frequency(reviewBlackoutData.frequency());
            self.blackoutPayload.startDate(reviewBlackoutData.startDate());
            self.blackoutPayload.endDate(reviewBlackoutData.endDate());
            for (i = 0; i < reviewBlackoutData.blackoutTime().length; i++) {
                self.blackoutTime = {
                    "blackoutId": null,
                    "startTime": null,
                    "endTime": null
                };
                self.blackoutTime.blackoutId = reviewBlackoutData.blackoutId();
                self.blackoutTime.startTime = self.getTime(reviewBlackoutData.blackoutTime()[i].startTime());
                self.blackoutTime.endTime = self.getTime(reviewBlackoutData.blackoutTime()[i].endTime());
                self.blackoutPayload.blackoutTime.push(self.blackoutTime);
            }
            if (self.prevMode() === "CREATE") {
                self.blackoutPayload.taskCode(reviewBlackoutData.taskCode().split("~")[0]);
                self.blackoutPayload.transactionName(reviewBlackoutData.taskCode().split("~")[1]);
                ReviewTransactionBlackoutModel.createBlackout(ko.toJSON(ko.mapping.toJS(self.blackoutPayload))).done(function (data, status, jqXhr) {
                    self.transactionName(self.resourceBundle.transaction.blackout);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.transactionName()
                    }, self);
                });
            } else if (self.prevMode() === "EDIT") {
                self.blackoutPayload.taskCode(reviewBlackoutData.taskCode());
                self.blackoutPayload.transactionName(reviewBlackoutData.transactionName());
                ReviewTransactionBlackoutModel.updateBlackout(self.blackoutPayload.blackoutId(), ko.toJSON(ko.mapping.toJS(self.blackoutPayload))).done(function (data, status, jqXhr) {
                    self.transactionName(self.nls.transaction.blackout);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
    };
});
