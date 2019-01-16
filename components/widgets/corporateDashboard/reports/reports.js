define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/reports",
    "framework/js/constants/constants",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ReportsModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.reportDetails = ko.observableArray();
        self.datasource = ko.observable();
        self.dataSourceLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("report-list", "reports");
        var user = {
            "CORP": "U",
            "ADMIN": "A",
            "CORPADMIN": "C",
            "RETAIL": "U"
        };
        var userType = user[Constants.userSegment];
        if (rootParams.staticData) {
            self.dataSourceLoaded(false);
        } else {
            ReportsModel.listReportHistory(userType).then(function (data) {
                self.reportDetails.removeAll();
                self.dataSourceLoaded(false);
                ko.tasks.runEarly();
                if (data.listResponseDTO && data.listResponseDTO.length > 0) {
                    for (var i = 0; i < data.listResponseDTO.length; i++) {
                        var reportData = data.listResponseDTO[i];
                        reportData.description = self.nls.reportsDetails.reportDescription[reportData.description];
                        if (reportData.executionDate) {
                            reportData.executionDate = rootParams.baseModel.formatDate(reportData.executionDate, "dateTimeStampFormat");
                        } else {
                            reportData.executionDate = "-";
                        }
                        self.reportDetails.push(reportData);
                    }
                    self.dataSource = new oj.ArrayTableDataSource(self.reportDetails(), {
                        idAttribute: "reportRequestId"
                    });
                    self.dataSourceLoaded(true);
                    ko.tasks.runEarly();
                } else {
                    self.dataSourceLoaded(false);
                }
            });
        }
        self.downloadReport = function (data) {
            ReportsModel.downloadReport(data.reportRequestId);
        };
    };
});
