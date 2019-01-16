define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/report-generation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup"
], function (ko, $, ReviewReportGenerationModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        self.Nls = resourceBundle.reportGeneration;
        self.reportDescription = resourceBundle.reportDescription;
        self.frequencyList = ko.observableArray();
        self.frequencyListMap = {};
        self.isReportFrequencyListLoaded = ko.observable(false);
        self.isReportNameLoaded = ko.observable(false);
        self.paramsComponent = ko.observable();
        self.reportsJSON = {};
        self.isReportDataLoaded = ko.observable(false);
        self.isReportsJSONLoaded = ko.observable(false);
        self.selectedReport = ko.observable();
        self.getReportName = function (reportIdentifier) {
            self.selectedReport().reportName = ko.observable(self.reportDescription[reportIdentifier]);
            self.isReportNameLoaded(true);
            ReviewReportGenerationModel.fetchParamsComponent().done(function (data) {
                self.reportsJSON = data;
                self.isReportsJSONLoaded(true);
                var reportIdentifierData = self.reportsJSON[reportIdentifier];
                if (!reportIdentifierData)
                    reportIdentifierData = self.reportsJSON.DEFAULT;
                self.paramsComponent("report/review-" + reportIdentifierData.component);
            });
        };
        if (!self.params.data.reportRequestIdentifier) {
            self.selectedReport(self.params.data);
            self.isReportDataLoaded(true);
            self.getReportName(self.selectedReport().reportIdentifier() + "");
        } else {
            var reportRequestId = self.params.data.reportRequestIdentifier();
            ReviewReportGenerationModel.getReportData(reportRequestId).done(function (data) {
                self.selectedReport(ko.mapping.fromJS(data));
                self.selectedReport().reportFreq = ko.observable("SCHEDULED");
                self.selectedReport().reportParams = ko.mapping.fromJS(JSON.parse(data.paramsMap));
                self.isReportDataLoaded(true);
                self.getReportName(self.selectedReport().reportIdentifier() + "");
            });
        }
        self.isPartyNameLoaded = ko.observable(false);
        self.back = function () {
            history.go(-1);
        };
        self.cancel = function () {
            self.startEditMode();
        };
        ReviewReportGenerationModel.getReportFrequencyTypes().done(function (data) {
            self.frequencyList(data.enumRepresentations[0].data.slice(0, 2));
            for (var i = 0; i < self.frequencyList().length; i++) {
                self.frequencyListMap[self.frequencyList()[i].code] = self.frequencyList()[i].description;
            }
            self.isReportFrequencyListLoaded(true);
        });
    };
});