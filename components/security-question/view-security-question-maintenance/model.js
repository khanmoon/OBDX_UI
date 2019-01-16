define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var viewSecurityQuestionMaintenanceModel = function() {

    var baseService = BaseService.getInstance();
    var fetchTransactionsForMaintenanceDeferred, fetchTransactionsForMaintenance = function(maintenanceId, deferred) {
      var options = {
        url: "securityQuestion?maintenanceId=" + maintenanceId,

        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      fetchTransactionsForMaintenance: function(maintenanceId) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(maintenanceId, fetchTransactionsForMaintenanceDeferred);
        return fetchTransactionsForMaintenanceDeferred;
      }
    };
  };
  return new viewSecurityQuestionMaintenanceModel();
});