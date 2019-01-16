define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/limits-widget",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojgauge"
], function(oj, ko, $, LimitsWigetModel, locale) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.typeOfWidget = params.data.data.type;
    self.locale = locale;
    self.utilizationLimitsLoaded = ko.observable(false);
    params.baseModel.registerComponent("my-limits", "limits-enquiry");
    params.baseModel.registerComponent("limits-graph", "limits-enquiry");

    self.financialLimitUtilization = {};

    self.targetLinkages = ko.observableArray();
    self.selectedTransactionType = ko.observable();
    self.selectedTransactionData = ko.observable();
    self.arrayOfLimitsLinkages = ko.observableArray();
    self.taskCodeList = ko.observableArray();
    self.dataLoaded = ko.observable(false);
    self.showGraph = ko.observable(false);
    self.flag = ko.observable(true);

    self.selectedTransactionType.subscribe(function() {
      self.selectedTransactionData(null);
      self.showGraph(false);
      ko.tasks.runEarly();

      for (var z = 0; z < self.arrayOfLimitsLinkages().length; z++) {
        if (self.selectedTransactionType() === self.arrayOfLimitsLinkages()[z].targetName) {
          if (self.arrayOfLimitsLinkages()[z].transactionCustomLimit !== "") {
            self.selectedTransactionData(self.arrayOfLimitsLinkages()[z].transactionCustomLimit);
            break;
          } else {
            self.selectedTransactionData(self.arrayOfLimitsLinkages()[z].transactionLimit);
            break;
          }
        }
      }
      if (self.selectedTransactionData()) {
        self.showGraph(true);
        ko.tasks.runEarly();
      }

    });


    self.setAssignedLimitPackage = function(assignedData) {

      if (assignedData.accessPointGroupType === "SINGLE") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);
        ko.utils.arrayForEach(self.targetLinkages(), function(limitPackageData) {
          if (limitPackageData.target.type.id === "TASK") {
            var transactionLimit;
            var setRequiredLimitData = self.assignLimitPackage(limitPackageData);
            transactionLimit = setRequiredLimitData;

            var limitData = {
              targetId: "",
              targetName: "",
              userType: "",
              isDataSaved: true,
              transactionLimit: transactionLimit,
              transactionCustomLimit: ""
            };
            limitData.targetId = limitPackageData.target.id;
            limitData.userType = limitPackageData.limits[0].owner;
            limitData.targetName = limitPackageData.target.value;

            self.arrayOfLimitsLinkages.push(limitData);
          }
        });
      }
    };

    self.assignLimitPackage = function(targetLimitData) {

      var transactionalLimitData;
      var dailyPeriodicLimitData;
      var monthlyPeriodicLimitData;

      ko.utils.arrayForEach(targetLimitData.limits, function(targetLimits) {

        if (targetLimits.limitType === "TXN") {
          transactionalLimitData = {
            targetId: targetLimitData.target.id,
            limitType: targetLimits.limitType,
            limitId: targetLimits.limitId,
            limitName: targetLimits.limitName,
            limitDesc: targetLimits.limitDescription,
            maxAmount: targetLimits.amountRange.maxTransaction.amount,
            maxCurrency: targetLimits.amountRange.maxTransaction.currency,
            miniAmount: targetLimits.amountRange.minTransaction.amount,
            miniCurrency: targetLimits.amountRange.minTransaction.currency
          };
        }

        if (targetLimits.limitType === "PER") {
          switch (targetLimits.periodicity) {
            case "DAILY":
              dailyPeriodicLimitData = {
                targetId: targetLimitData.target.id,
                limitType: targetLimits.limitType,
                limitId: targetLimits.limitId,
                limitName: targetLimits.limitName,
                limitDesc: targetLimits.limitDescription,
                periodicity: targetLimits.periodicity,
                maxAmount: targetLimits.maxAmount.amount,
                maxCurrency: targetLimits.maxAmount.currency,
                maxCount: targetLimits.maxCount,
                bankAllocatedCount: targetLimits.maxCount,
                bankAllocatedAmount: targetLimits.maxAmount.amount,
                bankAllocatedCurrency: targetLimits.maxAmount.currency,
                utilizedDailyCount: 0,
                utilizedDailyAmount: 0,
                utilizedDailyCurrency: ""
              };
              break;
            case "MONTHLY":
              monthlyPeriodicLimitData = {
                targetId: targetLimitData.target.id,
                limitType: targetLimits.limitType,
                limitId: targetLimits.limitId,
                limitName: targetLimits.limitName,
                limitDesc: targetLimits.limitDescription,
                periodicity: targetLimits.periodicity,
                maxAmount: targetLimits.maxAmount.amount,
                maxCurrency: targetLimits.maxAmount.currency,
                maxCount: targetLimits.maxCount,
                bankAllocatedCount: targetLimits.maxCount,
                bankAllocatedAmount: targetLimits.maxAmount.amount,
                bankAllocatedCurrency: targetLimits.maxAmount.currency,
                utilizedMonthlyCount: 0,
                utilizedMonthlyAmount: 0,
                utilizedMonthlyCurrency: ""
              };
              break;
            default:
              break;
          }
        }
      });

      var setRequiredLimitData = {
        transactionalLimitData: transactionalLimitData,
        periodicLimitDaily: dailyPeriodicLimitData,
        periodicLimitMonthly: monthlyPeriodicLimitData
      };
      return setRequiredLimitData;
    };

    self.filteredCustomPackageData = function(assignedData) {

      if (assignedData.accessPointGroupType === "SINGLE") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);
        ko.utils.arrayForEach(self.targetLinkages(), function(limitPackageData) {
          if (limitPackageData.target.type.id === "TASK") {
            var transactionCustomLimit;
            var setRequiredLimitData = self.assignLimitPackage(limitPackageData);
            transactionCustomLimit = setRequiredLimitData;
            var index = self.checkIfExist(limitPackageData.target.value);
            if (index !== null) {
              self.arrayOfLimitsLinkages()[index].transactionCustomLimit = transactionCustomLimit;
            }
          }
        });
      }
    };

    self.checkIfExist = function(taskGroupId) {

      var getById = null;
      for (var t = 0; t < self.arrayOfLimitsLinkages().length; t++) {
        if (self.arrayOfLimitsLinkages()[t].targetName === taskGroupId) {
          getById = t;
          break;
        }
      }
      return getById;
    };

    self.setUtilizationData = function(targetId, utilizedData) {
      var utilizedCount;
      var utilizedAmount;
      var utilizedCurrency;
      var index;

      for (var t = 0; t < self.arrayOfLimitsLinkages().length; t++) {
        if (self.arrayOfLimitsLinkages()[t].targetName === targetId) {
          utilizedCount = utilizedData.count ? utilizedData.count : 0;
          utilizedAmount = utilizedData.amount.amount ? utilizedData.amount.amount : 0;
          utilizedCurrency = utilizedData.amount.currency ? utilizedData.amount.currency : "";
          index = t;
          break;
        }
      }

      var setRequiredUtilizedData = {
        utilizedCount: utilizedCount,
        utilizedAmount: utilizedAmount,
        utilizedCurrency: utilizedCurrency,
        index: index
      };
      return setRequiredUtilizedData;
    };

    self.dailyUtilizationData = function(dailyData) {
      ko.utils.arrayForEach(dailyData, function(utilizedDailyData) {


        var tempData = self.setUtilizationData(utilizedDailyData.utilizationId, utilizedDailyData);
        if (tempData.index !== undefined) {

          if (utilizedDailyData.accessPointGroupType === "SINGLE") {
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;

            if (self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit !== "") {

              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;

            }
          }
        }
      });
    };

    self.monthlyUtilizationData = function(monthlyData) {
      ko.utils.arrayForEach(monthlyData, function(utilizedMonthlyData) {

        var tempData = self.setUtilizationData(utilizedMonthlyData.utilizationId, utilizedMonthlyData);
        if (tempData.index !== undefined) {
          if (utilizedMonthlyData.accessPointGroupType === "SINGLE") {
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
            self.arrayOfLimitsLinkages()[tempData.index].transactionLimit.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;

            if (self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit !== "") {

              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
              self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;
            }
          }
        }

      });
    };

    self.getTaskList = function() {
      LimitsWigetModel.getTransactionName().then(function(data) {
        self.taskCodeList(data.taskList);
        self.dataLoaded(true);
        ko.tasks.runEarly();
        self.selectedTransactionType(self.taskCodeList()[0].id);
      });
    };


    Promise.all([
      LimitsWigetModel.fetchAssignedLimitPackages(self.typeOfWidget),
      LimitsWigetModel.fetchUtilizationLimit(self.typeOfWidget, "PER%23DAILY"),
      LimitsWigetModel.fetchUtilizationLimit(self.typeOfWidget, "PER%23MONTHLY"),
      LimitsWigetModel.fetchCustomLimitPackages()
    ]).then(function(response) {

      var Assigned = response[0];
      var UtilizedDaily = response[1];
      var UtilizedMonthly = response[2];
      var Custom = response[3];


      ko.utils.arrayForEach(Assigned.limitPackageDTOList, function(target) {
        self.setAssignedLimitPackage(target);
      });

      if (Custom.limitPackageDTO) {
        ko.utils.arrayForEach(Custom.limitPackageDTO, function(target) {
          self.filteredCustomPackageData(target);
        });
      }

      if (UtilizedDaily.limitUtilizationDTOs) {
        self.dailyUtilizationData(UtilizedDaily.limitUtilizationDTOs);
      }
      if (UtilizedMonthly.limitUtilizationDTOs) {
        self.monthlyUtilizationData(UtilizedMonthly.limitUtilizationDTOs);
      }

      self.getTaskList();
    });
  };
});
