  define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojs/ojchart",
    "ojL10n!resources/nls/user-limit",
    "ojs/ojknockout-validation"
  ], function(oj, ko, $, MyLimitModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
      var self = this;
      self.nls = resourceBundle;
      self.data = ko.observable(rootParams.data);
      self.accessPointValue = ko.observable(rootParams.accessPointValue);
      self.flagCorp = rootParams.flag ? ko.observable(rootParams.flag) : ko.observable(false);
      self.innerRadius = ko.observable(0.95);
      self.previousLabel = ko.observable();
      self.changeCenterLabel = function(number, index, data) {
        if (index === 0) {
          if (number === "1") {
            self.previousLabel(self.centerLabel1());
            self.centerLabel1({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.utilizedDailyAmount, data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "2") {
            self.previousLabel(self.centerLabel2());
            self.centerLabel2({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: self.data().periodicLimitDaily.utilizedDailyCount,
                total: self.data().periodicLimitDaily.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "3") {
            self.previousLabel(self.centerLabel3());
            self.centerLabel3({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.utilizedMonthlyAmount, data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "4") {
            self.previousLabel(self.centerLabel4());
            self.centerLabel4({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: self.data().periodicLimitMonthly.utilizedMonthlyCount,
                total: self.data().periodicLimitMonthly.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          }
        } else if (index === 1) {
          if (number === "1") {
            self.previousLabel(self.centerLabel1());
            self.centerLabel1({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: rootParams.baseModel.formatCurrency((self.data().periodicLimitDaily.maxAmount - self.data().periodicLimitDaily.utilizedDailyAmount).toString(), data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "2") {
            self.previousLabel(self.centerLabel2());
            self.centerLabel2({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: (self.data().periodicLimitDaily.maxCount - self.data().periodicLimitDaily.utilizedDailyCount).toString(),
                total: self.data().periodicLimitDaily.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "3") {
            self.previousLabel(self.centerLabel3());
            self.centerLabel3({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: rootParams.baseModel.formatCurrency((self.data().periodicLimitMonthly.maxAmount - self.data().periodicLimitMonthly.utilizedMonthlyAmount).toString(), data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "4") {
            self.previousLabel(self.centerLabel4());
            self.centerLabel4({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: (self.data().periodicLimitMonthly.maxCount - self.data().periodicLimitMonthly.utilizedMonthlyCount).toString(),
                total: self.data().periodicLimitMonthly.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          }
        }
        ko.tasks.runEarly();
      };
      self.changeCenterLabelOut = function(number) {
        if (number === "1") {
          self.centerLabel1(self.previousLabel());
        } else if (number === "2") {
          self.centerLabel2(self.previousLabel());
        } else if (number === "3") {
          self.centerLabel3(self.previousLabel());
        } else if (number === "4") {
          self.centerLabel4(self.previousLabel());
        }
        ko.tasks.runEarly();
      };
      self.labelStyleOnHover = ko.observable({
        color: "#2c3251"
      });
      self.labelStyle = ko.observable({
        color: "#2c3251"
      });
      if (self.data() && self.data().periodicLimitDaily) {
        self.centerLabel1 = ko.observable({
          text: ((self.data().periodicLimitDaily.utilizedDailyAmount / self.data().periodicLimitDaily.maxAmount * 100).toFixed(0)).toString() + (self.data().periodicLimitDaily.utilizedDailyAmount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });
        self.centerLabel2 = ko.observable({
          text: ((self.data().periodicLimitDaily.utilizedDailyCount / self.data().periodicLimitDaily.maxCount * 100).toFixed(0)).toString() + (self.data().periodicLimitDaily.utilizedDailyCount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });
        var pieSeriesDailyAmount = [{
            name: self.nls.limitsInquiry.messages.utilized,
            items: [self.data().periodicLimitDaily.utilizedDailyAmount],
            color: "#961c74",
            currency: self.data().periodicLimitDaily.bankAllocatedCurrency
          },
          {
            name: self.nls.limitsInquiry.messages.available,
            items: [self.data().periodicLimitDaily.maxAmount - self.data().periodicLimitDaily.utilizedDailyAmount],
            color: "#29c3c3",
            currency: self.data().periodicLimitDaily.bankAllocatedCurrency
          }
        ];
        var pieSeriesDailyCount = [{
            name: self.nls.limitsInquiry.messages.utilized,
            items: [self.data().periodicLimitDaily.utilizedDailyCount],
            color: "#961c74",
            currency: self.data().periodicLimitDaily.bankAllocatedCurrency
          },
          {
            name: self.nls.limitsInquiry.messages.available,
            items: [self.data().periodicLimitDaily.maxCount - self.data().periodicLimitDaily.utilizedDailyCount],
            color: "#29c3c3",
            currency: self.data().periodicLimitDaily.bankAllocatedCurrency
          }
        ];
      }
      if (self.data() && self.data().periodicLimitMonthly) {
        self.centerLabel3 = ko.observable({
          text: ((self.data().periodicLimitMonthly.utilizedMonthlyAmount / self.data().periodicLimitMonthly.maxAmount * 100).toFixed(0)).toString() + (self.data().periodicLimitMonthly.utilizedMonthlyAmount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });
        self.centerLabel4 = ko.observable({
          text: ((self.data().periodicLimitMonthly.utilizedMonthlyCount / self.data().periodicLimitMonthly.maxCount * 100).toFixed(0)).toString() + (self.data().periodicLimitMonthly.utilizedMonthlyCount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });
        var pieSeriesMonthlyAmount = [{
            name: self.nls.limitsInquiry.messages.utilized,
            items: [self.data().periodicLimitMonthly.utilizedMonthlyAmount],
            color: "#961c74",
            currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
          },
          {
            name: self.nls.limitsInquiry.messages.available,
            items: [self.data().periodicLimitMonthly.maxAmount - self.data().periodicLimitMonthly.utilizedMonthlyAmount],
            color: "#29c3c3",
            currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
          }
        ];
        var pieSeriesMonthlyCount = [{
            name: self.nls.limitsInquiry.messages.utilized,
            items: [self.data().periodicLimitMonthly.utilizedMonthlyCount],
            color: "#961c74",
            currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
          },
          {
            name: self.nls.limitsInquiry.messages.available,
            items: [self.data().periodicLimitMonthly.maxCount - self.data().periodicLimitMonthly.utilizedMonthlyCount],
            color: "#29c3c3",
            currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
          }
        ];
      }
      var pieGroups = ["Group A"];
      self.pieSeriesDailyAmount = ko.observableArray(pieSeriesDailyAmount);
      self.pieSeriesDailyCount = ko.observableArray(pieSeriesDailyCount);
      self.pieSeriesMonthlyAmount = ko.observableArray(pieSeriesMonthlyAmount);
      self.pieSeriesMonthlyCount = ko.observableArray(pieSeriesMonthlyCount);
      self.pieGroupsValue = ko.observableArray(pieGroups);
    };

  });
