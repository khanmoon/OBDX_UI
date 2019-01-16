define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/transaction-cutoff",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox"
], function (oj, ko, $, BaseLogger, createCutoffExceptionsModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("cutoff-nav-bar", "cutoff");
        rootParams.baseModel.registerComponent("user-nav-bar", "cutoff");
        rootParams.baseModel.registerComponent("cutoff-exceptions", "cutoff");
        rootParams.baseModel.registerComponent("transaction-selection", "account-access-management");
        rootParams.baseModel.registerComponent("review-exception-working-window", "cutoff");
        rootParams.dashboard.headerName(self.nls.pageTitle.title);
        self.dateType = ko.observable("fixedDate");
        self.userType = ko.observableArray([]);
        self.userTypeOptions = ko.observableArray();
        self.showuserTypeOptions = ko.observable(false);
        self.selectedTransaction = ko.observableArray();
        self.transactions = ko.observableArray([]);
        self.showTransactions = ko.observable(false);
        self.groupValid1 = ko.observable();
        self.groupValid2 = ko.observable();
        self.windowTimeArray = ko.observableArray([
            {
                value: "OPEN",
                label: self.nls.labels.OPEN
            },
            {
                value: "LIMITED",
                label: self.nls.labels.LIMITED
            },
            {
                value: "CLOSED",
                label: self.nls.labels.CLOSED
            }
        ]);
        self.transactionWindow = ko.observable(["OPEN"]);
        self.disableTimeFrame = ko.observable(true);
        self.referenceNumber = ko.observable();
        self.validationTracker = ko.observable();
        self.mode = ko.observable(self.params.mode);
        self.actionType = ko.observable("CREATE");
        self.getTimeString = function (data) {
            if (data && data.length === 5) {
                var dateForTime = rootParams.baseModel.getDate();
                dateForTime.setHours(data.split(":")[0], data.split(":")[1], 0);
                var pad = function (n) {
                    return n < 10 ? "0" + n : n;
                };
                return "T" + pad(dateForTime.getHours()) + ":" + pad(dateForTime.getMinutes()) + ":" + pad(dateForTime.getSeconds());
            }
                return data;

        };
        if (self.params.selectedWindow) {
            self.exception = ko.mapping.fromJS(self.params.selectedWindow);
            if (self.exception.endDate() !== null && self.exception.effectiveDate() !== self.exception.endDate()) {
                self.dateType("dateRange");
            }
            self.selectedTransaction(self.exception.workingWindowRoleTaskMapDTOs()[0].taskCode());
            for (var i = 0; i < self.exception.workingWindowRoleTaskMapDTOs().length; i++) {
                self.userType().push(self.exception.workingWindowRoleTaskMapDTOs()[i].roleName());
                if (i === 0) {
                    var data = self.exception.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0];
                    if (data.startTime() === "00:00" && data.endTime() === "00:00") {
                        self.disableTimeFrame(true);
                        self.transactionWindow("CLOSED");
                    } else if (data.startTime() === "00:00" && data.endTime() === "23:59") {
                        self.disableTimeFrame(true);
                        self.transactionWindow("OPEN");
                    } else {
                        self.disableTimeFrame(false);
                        self.transactionWindow("LIMITED");
                    }
                    self.exception.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].startTime(self.getTimeString(self.exception.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].startTime()));
                    self.exception.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].endTime(self.getTimeString(self.exception.workingWindowRoleTaskMapDTOs()[i].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].endTime()));
                }
            }
            if (self.exception.workingWindowRoleTaskMapDTOs().length > 1) {
                self.exception.workingWindowRoleTaskMapDTOs().pop();
            }
        } else {
            var getNewKoModel = function () {
                var KoModel = createCutoffExceptionsModel.getNewModel();
                return ko.mapping.fromJS(KoModel);
            };
            self.rootModelInstance = ko.observable(getNewKoModel());
            self.exception = self.rootModelInstance().exception;
        }
        var d = rootParams.baseModel.getDate();
        d.setDate(d.getDate() + 1);
        self.minEffectiveDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
        self.getToMinDate = function (fromDate) {
            var toMinDate;
            if (ko.mapping.toJS(fromDate) === null) {
                toMinDate = new Date(self.minEffectiveDate());
            } else {
                toMinDate = new Date(ko.mapping.toJS(fromDate));
            }
            toMinDate.setDate(toMinDate.getDate() + 1);
            return ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(toMinDate.setHours(0, 0, 0, 0))));
        };
        self.getDayName = function (date) {
            var today = new Date(date);
            return oj.LocaleData.getDayNames()[today.getDay()];
        };
        self.displayUserTypeData = function () {
            self.showuserTypeOptions(false);
            createCutoffExceptionsModel.fetchUserType().done(function (taskData) {
                var mapped = taskData.enterpriseRoleDTOs.filter(function (roles) {
                    return roles.enterpriseRoleId !== "administrator";
                }).map(function (data) {
                    return {
                        value: data.enterpriseRoleId,
                        label: data.enterpriseRoleName
                    };
                });
                self.userTypeOptions(mapped);
                self.showuserTypeOptions(true);
            });
        };
        self.displayUserTypeData();
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
                        if (currentTask.aspects[k].taskAspect === "working-window" && currentTask.aspects[k].enabled) {
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
                            if (currentTask.aspects[k].taskAspect === "working-window" && currentTask.aspects[k].enabled) {
                                taskObject.value = currentTask.id + "~" + currentTask.name;
                            }
                        }
                    }
                    taskCodeList.push(taskObject);
                }
            }
            return taskCodeList;
        }
        self.displayRulesData = function () {
            self.showTransactions(false);
            createCutoffExceptionsModel.getTransactions().done(function (taskData) {
                var tasks = customizeTaskListForDropdown(taskData.taskList);
                self.transactions(tasks);
                self.showTransactions(true);
            });
        };
        self.displayRulesData();
        self.addExceptionTime = function () {
            var tracker = document.getElementById("tracker1");
            if (tracker.valid === "valid") {
                if (self.dateType() === "fixedDate") {
                    self.exception.endDate(null);
                }
                self.actionType("UPDATETIME");
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
        self.displayTimeFields = function () {
            if (self.transactionWindow() === "LIMITED") {
                self.disableTimeFrame(false);
            } else if (self.transactionWindow() === "OPEN") {
                    self.exception.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].startTime("T00:00:00");
                    self.exception.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].endTime("T23:59:00");
                    self.disableTimeFrame(true);
                } else if (self.transactionWindow() === "CLOSED") {
                    self.exception.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].startTime("T00:00:00");
                    self.exception.workingWindowRoleTaskMapDTOs()[0].workingWindowDayDTOs()[0].workingWindowTimeDTOs()[0].endTime("T00:00:00");
                    self.disableTimeFrame(true);
                }
        };
        self.radiosetchangehandler = function () {
            if (self.dateType() === "fixedDate") {
                self.exception.endDate(null);
            }
        };
        self.save = function () {
            var tracker = document.getElementById("tracker2");
            if (tracker.valid === "valid") {
                var exception = ko.mapping.toJS(self.exception);
                if (self.userType() && self.userType().length > 0) {
                    exception.workingWindowRoleTaskMapDTOs[0].roleName = self.userType()[0];
                    exception.workingWindowRoleTaskMapDTOs[0].taskCode = self.selectedTransaction();
                    exception.workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[0].workingWindowTimeDTOs[0].startTime = self.getTime(exception.workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[0].workingWindowTimeDTOs[0].startTime);
                    exception.workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[0].workingWindowTimeDTOs[0].endTime = self.getTime(exception.workingWindowRoleTaskMapDTOs[0].workingWindowDayDTOs[0].workingWindowTimeDTOs[0].endTime);
                    if (self.userType().length === 2) {
                        var roleDTO = JSON.parse(JSON.stringify(exception.workingWindowRoleTaskMapDTOs[0]));
                        roleDTO.workingWindowRoleTaskId = null;
                        roleDTO.workingWindowDayDTOs[0].workingWindowDayId = null;
                        roleDTO.roleName = self.userType()[1];
                        exception.workingWindowRoleTaskMapDTOs.push(roleDTO);
                    }
                }
                var params = {
                    selectedWindow: exception,
                    mode: "REVIEW"
                };
                rootParams.dashboard.loadComponent("review-exception-working-window", params, self);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
        self.goBack = function () {
            if (self.mode() === "EDIT") {
                var params = {
                    selectedWindow: self.params.selectedWindow,
                    mode: "VIEW"
                };
                rootParams.dashboard.loadComponent("review-exception-working-window", params, self);
            } else {
                rootParams.dashboard.loadComponent("cutoff-exceptions", {}, self);
            }
        };
        self.backToCreate = function () {
            self.actionType("CREATE");
        };
        self.getTime = function (time) {
            if (time.length === 5)
                return time;
            return time.substring(1, 6);
        };
        self.verifyStartTime = function (startTime) {
            if (ko.mapping.toJS(startTime) >= self.retailWorkingWindowTimeDTO.endTime()) {
                self.retailWorkingWindowTimeDTO.endTime(ko.mapping.toJS(startTime));
            }
        };
    };
});
