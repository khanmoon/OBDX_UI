define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SystemConfigurationMenu = function() {
    var Deferred, getHostList = function(deferred) {
        var options = {
          throttle:false,
          url: "enumerations/host",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getEntitiesListDeferred, getEntitiesList = function(deferred) {
        var options = {
          throttle:false,
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getHostSelectionDeferred, getHostSelection = function(entity, deferred) {
        var options = {
          throttle:false,
          url: "configurations/variable/ConfigurationVariable/properties/BANK.DEFAULT.HOST?environmentId=OBDX",
          headers: {
            "X-Target-Unit": entity
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getSystemConfigurationDeferred, getSystemConfiguration = function(entity, deferred) {
        var options = {
          throttle:false,
          url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
          headers: {
            "X-Target-Unit": entity
          },
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
      getHostList: function() {
        Deferred = $.Deferred();
        getHostList(Deferred);
        return Deferred;
      },
      getEntitiesList: function() {
        getEntitiesListDeferred = $.Deferred();
        getEntitiesList(getEntitiesListDeferred);
        return getEntitiesListDeferred;
      },
      getHostSelection: function(entity) {
        getHostSelectionDeferred = $.Deferred();
        getHostSelection(entity, getHostSelectionDeferred);
        return getHostSelectionDeferred;
      },
      getSystemConfiguration: function(entity) {
        getSystemConfigurationDeferred = $.Deferred();
        getSystemConfiguration(entity, getSystemConfigurationDeferred);
        return getSystemConfigurationDeferred;
      }
    };
  };
  return new SystemConfigurationMenu();
});
