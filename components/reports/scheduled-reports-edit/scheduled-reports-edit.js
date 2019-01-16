define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/scheduled-reports-edit",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojcollectiontabledatasource"
], function (oj, ko, $, scheduledReportsEditModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.reportList;
        rootParams.dashboard.headerName(self.Nls.scheduledReports);
        rootParams.baseModel.registerComponent("row", "base-components");
        rootParams.baseModel.registerComponent("page-section", "base-components");
        rootParams.baseModel.registerComponent("action-header", "base-components");
        rootParams.baseModel.registerComponent("action-widget", "base-components");
        rootParams.baseModel.registerComponent("date-time", "base-components");
        rootParams.baseModel.registerComponent("scheduled-report-details", "reports");
        rootParams.baseModel.registerComponent("review-scheduled-edit", "reports");

        self.reportFormatList = ko.observableArray();
        self.scheduledFrequencyList = ko.observableArray();
        self.scheduledfrequencyListMap = {};
        self.isScheduledFrequencyListLoaded = ko.observable(false);
        self.isReportFormatListLoaded = ko.observable(false);
        self.dateCompare = ko.observable(false);
        self.reportName = ko.observable();
        self.scheduledBy = ko.observable();
        var getNewKoModel = function () {
            var KoModel = ko.mapping.fromJS(scheduledReportsEditModel.getNewModel());
            return KoModel;
        };
        self.scheduledEdit = getNewKoModel().payload;
        var user = {
            "CORP": "U",
            "ADMIN": "A",
            "CORPADMIN": "C",
            "RETAIL": "U"
        };
        self.scheduledEdit.reportType(user[Constants.userSegment]);
        self.reportName(self.params.data.reportName);
        self.scheduledEdit.reportRequestIdentifier(self.params.data.reportRequestIdentifier);
        self.scheduledEdit.formatType(self.params.formatType());
        self.scheduledEdit.reportSchFreq(self.params.data.reportSchFreq);
        self.scheduledBy(self.params.scheduledBy());
        if (new Date(self.params.data.startTimeISO) <= rootParams.baseModel.getDate("DATE_TIME")) {
            self.dateCompare(true);
            self.scheduledEdit.startTime(oj.IntlConverterUtils.dateToLocalIso(new Date(self.params.data.startTimeISO)));
        } else {
            self.scheduledEdit.startTime(oj.IntlConverterUtils.dateToLocalIso(new Date(self.params.data.startTimeISO)));
        }
        if (self.scheduledEdit.reportSchFreq() + "" !== "ONCE") {
            self.scheduledEdit.endTime(oj.IntlConverterUtils.dateToLocalIso(new Date(self.params.data.endTimeISO)));
        }
        var reportData = self.params.reportMapId[self.params.data.reportId];
        for (var i = 0; i < reportData.formats.length; i++) {
            self.reportFormatList().push({
                code: reportData.formats[i],
                description: self.params.formatMap[reportData.formats[i]]
            });
        }
        self.isReportFormatListLoaded(true);
        scheduledReportsEditModel.getScheduledReportFrequencyTypes().then(function (data) {
            self.scheduledFrequencyList(data.enumRepresentations[0].data);
            for (var i = 0; i < self.scheduledFrequencyList().length; i++) {
                self.scheduledfrequencyListMap[self.scheduledFrequencyList()[i].code] = self.scheduledFrequencyList()[i].description;
            }
            self.isScheduledFrequencyListLoaded(true);
        });
        self.back = function () {
            history.go(-1);
        };
        self.save = function () {
            rootParams.dashboard.loadComponent("review-scheduled-edit", {
                scheduledEdit: self.scheduledEdit,
                reportName: self.reportName,
                scheduledBy: self.scheduledBy
            });
        };
    };
});
