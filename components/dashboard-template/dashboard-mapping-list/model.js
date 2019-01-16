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
        getEntitiesDeferred, fetchEntities = function(deferred) {
          var options = {
            url: "entities",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.fetchJSON(options);
        },
        dashboardMappingDeferred, dashboardMapping = function(mappingType, deferred) {
          var options = {
            url: "dashboards/mappings?mappingType=" + mappingType,
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options);
        },
        deleteDesignMappingDeferred, deleteDesignMapping = function(mappingId, deffered) {
          var options = {
            url: "dashboards/mappings/" + mappingId,
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
        getDashboardList: function() {
          Deferred = $.Deferred();
          getDashboardList(Deferred);
          return Deferred;
        },
        fetchEntities: function() {
          getEntitiesDeferred = $.Deferred();
          fetchEntities(getEntitiesDeferred);
          return getEntitiesDeferred;
        },
        getMappings: function(mappingType) {
          dashboardMappingDeferred = $.Deferred();
          dashboardMapping(mappingType, dashboardMappingDeferred);
          return dashboardMappingDeferred;
        },
        deleteDesignMapping: function(mappingId) {
          deleteDesignMappingDeferred = $.Deferred();
          deleteDesignMapping(mappingId, deleteDesignMappingDeferred);
          return deleteDesignMappingDeferred;
        }
      };
    };
    return new DashboardListModel();
  });