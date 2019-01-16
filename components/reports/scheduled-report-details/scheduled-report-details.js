define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/scheduled-report-details",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojcollectiontabledatasource",
    "ojs/ojbutton"
], function (oj, ko, $, scheduledReportsDetailModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.reportList;
        rootParams.dashboard.headerName(self.Nls.scheduledReports);
        self.scheduledBy = ko.observable();
        self.reportFormat = ko.observable();
        self.reportRequestIdentifier = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerComponent("scheduled-reports", "reports");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("scheduled-reports-edit", "reports");
        scheduledReportsDetailModel.getSelectedReportIdDetails(self.params.reportData.reportRequestIdentifier).then(function (data) {
            self.scheduledBy(data.requestedBy);
            self.reportFormat(data.formatType);
        });
        self.confirmDelete = function (data) {
            self.reportRequestIdentifier(data.params.reportData.reportRequestIdentifier);
            $("#deleteReport").trigger("openModal");
        };
        var userType = Constants.userSegment;
        self.deleteReport = function () {
            $("#deleteReport").hide();
            scheduledReportsDetailModel.deleteReport(self.params.reportData.reportRequestIdentifier, userType).then(function (data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.Nls.transactionName,
                    template: "report/delete-scheduled-report-confirm-screen"
                }, self);
            });
        };
        self.backScreen = function () {
            history.go(-1);
        };
        self.cancelReport = function () {
            history.go(-1);
        };
    };
});