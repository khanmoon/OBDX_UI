define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/task-purpose",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset"
], function (oj, ko, $, BaseLogger, TaskPurposeAddModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, TaskPurposeAdd = new TaskPurposeAddModel();
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        self.resource = ResourceBundle;
        self.allTaskList = ko.observableArray();
        self.mappedTasks = ko.observableArray();
        self.allTasksLoaded = ko.observable(false);
        self.mappedTasksLoaded = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.taskLoaded = ko.observable(false);
        rootParams.dashboard.headerName(self.resource.header.mapPurposeCode);
        self.purposeLoaded = ko.observable(false);
        self.payLoad = ko.observableArray();
        self.taskSelected = ko.observable();
        self.mappedPurpose = ko.observableArray();
        self.reviewLoaded = ko.observable(false);
        self.reviewTask = ko.observable();
        self.fetchAllTasks = function () {
            self.allTaskList(self.taskList());
            self.allTasksLoaded(true);
        };
        self.fetchAllTasks();
        self.fetchMappedTasks = function () {
            TaskPurposeAdd.fetchTaskPurposeMapping().done(function (data) {
                for (var i = 0; i < data.linkageList.length; i++) {
                    self.mappedTasks.push({
                        taskCode: data.linkageList[i].taskCode,
                        taskDescription: data.linkageList[i].taskDescription
                    });
                }
                self.mappedTasksLoaded(true);
            });
        };
        self.fetchMappedTasks();
        ko.computed(function () {
            if (self.mappedTasksLoaded() && self.allTasksLoaded()) {
                for (var i = 0; i < self.mappedTasks().length; i++) {
                    self.allTaskList.remove(function (allTaskList) {
                        return allTaskList.taskCode === self.mappedTasks()[i].taskCode;
                    });
                }
                self.allTaskList.sort(function (left, right) {
                    return left.taskDescription === right.taskDescription ? 0 : left.taskDescription < right.taskDescription ? -1 : 1;
                });
                self.taskLoaded(true);
                if (self.allTaskList().length > 0) {
                    self.taskSelected(self.allTaskList()[0].taskCode);
                }
            }
        });
        self.fetchAllPurposes = function () {
            self.allPurposeList();
            self.purposeLoaded(true);
        };
        self.fetchAllPurposes();
        self.taskChanged = function (event) {
            if (event.detail.value) {
                self.mappedPurpose.removeAll();
            }
        };
        self.review = function () {
            if (self.mappedPurpose().length <= 0) {
                $("#mapPurpose").trigger("openModal");
            } else {
                for (var i = 0; i < self.allTaskList().length; i++) {
                    if (self.taskSelected() === self.allTaskList()[i].taskCode) {
                        self.taskSelected(self.allTaskList()[i].taskCode);
                        self.reviewTask(self.allTaskList()[i].taskDescription);
                        break;
                    }
                }
                self.taskLoaded(false);
                self.purposeLoaded(false);
                self.reviewLoaded(true);
            }
        };
        self.hide = function () {
            $("#mapPurpose").hide();
        };
        self.saveMapping = function () {
            for (var i = 0; i < self.mappedPurpose().length; i++) {
                self.payLoad.push({
                    taskCode: self.taskSelected(),
                    purposeCode: self.mappedPurpose()[i]
                });
            }
            var model = ko.toJSON({ linkageList: self.payLoad() });
            TaskPurposeAdd.createTaskPurposeMapping(model).done(function (data, status, jqXHR) {
                rootParams.baseModel.registerElement("confirm-screen");
                self.httpStatus(jqXHR.status);
                self.transactionStatus(data.status);
                self.reviewLoaded(false);
                self.taskLoaded(false);
                self.purposeLoaded(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.header.mapPurposeCode,
                    template: "tasks/confirm-screen-templates/task-purpose-add"
                }, self);
            });
        };
        self.cancel = function () {
            history.back();
        };
        self.done = function () {
            window.location.reload();
        };
        self.ok = function () {
            window.location.reload();
        };
        self.back = function () {
           self.reviewLoaded(false);
                self.taskLoaded(true);
                self.purposeLoaded(true);
        };
        $(window).on("hashchange", function () {
            if (location.hash === "") {
                self.reviewLoaded(false);
                self.taskLoaded(true);
                self.purposeLoaded(true);
            }
        });
    };
});