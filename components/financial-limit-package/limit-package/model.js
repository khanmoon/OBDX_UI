define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LimitPackageModel = function() {
    var params, baseService = BaseService.getInstance(),
      fetchLimitTransactionsDeffered, fetchLimitTransactions = function(deffered) {
        var options = {

          url: "resourceTasks?aspects=limit&executable=true",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

        baseService.fetch(options);
      },
      fetchTransactionGroupDeffered, fetchTransactionGroup = function(deffered) {
        var options = {
          url: "taskGroups?taskAspect=limit",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

        baseService.fetch(options);
      },
      getTransactionGroupNameDeffered, getTransactionGroupName = function(taskGroupId, deffered) {
        var options = {

          url: "taskGroups/" + taskGroupId,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

        baseService.fetch(options);
      },
      fetchAccessPointDeffered, fetchAccessPoint = function(deffered) {
        var options = {

          url: "accessPoints",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAccessPointGroupDeffered, fetchAccessPointGroup = function(deffered) {
        var options = {

          url: "accessPointGroups",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchEnterpriseRolesDeffered, fetchEnterpriseRoles = function(deffered) {
        var options = {

          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCurrenciesDeffered, fetchCurrencies = function(deffered) {
        var options = {

          url: "currency",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      createNewPackageDeffered, createNewPackage = function(payload, deffered) {
        var options = {

          url: "limitPackages",
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updatePackageDeffered, updatePackage = function(payload, deffered) {
        var options = {
          url: "limitPackages/" + JSON.parse(payload).key.id,
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.update(options);
      },
      fetchCummulativeLimitsDeffered, fetchCummulativeLimits = function(limitCurrency, deffered) {
        params = {
          "limitCurrency": limitCurrency
        };
        var options = {
          url: "financialLimits?limitType=PER&limitCurrency=" + limitCurrency,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchTransactionLimitsDeffered, fetchTransactionLimits = function(limitCurrency, deffered) {
        params = {
          "limitCurrency": limitCurrency
        };
        var options = {
          url: "financialLimits?limitType=TXN&limitCurrency=" + limitCurrency,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchCoolingLimitsDeffered, fetchCoolingLimits = function(limitCurrency, deffered) {
        params = {
          "limitCurrency": limitCurrency
        };
        var options = {
          url: "financialLimits?limitType=DUR&limitCurrency=" + limitCurrency,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchEffectiveTodayDetailsDeffered, fetchEffectiveTodayDetails = function(deffered) {
        var options = {
          url: "limitPackages/config/effectiveToday",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTargetLinkageModel = function() {
        var targetLimitLinkagesObj = {};
        targetLimitLinkagesObj = {
          "target": {
            "value": null,
            "name": null,
            "type": {
              "id": null,
              "name": null,
              "mandatory": true
            }
          },
          "limits": [{
              "limitId": null,
              "limitName": null,
              "limitDescription": null,
              "limitType": "PER",
              "maxAmount": null,
              "maxCount": null,
              "periodicity": "DAILY",
              "currency": null
            },
            {
              "limitId": null,
              "limitName": null,
              "limitDescription": null,
              "limitType": "PER",
              "maxAmount": null,
              "maxCount": null,
              "periodicity": "MONTHLY",
              "currency": null
            }, {
              "limitId": null,
              "limitName": null,
              "limitDescription": null,
              "limitType": "TXN",
              "amountRange": null,
              "currency": null
            }, {
              "limitId": null,
              "limitName": null,
              "limitDescription": null,
              "limitType": "DUR",
              "durationLimitSlots": null,
              "currency": null

            }
          ],
          "effectiveDate": null,
          "expiryDate": null,
          "editable": true
        };
        return targetLimitLinkagesObj;
      },

      getPackageModel = function() {
        var obj = {};
        obj = {
          key: {
            id: null
          },
          accessPointValue: null,
          accessPointGroupType: null,
          description: null,
          currency: null,
          owner: {
            key: {
              value: "RETAIL",
              type: "ROLE"
            }
          },
          targetLimitLinkages: [getTargetLinkageModel()],
          assignableToList: [{
            key: {
              "value": null,
              "type": null
            }
          }]
        };
        return obj;
      };
    return {
      fetchLimitTransactions: function() {
        fetchLimitTransactionsDeffered = $.Deferred();
        fetchLimitTransactions(fetchLimitTransactionsDeffered);
        return fetchLimitTransactionsDeffered;
      },
      fetchTransactionGroup: function() {
        fetchTransactionGroupDeffered = $.Deferred();
        fetchTransactionGroup(fetchTransactionGroupDeffered);
        return fetchTransactionGroupDeffered;
      },
      getTransactionGroupName: function(taskGroupId) {
        getTransactionGroupNameDeffered = $.Deferred();
        getTransactionGroupName(taskGroupId, getTransactionGroupNameDeffered);
        return getTransactionGroupNameDeffered;
      },
      fetchAccessPoint: function() {
        fetchAccessPointDeffered = $.Deferred();
        fetchAccessPoint(fetchAccessPointDeffered);
        return fetchAccessPointDeffered;
      },
      fetchAccessPointGroup: function() {
        fetchAccessPointGroupDeffered = $.Deferred();
        fetchAccessPointGroup(fetchAccessPointGroupDeffered);
        return fetchAccessPointGroupDeffered;
      },
      fetchEnterpriseRoles: function() {
        fetchEnterpriseRolesDeffered = $.Deferred();
        fetchEnterpriseRoles(fetchEnterpriseRolesDeffered);
        return fetchEnterpriseRolesDeffered;
      },
      fetchCurrencies: function() {
        fetchCurrenciesDeffered = $.Deferred();
        fetchCurrencies(fetchCurrenciesDeffered);
        return fetchCurrenciesDeffered;
      },
      createNewPackage: function(payload) {
        createNewPackageDeffered = $.Deferred();
        createNewPackage(payload, createNewPackageDeffered);
        return createNewPackageDeffered;
      },
      updatePackage: function(payload) {
        updatePackageDeffered = $.Deferred();
        updatePackage(payload, updatePackageDeffered);
        return updatePackageDeffered;
      },
      fetchCummulativeLimits: function(limitCurrency) {
        fetchCummulativeLimitsDeffered = $.Deferred();
        fetchCummulativeLimits(limitCurrency, fetchCummulativeLimitsDeffered);
        return fetchCummulativeLimitsDeffered;
      },
      fetchTransactionLimits: function(limitCurrency) {
        fetchTransactionLimitsDeffered = $.Deferred();
        fetchTransactionLimits(limitCurrency, fetchTransactionLimitsDeffered);
        return fetchTransactionLimitsDeffered;
      },
      fetchCoolingLimits: function(limitCurrency) {
        fetchCoolingLimitsDeffered = $.Deferred();
        fetchCoolingLimits(limitCurrency, fetchCoolingLimitsDeffered);
        return fetchCoolingLimitsDeffered;
      },
      fetchEffectiveTodayDetails: function() {
        fetchEffectiveTodayDetailsDeffered = $.Deferred();
        fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);
        return fetchEffectiveTodayDetailsDeffered;
      },
      getTargetLinkageModel: function() {
        return new getTargetLinkageModel();
      },
      getTransactionGroupModel: function() {
        return new getTargetLinkageModel();
      },
      getPackageModel: function() {
        return new getPackageModel();
      }
    };
  };
  return new LimitPackageModel();
});
