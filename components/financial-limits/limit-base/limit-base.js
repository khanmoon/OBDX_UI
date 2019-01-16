define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/limit-base",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojgauge",
    "ojs/ojchart",
    "ojs/ojlistview"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.flag = ko.observable(false);
        self.payLoadArray = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("limit-search", "financial-limits");
        rootParams.baseModel.registerComponent("create-limit", "financial-limits");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        self.localCurrency = ko.observable();
        self.checkedOption = ko.observable();
        rootParams.dashboard.headerName(self.nls.common.limitheader);
    };
});