define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var viewAuthenticationMaintenanceModel = function() {
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
      fetchSegementAuthenticationMaintenanceDeferred, fetchSegementAuthenticationMaintenance = function(segment, deferred) {
        var options = {

          url: "configurations/usersegment/" + segment + "/authenticationMapping",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchTransactionsForMaintenance: function(taskType) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(taskType, fetchTransactionsForMaintenanceDeferred);
        return fetchTransactionsForMaintenanceDeferred;
      },
      fetchSegementAuthenticationMaintenance: function(segment) {
        fetchSegementAuthenticationMaintenanceDeferred = $.Deferred();
        fetchSegementAuthenticationMaintenance(segment, fetchSegementAuthenticationMaintenanceDeferred);
        return fetchSegementAuthenticationMaintenanceDeferred;
      }
    };
  };
  return new viewAuthenticationMaintenanceModel();
});