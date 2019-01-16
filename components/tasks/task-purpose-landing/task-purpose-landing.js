define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/task-purpose",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, TaskPurposeLandingModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, TaskPurposeLanding = new TaskPurposeLandingModel();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.tasksLoaded = ko.observable(false);
        self.taskPurposeMapping = ko.observableArray();
        self.mappedPurposes = [];
        self.newMapping = ko.observable(false);
        self.taskSelected = ko.observable();
        self.purposesMapped = ko.observableArray();
        self.allPurposeList = ko.observableArray();
        self.taskList = ko.observableArray();
        self.taskCode = ko.observable();
        self.taskDesc = ko.observable();
        self.purposesLoaded = ko.observable(false);
        self.invalidTracker = ko.observable();
        rootParams.baseModel.registerComponent("task-purpose-add", "tasks");
        rootParams.baseModel.registerComponent("task-purpose-inquire", "tasks");
        rootParams.dashboard.headerName(self.resource.header.purposeTaskLanding);
        rootParams.dashboard.headerCaption("");
        self.fetchTaskPurposeMapping = function () {
            self.tasksLoaded(false);
            TaskPurposeLanding.fetchTaskPurposeMapping(self.taskSelected).done(function (data) {
                for (var i = 0; i < data.linkageList.length; i++) {
                    if (data.linkageList[i].purposeList) {
                        for (var j = 0; j < data.linkageList[i].purposeList.length; j++) {
                            self.mappedPurposes.push({
                                code: data.linkageList[i].purposeList[j].code,
                                description: data.linkageList[i].purposeList[j].description
                            });
                        }
                        self.taskPurposeMapping.push({
                            taskCode: data.linkageList[i].taskCode,
                            taskDescription: data.linkageList[i].taskDescription,
                            purposeList: self.mappedPurposes
                        });
                    }
                    self.mappedPurposes = [];
                }
                self.filterMappedTasks();
                self.tasksLoaded(true);
            });
        };
        self.filterMappedTasks = function () {
            TaskPurposeLanding.fetchTaskList().done(function (data) {
                if (data.taskList.length > self.taskPurposeMapping().length) {
                    self.newMapping(true);
                }
                for (var i = 0; i < data.taskList[0].childTasks[0].childTasks.length; i++) {
                    self.taskList.push({
                        taskCode: data.taskList[0].childTasks[0].childTasks[i].id,
                        taskDescription: data.taskList[0].childTasks[0].childTasks[i].name
                    });
                }
            });
        };
        self.fetchTaskPurposeMapping();
        self.fetchAllPurposes = function () {
            TaskPurposeLanding.fetchPurposeList().done(function (data) {
                for (var i = 0; i < data.purposeList.length; i++) {
                    self.allPurposeList.push({
                        purposeCode: data.purposeList[i].code,
                        purposeDesc: data.purposeList[i].description
                    });
                }
            });
        };
        self.fetchAllPurposes();
        self.loadPurposes = function () {
            self.purposesLoaded(false);
        };
        self.editMapping = function() {
          rootParams.dashboard.loadComponent("task-purpose-inquire", {
            purposesMapped: self.purposesMapped(),
            taskDesc: self.taskDesc(),
            taskCode: self.taskCode()});
        };
        self.inquireMapping = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            for (var i = 0; i < self.taskList().length; i++) {
                if (self.taskList()[i].taskCode === self.taskSelected()) {
                    self.taskCode(self.taskSelected());
                    self.taskDesc(self.taskList()[i].taskDescription);
                    break;
                }
            }
            self.purposesMapped.removeAll();
            var taskPurposeList = self.taskPurposeMapping();
            for (var j = 0; j < taskPurposeList.length; j++) {
                if (taskPurposeList[j].taskCode === self.taskSelected()) {
                    self.taskDesc(taskPurposeList[j].taskDescription);
                    for (var k = 0; k < taskPurposeList[j].purposeList.length; k++) {
                        self.purposesMapped.push(taskPurposeList[j].purposeList[k].code);
                    }
                }
            }
            self.purposesLoaded(true);
        };
    };
});