define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  var WorkingWindowModel = function() {
    var
      baseService = BaseService.getInstance(),
      Model = function() {
        this.WorkingWindow = {
          "exceptionName": null,
          "exceptionCode": null,
          "effectiveDate": null,
          "workingWindowType": "STANDARD",
          "processingType": null,
          workingWindowRoleTaskMapDTOs: [{
            "roleName": "RetailUser",
            "taskCode": null,
            "workingWindowDayDTOs": [{
                "day": "Monday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 0
                }]
              },
              {
                "day": "Tuesday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 1
                }]
              },
              {
                "day": "Wednesday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 2
                }]
              },
              {
                "day": "Thursday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 3
                }]
              },
              {
                "day": "Friday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 4
                }]
              },
              {
                "day": "Saturday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 5
                }]
              },
              {
                "day": "Sunday",
                "transactionWindow": null,
                "workingWindowTimeDTOs": [{
                  "disabled": null,
                  "startTime": null,
                  "endTime": null,
                  "dayIndex": 6

                }]
              }
            ]
          }]
        };
      };
    var getTransactionsDeferred,
      getTransactions = function(deferred) {
        var options = {
          url: "resourceTasks?aspects=working-window",
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUserTypeDeferred, fetchUserType = function(deferred) {
        var
          options = {
            url : "enterpriseRoles?isLocal=true",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options);
      },

      createStandardWorkWindowDeferred,
      createStandardWorkWindow = function(standardWorkWindowCreatePayload, deferred) {
        var options = {
          url: "workingWindows",
          data: standardWorkWindowCreatePayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);
        return fetchUserTypeDeferred;
      },
      createStandardWorkWindow: function(standardWorkWindowCreatePayload) {
        createStandardWorkWindowDeferred = $.Deferred();
        createStandardWorkWindow(standardWorkWindowCreatePayload, createStandardWorkWindowDeferred);
        return createStandardWorkWindowDeferred;
      }
    };
  };
  return new WorkingWindowModel();
});