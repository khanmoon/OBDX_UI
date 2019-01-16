define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DashboardListModel = function() {
    var deleteDesignDashboardDeferred, deleteDesignDashboard = function(dashboardId, deffered) {
      var options = {
        url: "dashboards/" + dashboardId,
        success: function(data, status, jqXhr) {
          deffered.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deffered.reject(data, status, jqXhr);
        }
      };
      baseService.remove(options);
    };
    return {
      deleteDesignDashboard: function(dashboardId) {
        deleteDesignDashboardDeferred = $.Deferred();
        deleteDesignDashboard(dashboardId, deleteDesignDashboardDeferred);
        return deleteDesignDashboardDeferred;
      }
    };
  };
  return new DashboardListModel();
});