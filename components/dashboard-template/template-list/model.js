define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DashboardListModel = function() {
    var Deferred, getDashboardList = function(deferred) {
        var options = {
          url: "dashboards",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      applyDashboardDeferred, applyDashboard = function(dashboardId, deferred) {
        var options = {
          url: "dashboards/apply/" + dashboardId,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.update(options);
      },
      dashboardMappingDeferred, dashboardMapping = function(mappingType, deferred) {
        var options = {
          url: "dashboards/mappings?mappingType=" + mappingType,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getDashboardList: function() {
        Deferred = $.Deferred();
        getDashboardList(Deferred);
        return Deferred;
      },
      applyDashboard: function(dashboardId) {
        applyDashboardDeferred = $.Deferred();
        applyDashboard(dashboardId, applyDashboardDeferred);
        return applyDashboardDeferred;
      },
      getMappings: function(mappingType) {
        dashboardMappingDeferred = $.Deferred();
        dashboardMapping(mappingType, dashboardMappingDeferred);
        return dashboardMappingDeferred;
      }
    };
  };
  return new DashboardListModel();
});