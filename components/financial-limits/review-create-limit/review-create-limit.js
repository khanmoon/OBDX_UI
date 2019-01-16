define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-create-limit",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojgauge",
    "ojs/ojchart",
    "ojs/ojlistview"
], function (oj, ko, $, ReviewCreateLimitModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.flag = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        self.nls = resourceBundle;
        self.transactionLimitSection = ko.observable(false);
        self.cummulativeLimitSection = ko.observable(false);
        self.coolingPeriodLimitSection = ko.observable(false);
        self.loadData = ko.observable(false);
        self.showConfirm = ko.observable(false);
        self.isReview = ko.observable(rootParams.isReview);
        rootParams.dashboard.headerName(self.nls.common.limitheader);
        self.isApprovalReview = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.limitFlag = ko.observable();
        self.limitId = ko.observable();
        self.limitType = ko.observable();
        self.checkedOption = ko.observable();
        self.reviewCoolingDatasource = ko.observable();
        self.payload = ko.observable();
        if (self.transactionDetails) {
            self.isApprovalReview(true);
            self.isReview(true);
        }
        self.limitFlag(self.params.data.limitType());
        if (self.limitFlag() === "TXN") {
            self.transactionLimitSection(true);
            self.checkedOption(self.nls.limitType.transaction);
            self.limitType(self.nls.limitType.transaction);
        } else if (self.limitFlag() === "PER") {
            self.checkedOption(self.nls.limitType.cummulative);
            self.limitType(self.nls.limitType.cummulative);
            self.frequency = ko.observable(self.params.data.periodicity());
            self.cummulativeLimitSection(true);
        } else if (self.limitFlag() === "DUR") {
            if (self.params.data.durationLimitSlots() && self.params.data.durationLimitSlots().length > 0 && self.params.data.durationLimitSlots()[0].id) {
                self.reviewCoolingDatasource(new oj.ArrayTableDataSource(self.params.data.durationLimitSlots, { idAttribute: "id" }));
            } else {
                var coolingPeriodData = $.map(self.params.data.durationLimitSlots(), function (coolingDataLocal) {
                    coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();
                    return coolingDataLocal;
                });
                self.reviewCoolingDatasource(new oj.ArrayTableDataSource(coolingPeriodData, { idAttribute: "id" }));
            }
            self.checkedOption(self.nls.limitType.durational);
            self.limitType(self.nls.limitType.coolingPeriod);
            self.coolingPeriodLimitSection(true);
        }
        self.loadData(true);
        rootParams.baseModel.registerComponent("create-limit", "financial-limits");
        self.edit = function () {
            if (self.limitFlag() === "TXN") {
                self.checkedOption(self.nls.limitType.transaction);
            } else if (self.limitFlag() === "PER") {
                self.checkedOption(self.nls.limitType.cummulative);
            } else if (self.limitFlag() === "DUR") {
                self.checkedOption(self.nls.limitType.durational);
            }
            rootParams.dashboard.loadComponent("create-limit", {
                mode: "edit",
                data: self.params.data
            }, self);
        };
        self.confirm = function () {
            self.payload = {};
            if (self.limitFlag() === "DUR") {
                self.payload.currency = self.params.data.currency();
                self.payload.limitDescription = self.params.data.limitDescription();
                self.payload.limitName = self.params.data.limitName();
                self.payload.limitType = self.params.data.limitType();
                var durationLimitSlots = [];
                for (var k = 0; k < self.params.data.durationLimitSlots().length; k++) {
                    durationLimitSlots.push({
                        amount: self.params.data.durationLimitSlots()[k].amount,
                        startDuration: self.params.data.durationLimitSlots()[k].startDuration,
                        endDuration: self.params.data.durationLimitSlots()[k].endDuration
                    });
                }
                self.payload.durationLimitSlots = durationLimitSlots;
            } else {
                self.payload = self.params.data;
            }
            ReviewCreateLimitModel.createLimit(ko.mapping.toJSON(self.payload)).done(function (data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);
                if (data.limitDTO && data.limitDTO.limitId) {
                    self.limitId(data.limitDTO.limitId);
                }
                var transactionName = null;
                if (self.limitFlag() === "TXN") {
                    transactionName = self.nls.transactionName.transaction;
                } else if (self.limitFlag() === "PER") {
                    transactionName = self.nls.transactionName.cummulative;
                } else if (self.limitFlag() === "DUR") {
                    transactionName = self.nls.transactionName.duration;
                }
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: transactionName
                }, self);
            });
        };
        self.cancel = function () {
          rootParams.dashboard.openDashBoard(self.nls.common.confirmationMessage);
        };
    };
});
