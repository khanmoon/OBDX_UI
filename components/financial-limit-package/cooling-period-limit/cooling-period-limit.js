define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/cooling-limit",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, componentModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showCoolingLimitSearchSection = ko.observable(rootParams.visibility() ? rootParams.visibility() : rootParams.limitEditable);
        self.editable = rootParams.limitEditable;
        self.showCoolingLimitSearchResult = ko.observable(false);
        self.coolingLimitSelected = ko.observable(false);
        self.coolingLimitsData = ko.observableArray(rootParams.limitsData().coolingLimits());
        self.selectedCoolingRecord = ko.observable();
        var limitsDataDispose = rootParams.limitsData().coolingLimits.subscribe(function (newValue) {
            ko.tasks.runEarly();
            self.coolingLimitsData(newValue);
            if (self.coolingLimitsData())
                self.coolingLimitsData().sort(function (left, right) {
                    return left.limitName.toLowerCase() === right.limitName.toLowerCase() ? 0 : left.limitName.toLowerCase() < right.limitName.toLowerCase() ? -1 : 1;
                });
            self.showCoolingLimitSearchSection(true);
            rootParams.visibility(true);
        });
        self.checkEdit = function () {
            if (self.limitId()) {
                self.selectedCoolingRecord(self.limitId());
            }
        };
        var selectedCoolingRecordDispose = self.selectedCoolingRecord.subscribe(function (newValue) {
            if (!newValue) {
                self.limitId(null);
                self.limitName(null);
                self.limitDescription(null);
                self.durationLimitSlots(null);
                self.coolingLimitSelected(false);
                self.currency(null);
                return;
            }
                var test = ko.utils.arrayFirst(self.coolingLimitsData(), function (item) {
                    return parseInt(item.limitId) === parseInt(newValue);
                });
                if (test) {
                    self.limitId(test.limitId);
                    self.limitName(test.limitName);
                    self.limitDescription(test.limitDescription);
                    self.durationLimitSlots(test.durationLimitSlots);
                    self.currency(test.currency);
                    self.coolingLimitSelected(false);
                } else {
                    self.selectedCoolingRecord(null);
                }

            self.showCoolingLimitSearchSection(true);
        });
        self.linkageArrayId = ko.observable();
        self.showCoolingDetails = function () {
            componentModel.fetchCoolingLimits().done(function () {
                self.showCoolingLimitSearchResult(true);
            });
        };
        self.deleteCurrentSelection = function () {
            self.showCoolingLimitSearchSection(false);
            self.selectedCoolingRecord(null);
            self.limitId(null);
            self.limitName(null);
            self.limitDescription(null);
            self.durationLimitSlots(null);
            self.coolingLimitSelected(false);
            self.currency(null);
        };
        self.dispose = function () {
            limitsDataDispose.dispose();
            selectedCoolingRecordDispose.dispose();
        };
    };
});
