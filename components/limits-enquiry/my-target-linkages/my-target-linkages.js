define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/user-limit",
  "ojs/ojgauge",
  "ojs/ojinputtext"
], function (oj, ko, $, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.targetData = rootParams.myLimitTransactionModel;
    self.index = rootParams.index;
    rootParams.baseModel.registerElement("amount-input");
    self.validationTracker = ko.observable();
    self.effectiveTomorrowMsg = ko.observable();
    self.resetLimitsFlag = ko.observable(false);
    var dateTommorow = rootParams.baseModel.getDate();
    dateTommorow.setDate(dateTommorow.getDate() + 1);
    self.tomorrowDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(dateTommorow));
    self.getNewKoModel = function () {
      var KoModel = {
        label: "",
        total: ko.observable(),
        amountCurrency: "",
        utilised: "",
        utilisedCurrency: "",
        remaining: ko.observable(),
        totalInput: ko.observable(),
        inputLimit: ko.observable(),
        countOrAmount: "",
        effectiveTomorrowFlag: "",
        bankAllocatedCount: "",
        bankAllocatedAmount: "",
        bankAllocatedCurrency: "",
        effectiveTomorrowCount: "",
        effectiveTomorrowAmount: "",
        initial: "",
        thresholdMap: ""
      };
      return KoModel;
    };
    self.isDaily = false;
    self.isMonthly = false;
    if (self.targetData.periodicLimitDaily && self.targetData.periodicLimitDaily !== "" && self.targetData.periodicLimitDaily !== null) {
      self.isDaily = true;
      self.getNewDailyCountModel = ko.observable(self.getNewKoModel());
      self.getNewDailyAmountModel = ko.observable(self.getNewKoModel());
      self.getNewDailyCountModel().label = rootParams.baseModel.format(self.nls.limitsInquiry.messages.periodicLabel, {
        periodicity: self.targetData.periodicLimitDaily.periodicity.charAt(0).toUpperCase() + self.targetData.periodicLimitDaily.periodicity.substr(1).toLowerCase(),
        label: self.nls.limitsInquiry.messages.count
      });
      self.getNewDailyCountModel().initial = self.targetData.periodicLimitDaily.maxCount;
      self.getNewDailyCountModel().total(self.targetData.periodicLimitDaily.maxCount);
      self.getNewDailyCountModel().utilised = self.targetData.periodicLimitDaily.utilizedDailyCount;
      self.getNewDailyCountModel().remaining(self.targetData.periodicLimitDaily.maxCount - self.targetData.periodicLimitDaily.utilizedDailyCount);
      self.getNewDailyCountModel().countOrAmount = "COUNT";
      self.getNewDailyCountModel().thresholdMap = [{
        max: 100,
        color: "#2E7D32"
      }];
      if (self.targetData.periodicLimitDaily.bankAllocatedCount) { self.getNewDailyCountModel().bankAllocatedCount = self.targetData.periodicLimitDaily.bankAllocatedCount; }
      else { self.getNewDailyCountModel().bankAllocatedCount = self.targetData.periodicLimitDaily.maxCount; }
      if (self.targetData.periodicLimitDaily && self.targetData.periodicLimitDaily.effectiveTomorrowCount) {
        self.getNewDailyCountModel().effectiveTomorrowFlag = "Y";
        self.getNewDailyCountModel().effectiveTomorrowCount = self.targetData.periodicLimitDaily.effectiveTomorrowCount;
      }
      self.getNewDailyAmountModel().label = rootParams.baseModel.format(self.nls.limitsInquiry.messages.periodicLabel, {
        periodicity: self.targetData.periodicLimitDaily.periodicity.charAt(0).toUpperCase() + self.targetData.periodicLimitDaily.periodicity.substr(1).toLowerCase(),
        label: self.nls.limitsInquiry.messages.limits
      });
      self.getNewDailyAmountModel().initial = self.targetData.periodicLimitDaily.maxAmount;
      self.getNewDailyAmountModel().total(self.targetData.periodicLimitDaily.maxAmount);
      self.getNewDailyAmountModel().utilised = self.targetData.periodicLimitDaily.utilizedDailyAmount;
      self.getNewDailyAmountModel().remaining(self.targetData.periodicLimitDaily.maxAmount - self.targetData.periodicLimitDaily.utilizedDailyAmount);
      self.getNewDailyAmountModel().amountCurrency = self.targetData.periodicLimitDaily.maxCurrency;
      self.getNewDailyAmountModel().utilisedCurrency = self.targetData.periodicLimitDaily.utilizedDailyCurrency;
      self.getNewDailyAmountModel().countOrAmount = "AMOUNT";
      self.getNewDailyAmountModel().thresholdMap = [{
        max: 100,
        color: "#0070BF"
      }];
      if (self.targetData.periodicLimitDaily.bankAllocatedAmount) { self.getNewDailyAmountModel().bankAllocatedAmount = self.targetData.periodicLimitDaily.bankAllocatedAmount; }
      else { self.getNewDailyAmountModel().bankAllocatedAmount = self.targetData.periodicLimitDaily.maxAmount; }
      if (self.targetData.periodicLimitDaily.bankAllocatedCurrency) { self.getNewDailyAmountModel().bankAllocatedCurrency = self.targetData.periodicLimitDaily.bankAllocatedCurrency; }
      else { self.getNewDailyAmountModel().bankAllocatedCurrency = self.targetData.periodicLimitDaily.maxCurrency; }
      if (self.targetData.periodicLimitDaily && self.targetData.periodicLimitDaily.effectiveTomorrowAmount) {
        self.getNewDailyAmountModel().effectiveTomorrowFlag = "Y";
        self.getNewDailyAmountModel().effectiveTomorrowAmount = self.targetData.periodicLimitDaily.effectiveTomorrowAmount;
      }

    }
    if (self.targetData.periodicLimitMonthly && self.targetData.periodicLimitMonthly !== "" && self.targetData.periodicLimitMonthly !== null) {
      self.isMonthly = true;
      self.getNewMonthlyCountModel = ko.observable(self.getNewKoModel());
      self.getNewMonthlyAmountModel = ko.observable(self.getNewKoModel());
      self.getNewMonthlyCountModel().label = rootParams.baseModel.format(self.nls.limitsInquiry.messages.periodicLabel, {
        periodicity: self.targetData.periodicLimitMonthly.periodicity.charAt(0).toUpperCase() + self.targetData.periodicLimitMonthly.periodicity.substr(1).toLowerCase(),
        label: self.nls.limitsInquiry.messages.count
      });
      self.getNewMonthlyCountModel().initial = self.targetData.periodicLimitMonthly.maxCount;
      self.getNewMonthlyCountModel().total(self.targetData.periodicLimitMonthly.maxCount);
      self.getNewMonthlyCountModel().utilised = self.targetData.periodicLimitMonthly.utilizedMonthlyCount;
      self.getNewMonthlyCountModel().remaining(self.targetData.periodicLimitMonthly.maxCount - self.targetData.periodicLimitMonthly.utilizedMonthlyCount);
      self.getNewMonthlyCountModel().countOrAmount = "COUNT";
      self.getNewMonthlyCountModel().thresholdMap = [{
        max: 100,
        color: "#2E7D32"
      }];
      if (self.targetData.periodicLimitMonthly.bankAllocatedCount) { self.getNewMonthlyCountModel().bankAllocatedCount = self.targetData.periodicLimitMonthly.bankAllocatedCount; }
      else { self.getNewMonthlyCountModel().bankAllocatedCount = self.targetData.periodicLimitMonthly.maxCount; }
      if (self.targetData.periodicLimitMonthly && self.targetData.periodicLimitMonthly.effectiveTomorrowCount) {
        self.getNewMonthlyCountModel().effectiveTomorrowFlag = "Y";
        self.getNewMonthlyCountModel().effectiveTomorrowCount = self.targetData.periodicLimitMonthly.effectiveTomorrowCount;
      }
      self.getNewMonthlyAmountModel().label = rootParams.baseModel.format(self.nls.limitsInquiry.messages.periodicLabel, {
        periodicity: self.targetData.periodicLimitMonthly.periodicity.charAt(0).toUpperCase() + self.targetData.periodicLimitMonthly.periodicity.substr(1).toLowerCase(),
        label: self.nls.limitsInquiry.messages.limits
      });
      self.getNewMonthlyAmountModel().initial = self.targetData.periodicLimitMonthly.maxAmount;
      self.getNewMonthlyAmountModel().total(self.targetData.periodicLimitMonthly.maxAmount);
      self.getNewMonthlyAmountModel().utilised = self.targetData.periodicLimitMonthly.utilizedMonthlyAmount;
      self.getNewMonthlyAmountModel().remaining(self.targetData.periodicLimitMonthly.maxAmount - self.targetData.periodicLimitMonthly.utilizedMonthlyAmount);
      self.getNewMonthlyAmountModel().amountCurrency = self.targetData.periodicLimitMonthly.maxCurrency;
      self.getNewMonthlyAmountModel().utilisedCurrency = self.targetData.periodicLimitMonthly.utilizedMonthlyCurrency;
      self.getNewMonthlyAmountModel().countOrAmount = "AMOUNT";
      self.getNewMonthlyAmountModel().thresholdMap = [{
        max: 100,
        color: "#0070BF"
      }];
      if (self.targetData.periodicLimitMonthly.bankAllocatedAmount) { self.getNewMonthlyAmountModel().bankAllocatedAmount = self.targetData.periodicLimitMonthly.bankAllocatedAmount; }
      else { self.getNewMonthlyAmountModel().bankAllocatedAmount = self.targetData.periodicLimitMonthly.maxAmount; }
      if (self.targetData.periodicLimitMonthly.bankAllocatedCurrency) { self.getNewMonthlyAmountModel().bankAllocatedCurrency = self.targetData.periodicLimitMonthly.bankAllocatedCurrency; }
      else { self.getNewMonthlyAmountModel().bankAllocatedCurrency = self.targetData.periodicLimitMonthly.maxCurrency; }

      if (self.targetData.periodicLimitMonthly && self.targetData.periodicLimitMonthly.effectiveTomorrowAmount) {
        self.getNewMonthlyAmountModel().effectiveTomorrowFlag = "Y";
        self.getNewMonthlyAmountModel().effectiveTomorrowAmount = self.targetData.periodicLimitMonthly.effectiveTomorrowAmount;
      }

    }
    self.getTaskName = function (key) {
      var FOUND = 0,
        name;
      ko.utils.arrayForEach(self.taskCodeList(), function (item) {
        if (item.id === key) {
          name = item.name;
          FOUND = 1;
        }
      });
      if (FOUND > 0) {
        return name;
      }
    };
    self.edit = function () {
      self.targetData.isDataSaved = false;
    };
    self.cancel = function () {
      if (self.isDaily) {
        self.getNewDailyCountModel().totalInput("");
        self.getNewDailyAmountModel().totalInput("");
      }
      if (self.isMonthly) {
        self.getNewMonthlyCountModel().totalInput("");
        self.getNewMonthlyAmountModel().totalInput("");
      }
      self.showEditLimit(false);
      self.targetData.isDataSaved = true;
      self.closeEdit();
    };
    self.checkInputDaily = function() {
      if(self.getNewDailyCountModel().inputLimit()!==self.getNewDailyCountModel().bankAllocatedCount && self.getNewDailyCountModel().inputLimit()!==null){
        self.getNewDailyCountModel().totalInput(self.getNewDailyCountModel().inputLimit());
      }
      if(self.getNewDailyAmountModel().inputLimit()!==self.getNewDailyAmountModel().bankAllocatedAmount && self.getNewDailyAmountModel().inputLimit()!==null){
        self.getNewDailyAmountModel().totalInput(self.getNewDailyAmountModel().inputLimit());
      }
    };
    self.checkInputMonthly = function() {
      if(self.getNewMonthlyCountModel().inputLimit()!==self.getNewMonthlyCountModel().bankAllocatedCount && self.getNewMonthlyCountModel().inputLimit()!==null){
        self.getNewMonthlyCountModel().totalInput(self.getNewMonthlyCountModel().inputLimit());
        if(self.getNewMonthlyAmountModel().inputLimit()!==self.getNewMonthlyAmountModel().bankAllocatedAmount && self.getNewMonthlyAmountModel().inputLimit()!==null){
          self.getNewMonthlyAmountModel().totalInput(self.getNewMonthlyAmountModel().inputLimit());
        }
      }
    };
    self.save = function () {

      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.isDaily) {
        if (self.getNewDailyCountModel().totalInput() > self.getNewDailyCountModel().bankAllocatedCount) {
          rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.validFormatCount], "ERROR");
          return;
        }
        if (self.getNewDailyAmountModel().totalInput() > self.getNewDailyAmountModel().bankAllocatedAmount) {
          rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.validFormatAmount], "ERROR");
          return;
        }
        self.checkInputDaily();
        if (self.getNewDailyCountModel().totalInput()) {
          self.getNewDailyCountModel().total(self.getNewDailyCountModel().totalInput());
          self.getNewDailyCountModel().remaining(self.getNewDailyCountModel().total() - self.getNewDailyCountModel().utilised);
        }
        if (self.getNewDailyAmountModel().totalInput()) {
          self.getNewDailyAmountModel().total(self.getNewDailyAmountModel().totalInput());
          self.getNewDailyAmountModel().remaining(self.getNewDailyAmountModel().total() - self.getNewDailyAmountModel().utilised);
        }
        if (self.getNewDailyCountModel().totalInput() || self.getNewDailyAmountModel().totalInput() || self.getNewDailyAmountModel().effectiveTomorrowAmount || self.getNewDailyCountModel().effectiveTomorrowCount) { self.targetData.isDailyModified = true; }
        else { self.targetData.isDailyModified = false; }


        if (self.effectiveSameDayFlag() === "Y") {
          self.targetData.periodicLimitDaily.maxCount = self.getNewDailyCountModel().total();
          self.targetData.periodicLimitDaily.maxAmount = self.getNewDailyAmountModel().total();
        }
        if (self.effectiveSameDayFlag() === "N") {
          self.targetData.periodicLimitDaily.effectiveTomorrowCount = self.getNewDailyCountModel().totalInput() ? self.getNewDailyCountModel().total() : self.getNewDailyCountModel().effectiveTomorrowCount;
          self.targetData.periodicLimitDaily.effectiveTomorrowAmount = self.getNewDailyAmountModel().totalInput() ? self.getNewDailyAmountModel().total() : self.getNewDailyAmountModel().effectiveTomorrowAmount;
        }
      }
      if (self.isMonthly) {
        if (self.getNewMonthlyCountModel().totalInput() > self.getNewMonthlyCountModel().bankAllocatedCount) {
          rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.validFormatCountMonthly], "ERROR");
          return;
        }
        if (self.getNewMonthlyAmountModel().totalInput() > self.getNewMonthlyAmountModel().bankAllocatedAmount) {
          rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.validFormatAmountMonthly], "ERROR");
          return;
        }
        self.checkInputMonthly();
        if (self.getNewMonthlyCountModel().totalInput()) {
          self.getNewMonthlyCountModel().total(self.getNewMonthlyCountModel().totalInput());
          self.getNewMonthlyCountModel().remaining(self.getNewMonthlyCountModel().total() - self.getNewMonthlyCountModel().utilised);
        }
        if (self.getNewMonthlyAmountModel().totalInput()) {
          self.getNewMonthlyAmountModel().total(self.getNewMonthlyAmountModel().totalInput());
          self.getNewMonthlyAmountModel().remaining(self.getNewMonthlyAmountModel().total() - self.getNewMonthlyAmountModel().utilised);
        }
        if (self.getNewMonthlyCountModel().totalInput() || self.getNewMonthlyAmountModel().totalInput() || self.getNewMonthlyAmountModel().effectiveTomorrowAmount || self.getNewMonthlyCountModel().effectiveTomorrowCount) { self.targetData.isMonthlyModified = true; }
        else { self.targetData.isMonthlyModified = false; }

        if (self.effectiveSameDayFlag() === "Y") {
          self.targetData.periodicLimitMonthly.maxCount = self.getNewMonthlyCountModel().total();
          self.targetData.periodicLimitMonthly.maxAmount = self.getNewMonthlyAmountModel().total();
        }

        if (self.effectiveSameDayFlag() === "N") {
          self.targetData.periodicLimitMonthly.effectiveTomorrowCount = self.getNewMonthlyCountModel().totalInput() ? self.getNewMonthlyCountModel().total() : self.getNewMonthlyCountModel().effectiveTomorrowCount;
          self.targetData.periodicLimitMonthly.effectiveTomorrowAmount = self.getNewMonthlyAmountModel().totalInput() ? self.getNewMonthlyAmountModel().total() : self.getNewMonthlyAmountModel().effectiveTomorrowAmount;
        }
      }
      self.targetData.isDataSaved = true;
      if (self.targetData.isDailyModified || self.targetData.isMonthlyModified) {
        self.saveLimit(true);
        self.saveMyLimits();
        self.closeEdit();
      } else { rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.noChangesMade], "ERROR"); }
    };
    self.resetLimits = function () {
      self.resetLimitsFlag(false);
      ko.tasks.runEarly();

      if (self.isDaily) {
        self.getNewDailyCountModel().inputLimit(null);
        self.getNewDailyAmountModel().inputLimit(null);
        self.getNewDailyCountModel().totalInput(self.getNewDailyCountModel().bankAllocatedCount);
        self.getNewDailyAmountModel().totalInput(self.getNewDailyAmountModel().bankAllocatedAmount);
      }
      if (self.isMonthly) {
        self.getNewMonthlyCountModel().inputLimit(null);
        self.getNewMonthlyAmountModel().inputLimit(null);
        self.getNewMonthlyCountModel().totalInput(self.getNewMonthlyCountModel().bankAllocatedCount);
        self.getNewMonthlyAmountModel().totalInput(self.getNewMonthlyAmountModel().bankAllocatedAmount);
      }
      self.resetLimitsFlag(true);
    };
  };
});