define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/transfer-view-limits",
  "framework/js/constants/constants",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojdialog",
  "ojs/ojbutton",
  "ojs/ojgauge",
  "ojs/ojchart"
], function(oj, ko, $, TransferViewLimitsModel, BaseLogger, ResourceBundle, Constants) {
  "use strict";
  /** Transfer view limits
   *
   * @param {object} Params  An object which contains contect of dashboard and param values
   * @return {function} function
   * @return {object} getNewKoModel
   *
   */
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.userSegment = Constants.userSegment;
    self.type = ko.observable(ko.utils.unwrapObservable(Params.type));
    self.payeeId = ko.observable(ko.utils.unwrapObservable(Params.id));
    self.accessPointValue = ko.observable(ko.utils.unwrapObservable(Params.accessPointValue));
    self.selectedChannelTypeNameValue = ko.observable(ko.utils.unwrapObservable(self.selectedChannelTypeName));

    self.transactionType = ko.observable();
    self.transactionType = self.userSegment === "CORP" || (self.userSegment === "RETAIL" && self.type() !== "PC_F_SELF") ? self.type() + "#" + self.payeeId() : self.type();
    self.limitResource = ResourceBundle.limit;
    self.isLimitLoaded = ko.observable(false);
    self.isMonthlyLimitLoaded = ko.observable(false);
    self.noLimits = ko.observable(false);
    self.limitsData_Tran_Level = ko.observable({});
    self.limitsData_Daily_Level = ko.observable({});
    self.limitsData_Monthly_Level = ko.observable({});
    self.localCurrency = ko.observable();
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(Params.baseModel.getDate()));
    self.limitCurrency = ko.observable();
    self.dailyLimit = ko.observable();
    self.monthlyLimit = ko.observable();
    self.limitExist = ko.observable(false);
    self.monthlyLimitExist = ko.observable(false);
    self.monthlyUtilizedAmount = ko.observable();
    self.dailyUtilizedAmount = ko.observable();
    self.utilizedCurrency = ko.observable();
    self.selectedTabData = null;
    self.taskCodeList = ko.observableArray();
    self.arrayOfLimitsLinkages = ko.observableArray();
    self.taskCodeListFetch = ko.observable(false);
    self.effectiveSameDayFlag = ko.observable(false);
    self.isRetailUser = ko.observable(false);
    self.customPackageFlag = ko.observable(false);
    self.showConfirm = ko.observable(false);
    self.isDataLoaded = ko.observable(false);
    self.existingLimitPackage = ko.observable();
    self.showSubmit = ko.observable(false);
    self.showNavigation = ko.observable(false);
    self.saveLimit = ko.observable(false);
    self.showEditLimit = ko.observable(false);
    self.selectedTransactionType = ko.observable();
    self.selectedChannelIndex = ko.observable();
    self.selectedChannelType = ko.observable();
    Params.baseModel.registerElement("action-header");
    Params.baseModel.registerElement("page-section");
    self.limitsHeader = ko.observable(self.selectedTransactionType());
    self.dataLoaded = ko.observable(false);
    self.showGraph = ko.observable(false);
    self.showGroupInfo = ko.observable(false);
    Params.baseModel.registerComponent("limits-graph", "limits-enquiry");
    self.assignedLimitDataArray = ko.observableArray();
    self.loadAccessPointList = ko.observable(false);
    self.selectedChannelTypeName = ko.observable();
    self.showTransactionGroupInfo = ko.observable(false);
    self.showChannelGroupInfo = ko.observable(false);
    self.menuCountLimitOptions = ko.observableArray();
    self.selectedTransactionData = ko.observable();
    self.selectedTransactionName = ko.observable();
    self.menuLimitSelection = ko.observable();
    self.knowMoreFlag = ko.observable(false);
    self.isCustomFlag = ko.observable(false);
    self.knowMore = function() {
      self.knowMoreFlag(true);
    };
    self.selectedTransactionType(self.type());
    self.selectedTransactionData(null);
    self.showNavigation(false);
    self.showGroupInfo(false);
    self.showGraph(false);

    if (Params.dashboard.userData.userProfile.roles) {
      ko.utils.arrayForEach(Params.dashboard.userData.userProfile.roles, function(role) {
        if (role.toLowerCase() === "retailuser") {
          self.isRetailUser(true);
        }
      });
    }
    /**
     * This function will check if given task group id exists or not.
     *
     * @memberOf transfer-view-limits
     * @param {object} taskGroupId  Task group id
     * @function checkIfExist
     * @returns {void}
     */
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

    /**
     * This function will set target.
     *
     * @memberOf transfer-view-limits
     * @param {object} limitPackageData  Data of limit package
     * @param {object} targetName  target name
     * @param {object} transactionLimit  transaction limit
     * @function setTarget
     * @returns {void}
     */
    self.setTarget = function(limitPackageData, targetName, transactionLimit) {
      var index = self.checkIfExist(targetName);
      if (index !== null) {
        if (transactionLimit)
          self.arrayOfLimitsLinkages()[index].transactionLimit = transactionLimit;


      } else {
        var limitData = {
          targetId: "",
          targetName: "",
          userType: "",
          isDataSaved: true,
          transactionLimit: transactionLimit ? transactionLimit : "",

          transactionCustomLimit: ""

        };
        limitData.targetId = limitPackageData.target.id;
        limitData.userType = limitPackageData.limits[0].owner;
        limitData.targetName = limitPackageData.target.value;

        self.arrayOfLimitsLinkages.push(limitData);
      }

    };
    var transactionalLimitData;
    var dailyPeriodicLimitData;
    var monthlyPeriodicLimitData;

    /**
     * This function will assign limit package
     *
     * @memberOf transfer-view-limits
     * @param {object} targetLimitData  target limit data
     * @function assignLimitPackage
     * @returns {void}
     */
    self.assignLimitPackage = function(targetLimitData) {
      ko.utils.arrayForEach(targetLimitData.limits, function(targetLimits) {
        if (!self.isCustomFlag() && targetLimits.limitType === "TXN") {
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
    self.targetLinkages = ko.observableArray();

    /**
     * This function will set assigned limit package
     *
     * @memberOf transfer-view-limits
     * @param {object} assignedData  assigned limits data
     * @function assignLimitPackage
     * @returns {void}
     */
    self.setAssignedLimitPackage = function(assignedData) {
      if (assignedData.accessPointGroupType === "SINGLE") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);
        ko.utils.arrayForEach(self.targetLinkages(), function(limitPackageData) {
            if (limitPackageData.target.type.id === "TASK" && !(limitPackageData.expiryDate && limitPackageData.expiryDate <= self.todayDate()) && !(limitPackageData.effectiveDate > self.todayDate())) {

          if (limitPackageData.target.type.id === "TASK") {
            var transactionLimit;

            var setRequiredLimitData = self.assignLimitPackage(limitPackageData);
            transactionLimit = setRequiredLimitData;
            self.setTarget(limitPackageData, limitPackageData.target.value, transactionLimit);
          }
}
        });
      }
    };

    /**
     * This function will set custom target
     *
     * @memberOf transfer-view-limits
     * @param {object} limitPackageData  Limit package data
     * @param {object} targetName  target name
     * @param {object} transactionCustomLimit  custom transaction limit data
     * @function setCustomTarget
     * @returns {void}
     */
    self.setCustomTarget = function(limitPackageData, targetName, transactionCustomLimit) {
      var index = self.checkIfExist(targetName);
      if (index !== null) {
        if (transactionCustomLimit)
          self.arrayOfLimitsLinkages()[index].transactionCustomLimit = transactionCustomLimit;
      }
    };

    /**
     * This function will filter custome package data
     *
     * @memberOf transfer-view-limits
     * @param {object} assignedData  Assigned limit package data
     * @function filteredCustomPackageData
     * @returns {void}
     */
    self.filteredCustomPackageData = function(assignedData) {
      if (assignedData.accessPointGroupType === "SINGLE") {

        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);
        ko.utils.arrayForEach(self.targetLinkages(), function(limitPackageData) {
            if (limitPackageData.target.type.id === "TASK" && !(limitPackageData.expiryDate && limitPackageData.expiryDate <= self.todayDate()) && !(limitPackageData.effectiveDate > self.todayDate())) {
          if (limitPackageData.target.type.id === "TASK") {
            var transactionLimit;

            var setRequiredLimitData = self.assignLimitPackage(limitPackageData);
            transactionLimit = setRequiredLimitData;
            self.setCustomTarget(limitPackageData, limitPackageData.target.value, transactionLimit);
          }
        }

        });

}
    };

    /**
     * This function will set limit utilization data
     *
     * @memberOf transfer-view-limits
     * @param {object} targetId  target id
     * @param {object} utilizedData  limit utilization data
     * @function setUtilizationData
     * @returns {void}
     */
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

    /**
     * This function will compute daily utilization data
     *
     * @memberOf transfer-view-limits
     * @param {object} dailyData  daily utilization data
     * @function dailyUtilizationData
     * @returns {void}
     */
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

    /**
     * This function will compute monthly utilization data
     *
     * @memberOf transfer-view-limits
     * @param {object} monthlyData  monthly utilization data
     * @function monthlyUtilizationData
     * @returns {void}
     */
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

    /**
     * This function fetches assigned limit packages
     *
     * @memberOf transfer-view-limits
     * @function fetchData
     * @returns {void}
     */
    self.fetchData = function() {
      var urlDaily, urlMonthly;
      if (self.isRetailUser()) {
        urlDaily = "financialLimitUtilization?entityType=PARTY&limitType=PER%23DAILY&accessPointValue=" + self.accessPointValue() + "&accessPointGroupType=SINGLE";
        urlMonthly = "financialLimitUtilization?entityType=PARTY&limitType=PER%23MONTHLY&accessPointValue=" + self.accessPointValue() + "&accessPointGroupType=SINGLE";
      } else {
        urlDaily = "financialLimitUtilization?entityType=USER&limitType=PER%23DAILY&accessPointValue=" + self.accessPointValue() + "&accessPointGroupType=SINGLE";
        urlMonthly = "financialLimitUtilization?entityType=USER&limitType=PER%23MONTHLY&accessPointValue=" + self.accessPointValue() + "&accessPointGroupType=SINGLE";
      }
      $.when(TransferViewLimitsModel.fetchAssignedLimitPackages("me/assignedLimitPackage", self.accessPointValue(), "SINGLE"), TransferViewLimitsModel.fetchUtilizationLimit(urlDaily), TransferViewLimitsModel.fetchUtilizationLimit(urlMonthly), TransferViewLimitsModel.fetchCustomLimitPackages("me/customLimitPackage", self.accessPointValue(), "SINGLE"))
        .done(function(Assigned, UtilizedDaily, UtilizedMonthly, Custom) {
          self.isDataLoaded(true);
          ko.utils.arrayForEach(Assigned.limitPackageDTOList, function(target) {
            self.setAssignedLimitPackage(target);
          });

          if (self.isRetailUser()) {
            if (Custom.limitPackageDTOList) {
              self.isCustomFlag(true);
              ko.utils.arrayForEach(Custom.limitPackageDTOList, function(target) {
                self.filteredCustomPackageData(target);
              });
            }
          }
          if (UtilizedDaily.limitUtilizationDTOs) {
            self.dailyUtilizationData(UtilizedDaily.limitUtilizationDTOs);
          }
          if (UtilizedMonthly.limitUtilizationDTOs) {
            self.monthlyUtilizationData(UtilizedMonthly.limitUtilizationDTOs);
          }

          for (var z = 0; z < self.arrayOfLimitsLinkages().length; z++) {
            if (self.selectedTransactionType() === self.arrayOfLimitsLinkages()[z].targetName) {

              if (self.arrayOfLimitsLinkages()[z].transactionCustomLimit !== "")
                self.selectedTransactionData(self.arrayOfLimitsLinkages()[z].transactionCustomLimit);
              else
                self.selectedTransactionData(self.arrayOfLimitsLinkages()[z].transactionLimit);
              break;
            }

          }
          if (self.selectedTransactionData()) {
            self.showNavigation(true);
            self.showGraph(true);
            ko.tasks.runEarly();
          } else {
            self.showGraph(true);

          }


        });


    };
    if (self.accessPointValue())
      self.fetchData();

  };
});
