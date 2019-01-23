define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var createAuthenticationMaintenanceModel = function () {
    var baseService = BaseService.getInstance();
    var fetchTransactionsForMaintenanceDeferred, fetchTransactionsForMaintenance = function (taskType, deferred) {
      var resourceUrl = "resourceTasks?aspects=2fa&view=list";
      if (taskType) {
        for (var i = 0; i < taskType.length; i++) {
          resourceUrl += "&taskType=" + taskType[i];
        }
      }
      var options = {
        url: resourceUrl,

        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    },
      fetchChallengesDeferred, fetchChallenges = function (deferred, userSegment) {
        var options = {

          url: "configurations/authentication?userSegment={userSegment}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
          params = {
            "userSegment": userSegment
          };
        baseService.fetch(options, params);
      };
    return {
      fetchTransactionsForMaintenance: function (taskType) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(taskType, fetchTransactionsForMaintenanceDeferred);
        return fetchTransactionsForMaintenanceDeferred;
      },
      fetchChallenges: function (userSegment) {
        fetchChallengesDeferred = $.Deferred();
        fetchChallenges(fetchChallengesDeferred, userSegment);
        return fetchChallengesDeferred;
      }
    };
  };
  return new createAuthenticationMaintenanceModel();
});