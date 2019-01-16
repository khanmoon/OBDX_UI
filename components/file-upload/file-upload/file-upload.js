define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/upload-file",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojlistview"
], function (oj, ko, $, fileUploadViewModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.constants = Constants;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("file-input", "file-upload");
        self.Nls = resourceBundle.fileUpload;
        rootParams.dashboard.headerName(self.Nls.fileUpload);
        self.selectedBtId = ko.observable();
        self.selected = ko.observable(false);
        self.btid = ko.observable();
        self.btIdList = ko.observableArray();
        self.isBTIDListLoaded = ko.observable(false);
        self.btIdMap = {};
        self.transactionTypesMap = {};
        self.closedEnumsMap = {};
        self.stage1 = ko.observable(true);
        self.stage2 = ko.observable(false);
        self.response = ko.observable();
        self.validationTracker = ko.observable();
        self.valueChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedBtId(self.btIdMap[event.detail.value]);
                self.selected(true);
                $(".fileid-info").hide().slideDown();
            }
        };
        fileUploadViewModel.listBTId().done(function (data) {
            for (var i = 0; i < data.userTemplateRelationships.length; i++) {
                self.btIdList.push(data.userTemplateRelationships[i].fileIdentifierRegistrationDTO);
                self.btIdMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i].fileIdentifierRegistrationDTO;
            }
            self.isBTIDListLoaded(true);
        });
        fileUploadViewModel.getTransactionTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });
        fileUploadViewModel.getApprovalTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });
        fileUploadViewModel.getFileFormatTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });
        fileUploadViewModel.getAccountingTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });
        self.showFile = function () {
            rootParams.baseModel.registerComponent("file-view", "file-upload");
            rootParams.dashboard.loadComponent("file-view", self.response().key.id, self);
        };
        self.uploadDocument = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (document.getElementById("input").files.length === 0) {
                rootParams.baseModel.showMessages(null, [self.Nls.noFileFoundErrorMessage], "INFO");
                return;
            }
            var file = document.getElementById("input").files[0];
            if (file.size <= 0) {
                rootParams.baseModel.showMessages(null, [self.Nls.emptyFileErrorMsg], "INFO");
                return;
            } else if (file.size > 5242880) {
                rootParams.baseModel.showMessages(null, [self.Nls.fileSizeErrorMsg], "INFO");
                return;
            }
            fileUploadViewModel.uploadDocument(self.btid(), file).done(function (data, status, jqXHR) {
                self.response(data.fileUpload);
                self.stage1(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.Nls.transactionName,
                    template: "file-upload/file-upload-confirm-screen"
                }, self);
            });
        };
        self.back = function () {
            history.go(-1);
        };
    };
});