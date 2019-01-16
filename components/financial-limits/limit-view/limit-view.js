define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/limit-view",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function (oj, ko, $, LimitDetailModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        self.id = ko.observable(rootParams.rootModel.params.data.id);
        self.limitType = ko.observable(rootParams.rootModel.params.data.limitTypeId);
        self.transactionLimitSection = ko.observable(false);
        self.cummulativeLimitSection = ko.observable(false);
        self.coolingPeriodLimitSection = ko.observable(false);
        self.showConfirm = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.transId = ko.observable();
        self.showLimitType = ko.observable();
        self.viewCoolingDatasource = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.nls.common.limitheader);
        self.dataLoaded = ko.observable(false);
        rootParams.baseModel.registerElement("modal-window");
        if (self.limitType() === "TXN") {
            self.transactionLimitSection(true);
        } else if (self.limitType() === "PER") {
            self.cummulativeLimitSection(true);
        } else if (self.limitType() === "DUR") {
            self.coolingPeriodLimitSection(true);
        }
        LimitDetailModel.fetchLimitDetails(self.id()).done(function (data) {
            self.limitDetails = data.limitDTO;
            if (self.limitDetails.limitType === "TXN") {
                self.showLimitType(self.nls.limitType.transaction);
            } else if (self.limitDetails.limitType === "PER") {
                self.showLimitType(self.nls.limitType.cummulative);
            } else if (self.limitDetails.limitType === "DUR") {
                var coolingPeriodData = $.map(self.limitDetails.durationLimitSlots, function (coolingDataLocal) {
                    coolingDataLocal.id = coolingDataLocal.startDuration.days + coolingDataLocal.startDuration.hours + coolingDataLocal.startDuration.minutes;
                    return coolingDataLocal;
                });
                self.viewCoolingDatasource(new oj.ArrayTableDataSource(coolingPeriodData, { idAttribute: "id" }));
                self.showLimitType(self.nls.limitType.coolingPeriod);
            }
            self.dataLoaded(true);
        });
        self.back = function () {
            rootParams.dashboard.hideDetails();
        };
        self.deleteLimit = function () {
            LimitDetailModel.deleteLimit(self.id()).done(function (data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(status);
                $("#deleteDialog").hide();
                rootParams.dashboard.loadComponent("confirm-screen", { jqXHR: jqXhr }, self);
            }).fail(function () {
                self.closeDeleteDialog();
                self.back();
            });
        };
        self.deleteModal = function () {
            $("#deleteDialog").trigger("openModal");
        };
        self.closeDeleteDialog = function () {
            $("#deleteDialog").hide();
        };
        self.cancel = function () {
          rootParams.dashboard.openDashBoard("nls.message.confirmationMessage");
        };
        self.cancelView = function () {
            $("#cancelViewDialog").trigger("openModal");
        };
        self.hidecancel = function () {
            $("#cancelViewDialog").hide();
        };
    };
});
