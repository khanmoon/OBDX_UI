define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DashboardListModel = function() {
    var saveDashboardDeferred, saveDashboard = function(payload, deffered) {
        var options = {
          url: "dashboards",
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
      updateDashboardDeferred, updateDashboard = function(payload, id, deffered) {
        var options = {
          url: "dashboards/" + id,
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };
    return {
      saveDashboard: function(payload) {
        saveDashboardDeferred = $.Deferred();
        saveDashboard(payload, saveDashboardDeferred);
        return saveDashboardDeferred;
      },
      updateDashboard: function(payload, id) {
        updateDashboardDeferred = $.Deferred();
        updateDashboard(payload, id, updateDashboardDeferred);
        return updateDashboardDeferred;
      }
    };
  };
  return new DashboardListModel();
});