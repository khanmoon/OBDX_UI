define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/limit-search",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, LimitSearchModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.flag = ko.observable(false);
        self.payLoadArray = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("create-limit", "financial-limits");
        rootParams.baseModel.registerComponent("limit-view", "financial-limits");
        self.selectedTransactionType = self.selectedTransactionType || ko.observable();
        self.limitName = self.limitName || ko.observable();
        rootParams.dashboard.headerName(self.nls.common.limitheader);
        self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        self.limitId = ko.observable();
        self.limitDescription = self.limitDescription || ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.showSearchData = self.pagingDatasource ? ko.observable(true) : ko.observable(false);
        if (ko.utils.unwrapObservable(self.pagingDatasource) === undefined) {
            self.showSearchData = ko.observable(false);
        }
        self.pagingDatasource = self.pagingDatasource || ko.observable();
        self.createEnable = ko.observable(false);
        self.limitParams = {
            limitType: "",
            limitName: "",
            limitDescription: "",
            fromDate:"",
            toDate:""
        };
        function prepareDatasource(data) {
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data, { idAttribute: "id" })));
        }
        self.search = function () {
            self.limitParams.limitType = self.selectedTransactionType();
            self.limitParams.limitDescription = self.limitDescription();
            self.limitParams.limitName = self.limitName();
            self.limitParams.fromDate = self.fromDate();
            self.limitParams.toDate = self.toDate();
            LimitSearchModel.searchLimit(self.limitParams).done(function (data) {
                var limitType = "";
                var tempData = $.map(data.limitDTOs, function (v) {
                    if (v.limitType === "PER") {
                        limitType = self.nls.limitType.cummulative;
                    } else if (v.limitType === "DUR") {
                        limitType = self.nls.limitType.coolingPeriod;
                    } else if (v.limitType === "TXN") {
                        limitType = self.nls.limitType.transaction;
                    }
                    var newObj = {};
                    newObj.id = v.limitId;
                    newObj.name = v.limitName;
                    newObj.desc = v.limitDescription;
                    newObj.limitTypeId = v.limitType;
                    newObj.type = limitType;
                    newObj.lastUpdatedOn = rootParams.baseModel.formatDate(v.lastUpdatedDate);
                    return newObj;
                });
                prepareDatasource(tempData);
                self.showSearchData(true);
            });
        };
        self.openLimitDetails = function (data) {
            rootParams.dashboard.loadComponent("limit-view", { data: data }, self);
        };
        self.createLimit = function () {
            self.showSearchData = ko.observable(false);
            rootParams.dashboard.loadComponent("create-limit", {}, self);
        };
        self.clearValues = function () {
            self.limitName("");
            self.limitDescription("");
            self.showSearchData(false);
            self.pagingDatasource();
            self.selectedTransactionType("");
            self.fromDate("");
            self.toDate("");
        };
    };
});
