define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/task-aspects",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojswitch",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, BaseLogger, TransactionAspectsModel, ResourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(TransactionAspectsModel.getNewModel());
                return KoModel;
            };
        self.resource = ResourceBundle;
        self.payload = getNewKoModel().payload;
        self.selectedTransaction = ko.observable();
        self.transactionsList = ko.observable();
        self.taskList = ko.observableArray();
        self.supportedTaskList = ko.observableArray();
        self.graceperiod = ko.observable();
        self.approvalValue = ko.observable();
        self.graceEnabled = ko.observable(true);
        self.taskName = ko.observable();
        self.mode = ko.observable();
        self.emptyList = ko.observable(false);
        self.validationTracker = ko.observable();
        self.switchEnabled = ko.observable(true);
        self.dataLoaded = ko.observable(false);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.resource.header.transactionAspects);
        TransactionAspectsModel.getTransactions().done(function(data) {
            var tasks=ko.utils.arrayFilter(data.taskList, function(dataItem) {
              return dataItem.aspects&&dataItem.aspects.length;
            });
            self.transactionsList(tasks);
            self.dataLoaded(true);
          });
        self.searchTransactions = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater")))
                return;
            self.reviewTransactionMessage = {
                header: self.resource.common.reviewHeader,
                reviewHeader: self.resource.common.reviewHeader1
            };
            TransactionAspectsModel.searchTransactions(self.selectedTransaction()).done(function(data) {
                self.taskName(data.task.name);
                self.emptyList(false);
                self.taskList(data.task.aspects);
                self.supportedTaskList.removeAll();
                self.graceperiod("");
                for (var i = 0; i < self.taskList().length; i++) {
                    if (self.taskList()[i].taskAspect !== "grace-period") {
                        self.supportedTaskList.push(self.taskList()[i]);
                    } else {
                        self.graceperiod(self.taskList()[i]);
                    }
                    if (self.taskList()[i].taskAspect === "approval") {
                        self.approvalValue(self.taskList()[i].enabled);
                    }
                }
                if (!self.supportedTaskList().length) {
                    self.emptyList(true);
                    self.mode("NOASPECTS");
                } else {
                    self.switchEnabled(true);
                    self.mode("VIEW");
                    self.dataLoaded(false);
                    self.dataLoaded(true);
                    self.graceEnabled(true);
                }
            });
        };
        self.editTransactions = function() {
            self.mode("EDIT");
            self.switchEnabled(false);
            if (self.approvalValue()) {
                self.graceEnabled(false);
            } else {
                self.graceEnabled(true);
            }
            self.dataLoaded(false);
            self.dataLoaded(true);
        };
        self.saveTransactions = function() {
            self.mode("REVIEW");
            self.switchEnabled(true);
            self.graceEnabled(true);
            self.dataLoaded(false);
            self.dataLoaded(true);
        };
        self.clearTransactions = function() {
            self.selectedTransaction("");
        };
        self.changeGrace = function() {
            for (var i = 0; i < self.taskList().length; i++) {
                if (self.taskList()[i].taskAspect === "approval") {
                    self.approvalValue(self.taskList()[i].enabled);
                }
            }
            if (self.approvalValue() === true) {
                self.graceEnabled(false);
            } else {
                self.graceEnabled(true);
            }

        };
        self.back = function() {
            if (self.mode() === "EDIT") {
                self.mode("VIEW");
                self.graceEnabled(true);
                self.switchEnabled(true);
            } else if (self.mode() === "VIEW") {
                self.mode("");
                self.switchEnabled(true);
            } else if (self.mode() === "NOASPECTS") {
                self.mode("");
                self.switchEnabled(true);
            }
        };
        self.confirm = function() {
            self.payload = self.taskList();
            TransactionAspectsModel.setTaskAspects(self.selectedTransaction(), ko.toJSON(self.payload)).done(function(data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resource.common.maintenance
                }, self);
            });
        };
    };
});