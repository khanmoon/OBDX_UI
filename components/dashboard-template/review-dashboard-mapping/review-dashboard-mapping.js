define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/review-dashboard-mapping", "./model"
], function (oj, ko, $, nls, model) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = nls;
        params.dashboard.headerName(self.nls.pageHeader);
        self.payload = {};
        self.showRole = false;
        ko.utils.extend(self.payload, self.params.data);
        if (self.payload.mappedValue.indexOf("*") >= 0) {
            self.showRole = true;
            var temp = self.payload.mappedValue;
            self.payload.mappedValue = {
                "value": temp.substring(0, temp.indexOf("*"))
            };
            self.payload.mappedValue.label = temp.substring(temp.indexOf("*") + 1);
        }
        self.payload.module = self.params.data.dashboardId.substring(self.params.data.dashboardId.indexOf(".") + 1, self.params.data.dashboardId.indexOf("="));
        self.payload.dashboardId = self.params.data.dashboardId.substring(0, self.params.data.dashboardId.indexOf("_"));
        self.templateName = self.params.data.dashboardId.substring(0, self.params.data.dashboardId.indexOf(".")).replace("_", " ");
        params.baseModel.registerElement("page-section");
        params.baseModel.registerElement("row");

        params.baseModel.registerElement("confirm-screen");
        self.saveMapping = function () {
            if (self.showRole) {
                self.payload.mappedValue = self.payload.mappedValue.value;
            }
            model.createMapping(JSON.stringify(self.payload)).then(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transaction: self.nls.header
                }, self);
            });
        };
        self.reviewTransactionName = {};
        self.reviewTransactionName.header = self.nls.generic.common.review;
        self.reviewTransactionName.reviewHeader = self.nls.reviewMapping;
    };
});