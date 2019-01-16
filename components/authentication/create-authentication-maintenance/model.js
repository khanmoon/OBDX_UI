define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var createAuthenticationMaintenanceModel = function() {
    var baseService = BaseService.getInstance();
    var fetchTransactionsForMaintenanceDeferred, fetchTransactionsForMaintenance = function(taskType, deferred) {
        var options = {
          url: "resourceTasks?aspects=2fa&taskType=" + taskType + "&view=list",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchChallengesDeferred, fetchChallenges = function(deferred, userSegment) {
        var options = {

            url: "configurations/authentication?userSegment={userSegment}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userSegment": userSegment
          };
        baseService.fetch(options, params);
      };
    return {
      fetchTransactionsForMaintenance: function(taskType) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(taskType, fetchTransactionsForMaintenanceDeferred);
        return fetchTransactionsForMaintenanceDeferred;
      },
      fetchChallenges: function(userSegment) {
        fetchChallengesDeferred = $.Deferred();
        fetchChallenges(fetchChallengesDeferred, userSegment);
        return fetchChallengesDeferred;
      }
    };
  };
  return new createAuthenticationMaintenanceModel();
});