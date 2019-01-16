define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",

  "ojL10n!resources/nls/cumulative-limit",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist"
], function(oj, ko, $, BaseLogger, componentModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.validationObject = rootParams.validationObject;
    self.nls = resourceBundle;
    self.editable = rootParams.limitEditable;
    self.showCummulativeSearchSection = ko.observable(rootParams.visibility() ? rootParams.visibility() : rootParams.limitEditable);
    if (self.periodicity() === "MONTHLY")
      self.cummulativeLimitsData = ko.observableArray(rootParams.limitsData().cummulativeLimitsMonthly());
    else
      self.cummulativeLimitsData = ko.observableArray(rootParams.limitsData().cummulativeLimitsDaily());
    self.cummulativeLimitSelected = ko.observable(false);
    self.selectedCumulativeRecord = ko.observable();
    var cummulativeLimitsDailyDispose = rootParams.limitsData().cummulativeLimitsDaily.subscribe(function(newValue) {
      ko.tasks.runEarly();
      self.cummulativeLimitsData(newValue);
      if (self.cummulativeLimitsData())
        self.cummulativeLimitsData().sort(function(left, right) {
          return left.limitName.toLowerCase() === right.limitName.toLowerCase() ? 0 : left.limitName.toLowerCase() < right.limitName.toLowerCase() ? -1 : 1;
        });
      self.showCummulativeSearchSection(true);
      rootParams.visibility(true);
    });
    var cummulativeLimitsMonthlyDispose = rootParams.limitsData().cummulativeLimitsMonthly.subscribe(function(newValue) {
      ko.tasks.runEarly();
      self.cummulativeLimitsData(newValue);
      if (self.cummulativeLimitsData())
        self.cummulativeLimitsData().sort(function(left, right) {
          return left.limitName.toLowerCase() === right.limitName.toLowerCase() ? 0 : left.limitName.toLowerCase() < right.limitName.toLowerCase() ? -1 : 1;
        });
      self.showCummulativeSearchSection(true);
      rootParams.visibility(true);
    });
    self.checkEdit = function() {
      if (self.limitId()) {
        self.selectedCumulativeRecord(self.limitId());
      }
    };
    var selectedCumulativeRecordDispose = self.selectedCumulativeRecord.subscribe(function(newValue) {
      if (!newValue) {
        self.limitId(null);
        self.limitName(null);
        self.limitDescription(null);
        self.maxAmount = null;
        self.maxCount(null);
        self.currency(null);
        self.cummulativeLimitSelected(false);

      } else {
        var test = ko.utils.arrayFirst(self.cummulativeLimitsData(), function(item) {
          return parseInt(item.limitId) === parseInt(newValue);
        });
        if (test) {
          self.limitId(test.limitId);
          self.limitName(test.limitName);
          self.limitDescription(test.limitDescription);
          self.maxAmount = test.maxAmount;
          self.maxCount(test.maxCount);
          self.currency(test.currency);
          self.cummulativeLimitSelected(false);
        } else {
          self.selectedCumulativeRecord(null);
        }
      }
    });
    self.deleteCurrentSelection = function() {
      self.selectedCumulativeRecord(null);
      self.limitId(null);
      self.limitName(null);
      self.limitDescription(null);
      self.maxAmount = null;
      self.maxCount(null);
      self.currency(null);
      self.cummulativeLimitSelected(false);
    };
    self.dispose = function() {
      cummulativeLimitsDailyDispose.dispose();
      cummulativeLimitsMonthlyDispose.dispose();
      selectedCumulativeRecordDispose.dispose();
    };
  };
});
