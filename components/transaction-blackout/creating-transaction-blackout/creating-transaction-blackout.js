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
    "ojs/ojmenu",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, createTransactionBlackoutModel, resourceBundle) {
    "use strict";
    var vm = function (rootParams) {
        var i, index, self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        var getNewKoModel = function () {
            var KoModel = createTransactionBlackoutModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.blackout = self.rootModelInstance().blackout;
        self.blackoutTime = {
            "blackoutId": null,
            "startTime": null,
            "endTime": null
        };
        self.blackout.blackoutTime.push(ko.mapping.fromJS(self.blackoutTime));
        self.blackoutDetails = ko.observable();
        self.groupValid1 = ko.observable();
        self.groupValid2 = ko.observable();
        self.groupValid3 = ko.observable();
        rootParams.dashboard.headerName(self.nls.transaction.blackout);
        self.transactionName = ko.observable();
        self.heading = ko.observable();
        self.disableTransaction = ko.observable(true);
        self.editdisableTransaction = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.transactions = ko.observableArray();
        self.selectedTransaction = ko.observable();
        self.showDropDownTransactions = ko.observable(false);
        self.full = ko.observable(false);
        self.recurring = ko.observable(false);
        self.userTypeOptions = ko.observableArray();
        self.showuserTypeList = ko.observable(false);
        self.typeTransaction = ko.observable();
        self.minTime = ko.observable();
        self.minDate = ko.observable();
        self.overalpping = ko.observable(false);
        self.transTypes = ko.observableArray([
            {
                value: "MAINTENANCE",
                label: self.nls.transaction.maintenance
            },
            {
                value: "ADMINISTRATION",
                label: self.nls.transaction.admin_maintenance
            },
            {
                value: "INQUIRY",
                label: self.nls.transaction.inquiry
            },
            {
                value: "NONFINANCIAL_TRANSACTION",
                label: self.nls.transaction.nonFinancialTransaction
            },
            {
                value: "FINANCIAL_TRANSACTION",
                label: self.nls.transaction.financialTransaction
            }
        ]);
        rootParams.baseModel.registerComponent("transaction-blackout-view", "transaction-blackout");
        rootParams.baseModel.registerComponent("transaction-blackout-review", "transaction-blackout");
        rootParams.baseModel.registerComponent("search-transaction-blackout", "transaction-blackout");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
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
            createTransactionBlackoutModel.fetchUserType().done(function (taskData) {
                var mapped = [];
                for (i = 0; i < taskData.enterpriseRoleDTOs.length; i++) {
                    if (taskData.enterpriseRoleDTOs[i].enterpriseRoleId !== "administrators") {
                        mapped.push({
                            "value": taskData.enterpriseRoleDTOs[i].enterpriseRoleId,
                            "label": taskData.enterpriseRoleDTOs[i].enterpriseRoleName
                        });
                    }
                }
                mapped.push({
                    "value": self.nls.transaction.prospectValue,
                    "label": self.nls.transaction.prospect
                });
                self.userTypeOptions(mapped.sort(self.compare));
                self.showuserTypeList(true);
            });
        };
        self.displayUserTypeData();
        self.getTimeT = function (data) {
            var dateForTime = rootParams.baseModel.getDate();
            dateForTime.setHours(data.split(":")[0], data.split(":")[1], 0);
            function pad(n) {
                return n < 10 ? "0" + n : n;
            }
            return "T" + pad(dateForTime.getHours()) + ":" + pad(dateForTime.getMinutes()) + ":" + pad(dateForTime.getSeconds());
        };
        var d = rootParams.baseModel.getDate();
        self.myDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.getFullYear(), d.getMonth(), d.getDate())));
        d.setDate(d.getDate() + 1);
        self.minEffectiveDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
        self.minDate(self.minEffectiveDate());
        self.myTimestamp = ko.observable(rootParams.baseModel.getDate().getHours() + ":" + rootParams.baseModel.getDate().getMinutes());
        self.myTimestamp(self.getTimeT(self.myTimestamp()));

        self.verifyStartTime = function (event) {
            index = event.currentTarget.id;
            index = index.substring(index.length - 1, index.length);
            if (self.blackout.blackoutTime()[index]) {
                var startTime = self.blackout.blackoutTime()[index].startTime();
                var endTime = self.blackout.blackoutTime()[index].endTime();
                if (endTime !== null) {
                    if (startTime > endTime) {
                        self.blackout.blackoutTime()[index].endTime(startTime);
                    }
                }
            }
        };
        self.dateRangeOverlaps = function (a_start, a_end, b_start, b_end) {
            if (a_start <= b_start && b_start < a_end)
                return true;
            if (a_start < b_end && b_end <= a_end)
                return true;
            if (b_start < a_start && a_end < b_end)
                return true;
            if (b_start === b_end && a_start === a_end)
                return true;
            return false;
        };
        self.timeChangedHandler = function (event) {
            index = event.currentTarget.id;
            index = index.substring(index.length - 1, index.length);
            var length = self.blackout.blackoutTime().length;
            for (i = 0; i < length; i++) {
                var startTime1 = self.blackout.blackoutTime()[i].startTime();
                var endTime1 = self.blackout.blackoutTime()[i].endTime();
                for (var j = i + 1; j < length; j++) {
                    var startTime2 = self.blackout.blackoutTime()[j].startTime();
                    var endTime2 = self.blackout.blackoutTime()[j].endTime();
                    if (startTime2 !== null || endTime2 !== null) {
                        if (self.dateRangeOverlaps(startTime1, endTime1, startTime2, endTime2)) {
                            self.overalpping(true);
                            rootParams.baseModel.showMessages(null, [self.nls.transaction.Overlapping], "ERROR");
                        } else {
                            self.overalpping(false);
                        }
                    }
                }
            }
        };
        self.transactionTypeSubscribe = self.typeTransaction.subscribe(function (data) {
            self.selectedTransaction([]);
            self.displayRulesData(data);
        });
        self.endDateSubscribe = self.blackout.endDate.subscribe(function () {
            if (self.blackout.frequency() === "FULL") {
                if (self.blackout.transactionBlackoutStatusType() === "ONGOING") {
                    if (rootParams.baseModel.formatDate(self.blackout.startDate()) < rootParams.baseModel.formatDate(self.myDate())) {
                        if (rootParams.baseModel.formatDate(self.blackout.endDate()) === rootParams.baseModel.formatDate(self.myDate()) && self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].endTime() < self.myTimestamp()) {
                            self.minTime(self.myTimestamp());
                            self.blackout.blackoutTime()[0].endTime(self.myTimestamp());
                        }
                    }
                    if (rootParams.baseModel.formatDate(self.blackout.startDate()) === rootParams.baseModel.formatDate(self.blackout.endDate()) && self.blackout.endDate() !== null) {
                        if (self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].endTime() < self.myTimestamp()) {
                            self.blackout.blackoutTime()[0].endTime(self.myTimestamp());
                        }
                        self.minTime(self.myTimestamp());
                    } else {
                        self.minTime("");
                    }
                } else if (self.blackout.startDate() === self.blackout.endDate() && self.blackout.blackoutTime()[0].startTime() !== null) {
                        if (self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].startTime() > self.blackout.blackoutTime()[0].endTime()) {
                            self.blackout.blackoutTime()[0].endTime(self.blackout.blackoutTime()[0].startTime());
                        }
                        self.minTime(self.blackout.blackoutTime()[0].startTime());
                    } else {
                        self.minTime("");
                    }
            }
        });
        self.startDateSubscribe = self.blackout.startDate.subscribe(function () {
            if (self.blackout.startDate() !== null) {
                self.minDate(self.blackout.startDate());
            } else {
                self.minDate(self.minEffectiveDate());
            }
            if (self.blackout.frequency() === "FULL") {
                if (self.blackout.startDate() === self.blackout.endDate() && self.blackout.blackoutTime()[0].startTime() !== null) {
                    if (self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].startTime() > self.blackout.blackoutTime()[0].endTime()) {
                        self.blackout.blackoutTime()[0].endTime(self.blackout.blackoutTime()[0].startTime());
                    }
                    self.minTime(self.blackout.blackoutTime()[0].startTime());
                } else {
                    self.minTime("");
                }
            }
        });
        self.startTimeChangedHandler = function () {
            if (self.blackout.frequency() === "FULL") {
                if (self.blackout.startDate() === self.blackout.endDate() && self.blackout.startDate() !== null && self.blackout.endDate() !== null) {
                    if (self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].startTime() > self.blackout.blackoutTime()[0].endTime()) {
                        self.blackout.blackoutTime()[0].endTime(self.blackout.blackoutTime()[0].startTime());
                    }
                    self.minTime(self.blackout.blackoutTime()[0].startTime());
                } else {
                    self.minTime("");
                }
            }
        };
        self.endTimeChangedHandler = function () {
            if (self.blackout.transactionBlackoutStatusType() === "ONGOING") {
                if (self.blackout.frequency() === "FULL") {
                    if (rootParams.baseModel.formatDate(self.blackout.startDate()) === rootParams.baseModel.formatDate(self.blackout.endDate()) && self.blackout.endDate() !== null) {
                        if (self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].endTime() < self.myTimestamp()) {
                            self.blackout.blackoutTime()[0].endTime(self.myTimestamp());
                        }
                        self.minTime(self.myTimestamp());
                    } else if (rootParams.baseModel.formatDate(self.blackout.startDate()) < rootParams.baseModel.formatDate(self.myDate())) {
                        self.minDate(self.myDate());
                        if (rootParams.baseModel.formatDate(self.blackout.endDate()) === rootParams.baseModel.formatDate(self.myDate()) && self.blackout.blackoutTime()[0].endTime() !== null && self.blackout.blackoutTime()[0].endTime() < self.myTimestamp()) {
                            self.minTime(self.myTimestamp());
                            self.blackout.blackoutTime()[0].endTime(self.myTimestamp());
                        }
                    } else {
                        self.minTime("");
                        self.minDate(self.blackout.startDate());
                    }
                }
            }
        };
        function fetchChildTasks(task) {
            var taskCodeList = [];
            for (var j = 0; j < task.childTasks.length; j++) {
                var currentTask = task.childTasks[j];
                var taskObject = {};
                taskObject.label = currentTask.name;
                if (currentTask.childTasks) {
                    taskObject.children = fetchChildTasks(currentTask);
                } else {
                    for (var k = 0; k < currentTask.aspects.length; k++) {
                        if (currentTask.aspects[k].taskAspect === "blackout" && currentTask.aspects[k].enabled) {
                            taskObject.value = currentTask.id + "~" + currentTask.name;
                        }
                    }
                }
                taskCodeList.push(taskObject);
            }
            return taskCodeList;
        }
        function customizeTaskListForDropdown(task) {
            var taskCodeList = [];
            for (var i = 0; i < task.length; i++) {
                for (var j = 0; j < task[i].childTasks.length; j++) {
                    var currentTask = task[i].childTasks[j];
                    var taskObject = {};
                    taskObject.label = currentTask.name;
                    if (currentTask.childTasks) {
                        taskObject.children = fetchChildTasks(currentTask);
                    } else {
                        for (var k = 0; k < currentTask.aspects.length; k++) {
                            if (currentTask.aspects[k].taskAspect === "blackout" && currentTask.aspects[k].enabled) {
                                taskObject.value = currentTask.id + "~" + currentTask.name;
                            }
                        }
                    }
                    taskCodeList.push(taskObject);
                }
            }
            return taskCodeList;
        }
        self.displayRulesData = function (taskType) {
            createTransactionBlackoutModel.getTransactions(taskType).done(function (taskData) {
                var tasks = customizeTaskListForDropdown(taskData.taskList);
                self.transactions(tasks);
                self.showDropDownTransactions(true);
                self.disableTransaction(false);
                self.showDropDownUsers(true);
            });
        };
        self.typeDefaultChangeHandler = function (event) {
            if (event.detail.value === "FULL") {
                self.full(true);
                self.blackout.startDate(null);
                self.blackout.endDate(null);
                self.blackout.blackoutTime.removeAll();
                self.addRow();
                self.recurring(false);
            } else if (event.detail.value === "DAILY") {
                self.full(false);
                self.blackout.startDate(null);
                self.blackout.endDate(null);
                self.blackout.blackoutTime.removeAll();
                self.addRow();
                self.recurring(true);
            }
            self.minDate(self.minEffectiveDate());
        };
        self.deleteRow = function () {
            self.blackout.blackoutTime.pop();
            if (self.overalpping()) {
                self.overalpping(false);
            }
        };
        self.addRow = function () {
            if (!self.overalpping()) {
                self.blackout.blackoutTime.push(ko.mapping.fromJS({
                    "blackoutId": null,
                    "startTime": null,
                    "endTime": null
                }));
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.transaction.Overlapping], "ERROR");
            }
        };
        if (self.mode() === "VIEW") {
            self.heading(self.nls.common.view);
            self.blackoutDetails(ko.mapping.fromJS(self.params[0]));
            self.blackout.transactionBlackoutStatusType(self.params[0].transactionBlackoutStatusType);
            self.prevMode("EDIT");
        }
        self.save = function () {
            var tracker1 = document.getElementById("tracker1");
            if(self.blackout.frequency() === "FULL") {
                if (tracker1.valid === "valid") {
                    if (!self.overalpping()) {
                        self.heading(self.nls.common.review);
                        self.mode("REVIEW");
                    } else {
                        rootParams.baseModel.showMessages(null, [self.nls.transaction.Overlapping], "ERROR");
                    }
                } else {
                  tracker1.showMessages();
                  tracker1.focusOn("@firstInvalidShown");
                }
            } else if (tracker1.valid === "valid") {
                    if (!self.overalpping()) {
                        self.heading(self.nls.common.review);
                        self.mode("REVIEW");
                    } else {
                        rootParams.baseModel.showMessages(null, [self.nls.transaction.Overlapping], "ERROR");
                    }
                } else {
                  tracker1.showMessages();
                  tracker1.focusOn("@firstInvalidShown");
                }
        };
        self.edit = function () {
            if (self.prevMode() === "EDIT") {
                self.blackout.blackoutId(self.params[0].blackoutId);
                self.blackout.frequency(self.params[0].frequency);
                self.blackout.transactionBlackoutStatusType(self.params[0].transactionBlackoutStatusType);
                self.selectedTransaction(self.params[0].transactionName);
                self.blackout.transactionName(self.params[0].transactionName);
                self.blackout.taskCode(self.params[0].taskCode);
                self.blackout.startDate(self.params[0].startDate);
                self.blackout.endDate(self.params[0].endDate);
                if (self.blackout.frequency() === "FULL") {
                    self.recurring(false);
                } else if (self.blackout.frequency() === "DAILY") {
                    self.recurring(true);
                }
                self.blackout.blackoutTime.removeAll();
                for (i = 0; i < self.params[0].blackoutTime.length; i++) {
                    self.addRow();
                    self.blackout.blackoutTime()[i].blackoutId(self.params[0].blackoutId);
                    self.blackout.blackoutTime()[i].startTime(self.params[0].blackoutTime[i].startTime);
                    self.blackout.blackoutTime()[i].endTime(self.params[0].blackoutTime[i].endTime);
                }
                self.blackout.blackoutRole.removeAll();
                for (i = 0; i < self.params[0].blackoutRole.length; i++) {
                    self.blackout.blackoutRole.push(self.params[0].blackoutRole[i].roleName);
                }
                if (self.blackout.transactionBlackoutStatusType() === "ONGOING") {
                    self.editdisableTransaction(true);
                } else if (self.blackout.startDate() < rootParams.baseModel.getDate().toISOString()) {
                    self.editdisableTransaction(true);
                } else {
                    self.editdisableTransaction(false);
                }
                for (i = 0; i < self.blackout.blackoutTime().length; i++) {
                    self.blackout.blackoutTime()[i].startTime(self.getTimeT(self.blackout.blackoutTime()[i].startTime()));
                    self.blackout.blackoutTime()[i].endTime(self.getTimeT(self.blackout.blackoutTime()[i].endTime()));
                }
                self.mode("EDIT");
            }
        };
        self.delete = function () {
            createTransactionBlackoutModel.deleteBlackout(self.params[0].blackoutId).done(function (data, status, jqXhr) {
                self.transactionName(self.nls.transaction.deleteBlackoutTitle);
                self.hideDeleteBlock();
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            }).fail(function () {
                self.hideDeleteBlock();
            });
        };
        self.back = function () {
            if (self.mode() === "EDIT") {
                self.mode("VIEW");
                self.heading(self.nls.common.view);
            } else {
                rootParams.dashboard.loadComponent("search-transaction-blackout", {}, self);
            }
        };
        self.hideDeleteBlock = function () {
            $("#deleteDialog").hide();
        };
    };
    vm.prototype.dispose = function () {
        this.transactionTypeSubscribe.dispose();
        this.endDateSubscribe.dispose();
        this.startDateSubscribe.dispose();
    };
    return vm;
});
