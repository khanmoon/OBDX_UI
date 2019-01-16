define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/task-purpose",
    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset"
], function (ko, $, TaskPurposeInquireModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.allPurposeList = ko.observableArray();
        self.purposesFetched = ko.observable(false);
        self.mappedPurposeList = ko.observableArray();
        self.isEdit = ko.observable(true);
        self.updatePayLoad = ko.observableArray();
        rootParams.dashboard.headerName(self.resource.header.purposeTaskLanding);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("action-header");
        self.populatePreMapped = function () {
            self.mappedPurposeList(self.params.purposesMapped);
            self.purposesFetched(true);
        };
        self.fetchAllPurposes = function () {
            TaskPurposeInquireModel.fetchPurposeList().done(function (data) {
                for (var j = 0; j < data.purposeList.length; j++) {
                    self.allPurposeList.push({
                        purposeCode: data.purposeList[j].code,
                        purposeDesc: data.purposeList[j].description
                    });
                }
                self.populatePreMapped();
            });
        };
        self.fetchAllPurposes();
        self.cancel = function () {
            history.go(-1);
        };
        self.editPurposes = function () {
            self.disabledState(false);
            self.isEdit(false);
        };
        self.savePurposes = function () {
            if (self.mappedPurposeList().length <= 0) {
                $("#mapPurpose").trigger("openModal");
            } else if ($("#updatePurpose").css("display") === "none") {
                    $("#updatePurpose").trigger("openModal");
                } else {
                    $("#updatePurpose").hide();
                    for (var i = 0; i < self.mappedPurposeList().length; i++) {
                        self.updatePayLoad.push({
                            taskCode: self.params.taskCode,
                            purposeCode: self.mappedPurposeList()[i]
                        });
                    }
                    var model = ko.toJSON({ linkageList: self.updatePayLoad() });
                    TaskPurposeInquireModel.updateLinkage(model).done(function (data, status, jqXHR) {
                        self.purposesFetched(false);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXHR,
                            transactionName: self.resource.header.purposeTaskLanding,
                            template: "tasks/confirm-screen-templates/task-purpose-inquire"
                        }, self);
                    });
                }
        };
        self.hide = function () {
            $("#mapPurpose").hide();
        };
        self.done = function () {
            window.location.reload();
        };
        self.ok = function () {
            window.location.reload();
        };
    };
});