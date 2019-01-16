define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var MyLimitModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.PeriodicLimitModel = {
          "limitName": "",
          "limitDescription": "",
          "limitType": "",
          "currency": "",
          "maxAmount": {
            "currency": "",
            "amount": ""
          },
          "maxCount": "",
          "periodicity": "",
          "owner": {
            "type": "",
            "value": ""
          }
        };
        this.package = {
          "accessPointValue": "",
          "accessPointGroupType": "",
          "currency": "",
          "targetLimitLinkages": [{
            "target": {
              "id": "",
              "value": "",
              "type": {
                "id": "",
                "name": "",
                "mandatory": ""
              }
            },
            "limits": [{
              "limitId": "",
              "limitName": "",
              "limitDescription": "",
              "limitType": "",
              "periodicity": "",
              "maxCount": "",
              "owner": {
                "value": "",
                "type": ""
              },
              "maxAmount": {
                "currency": "",
                "amount": ""
              }
            }]
          }]
        };
      },
      getTransactionNameDeferred, getTransactionName = function(deferred) {
        var options = {
          url: "resourceTasks?aspects=limit&view=list",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAssignedLimitPackagesDeferred, fetchAssignedLimitPackages = function(baseUrl, accessPointValue, accessPointGroupType, deferred) {
        var params = {
            "accessPointValue": accessPointValue,
            "accessPointGroupType": accessPointGroupType
          },
          options = {
            url: baseUrl,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchCustomLimitPackagesDeferred, fetchCustomLimitPackages = function(accessPointValue, accessPointGroupType, deferred) {
        var options = {
          url: "me/customLimitPackage?accessPointValue=" + accessPointValue + "&accessPointGroupType=" + accessPointGroupType,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUtilizationLimitDeferred, fetchUtilizationLimit = function(entityType, accessPointValue, accessPointGroupType, limitType, deferred) {
        var params = {
            "entityType": entityType,
            "accessPointValue": accessPointValue,
            "accessPointGroupType":accessPointGroupType,
            "limitType":limitType
          },
         options = {
          url: "financialLimitUtilization?entityType={entityType}&limitType={limitType}&accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options,params);
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
      createCustomLimitPackagesDeferred, createCustomLimitPackages = function(deferred, payload) {
        var options = {
          data: payload,
          url: "me/customLimitPackage",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateUserLimitDeffered, updateUserLimit = function(deferred, payload) {
        var options = {
          data: payload,
          url: "me/customLimitPackage",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);

      },
      fetchPartyAssignedLimitPackagesDeferred, fetchPartyAssignedLimitPackages = function(deferred) {
        var options = {
          url: "me/party/assignedLimitPackage",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Method to list Transaction Group
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function searchTransactionGroup
       * @param {string} taskAspect- taskAspect for listing Transaction Group
       * @param {oject} deferred- resolved for successful request
       * @private
       */
      searchTransactionGroupDeferred, searchTransactionGroup = function(taskAspect, deferred) {
        var params = {
            "taskAspect": taskAspect
          },
          options = {
            url: "taskGroups?taskAspect={taskAspect}",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      /**
       * This function fires a GET request to fetch the access point group details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       * @function getAccessPointGroup
       * @param {string} groupCode- access point group code
       * @param {oject} deferred- resolved for successful request
       * @private
       */
      getAccessPointGroupDeffered, getAccessPointGroup = function(deferred, groupCode) {
        var params = {
            "groupCode": groupCode
          },
          options = {
            url: "accessPointGroups/{groupCode}",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      searchTransactionGroup: function(taskAspect) {
        searchTransactionGroupDeferred = $.Deferred();
        searchTransactionGroup(taskAspect, searchTransactionGroupDeferred);
        return searchTransactionGroupDeferred;
      },
      getTransactionName: function() {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(getTransactionNameDeferred);
        return getTransactionNameDeferred;
      },
      fetchAssignedLimitPackages: function(baseUrl, accessPointValue, accessPointGroupType) {
        fetchAssignedLimitPackagesDeferred = $.Deferred();
        fetchAssignedLimitPackages(baseUrl, accessPointValue, accessPointGroupType, fetchAssignedLimitPackagesDeferred);
        return fetchAssignedLimitPackagesDeferred;
      },
      fetchCustomLimitPackages: function(accessPointValue, accessPointGroupType) {
        fetchCustomLimitPackagesDeferred = $.Deferred();
        fetchCustomLimitPackages(accessPointValue, accessPointGroupType, fetchCustomLimitPackagesDeferred);
        return fetchCustomLimitPackagesDeferred;
      },
      fetchUtilizationLimit: function(entityType, accessPointValue, accessPointGroupType, limitType) {
        fetchUtilizationLimitDeferred = $.Deferred();
        fetchUtilizationLimit(entityType, accessPointValue, accessPointGroupType, limitType, fetchUtilizationLimitDeferred);
        return fetchUtilizationLimitDeferred;
      },
      fetchEffectiveTodayDetails: function() {
        fetchEffectiveTodayDetailsDeffered = $.Deferred();
        fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);
        return fetchEffectiveTodayDetailsDeffered;
      },
      createCustomLimitPackages: function(payload) {
        createCustomLimitPackagesDeferred = $.Deferred();
        createCustomLimitPackages(createCustomLimitPackagesDeferred, payload);
        return createCustomLimitPackagesDeferred;
      },
      updateUserLimit: function(payload) {
        updateUserLimitDeffered = $.Deferred();
        updateUserLimit(updateUserLimitDeffered, payload);
        return updateUserLimitDeffered;
      },
      fetchPartyAssignedLimitPackages: function() {
        fetchPartyAssignedLimitPackagesDeferred = $.Deferred();
        fetchPartyAssignedLimitPackages(fetchPartyAssignedLimitPackagesDeferred);
        return fetchPartyAssignedLimitPackagesDeferred;
      },
      getAccessPointGroup: function(groupCode) {
        getAccessPointGroupDeffered = $.Deferred();
        getAccessPointGroup(getAccessPointGroupDeffered, groupCode);
        return getAccessPointGroupDeffered;
      },
      /**
       * listAccessPoint - fetches the Access Point List
       * @returns {Promise}  Returns the promise object
       */
      listAccessPoint: function() {
        var options = {
          url: "accessPoints"
        };
        return baseService.fetch(options);
      },
      /**
       * readTransactionGroup - reads the Transaction group
       * @param  {String} transactionGroupId Transaction Group Id for Transaction group
       * @returns {Promise}  Returns the promise object
       */
      readTransactionGroup: function(transactionGroupId) {
        var params = {
            "taskGroupId": transactionGroupId
          },
          options = {
            url: "taskGroups/{taskGroupId}"
          };
        return baseService.fetch(options, params);
      }
    };
  };
  return new MyLimitModel();
});
