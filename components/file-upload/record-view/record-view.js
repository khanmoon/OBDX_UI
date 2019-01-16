define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/record-view",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, recordViewModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.showBackButton = ko.observable(true);
        self.Nls = resourceBundle.recordView;
        self.rStatusList = ko.observableArray();
        self.loadPartialComponentName = ko.observable();
        rootParams.baseModel.registerElement("action-header");
        self.rStatusListMap = {};
        if (rootParams.rootModel.selectedFile) {
            rootParams.dashboard.headerName(self.Nls.uploadedFiles);
            self.selectedRecord = ko.observable(ko.utils.unwrapObservable(rootParams.rootModel.params));
        } else {
            self.selectedRecord = ko.observable(rootParams.data);
            self.showBackButton(false);
        }
        self.recordDetails = ko.observable();
        self.recordDetailsLoaded = ko.observable(false);
        self.recordType = ko.observable();
        self.transactionType = ko.observableArray();
        recordViewModel.getJSONData().done(function (data) {
            self.transactionType = data;
        });
        recordViewModel.getRecordStatus().done(function (data) {
            self.rStatusList(data.enumRepresentations[0].data);
            for (var i = 0; i < self.rStatusList().length; i++)
                self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description;
            self.readRecord();
        });
        self.readRecord = function () {
            recordViewModel.readRecord(self.selectedRecord().fileRefId, self.selectedRecord().recRefId).done(function (data) {
                if (data.recordDetails) {
                    var obj = data.recordDetails;
                    obj.amt = rootParams.baseModel.formatCurrency(obj.currencyAmount.amount, obj.currencyAmount.currency).substring(1);
                    if (obj.valueDate) {
                        obj.date = rootParams.baseModel.formatDate(obj.valueDate);
                    }
                    obj.recStatusDesc = self.rStatusListMap[obj.recStatus];
                    self.recordDetails(obj);
                    self.recordType(data.transactionType);
                    var transactionType = self.transactionType[data.transactionType];
                    if (transactionType) {
                        self.loadPartialComponentName(transactionType[0].partialComponentName);
                    }
                }
                if (data.errorDetails)
                    if (data.errorDetails.length !== 0)
                        self.recordDetails().errorMessage = data.errorDetails[0].errorMessage;
                self.recordDetailsLoaded(true);
            });
        };
        self.showModalWindow = function () {
            $("#confirm-dialog").trigger("openModal", "textarea");
        };
        self.deleteRecords = function (fileId, recordId) {
            $("#confirm-dialog").hide().trigger("closeModal");
            recordViewModel.deleteRecords(fileId, recordId).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName
                }, self);
            });
        };
        self.back = function () {
            history.go(-1);
        };
    };
});