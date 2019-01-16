define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance(),
    logOut = function() {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }
      var options = {
        url: "session",
        success: function() {
          var form = document.createElement("form");
          form.action = "/logout.";
          document.body.appendChild(form);
          form.submit();
        }
      };
      baseService.remove(options);
    };
  var SystemConfigurationMenu = function() {
    var Model = function() {
      this.ConfigurationItem = {
        "version": "",
        "id": "",
        "handler": "",
        "inputDTOs": []
      };
      this.configuration = {
        "id": "",
        "name": "",
        "configurationItemDTOs": []
      };
      this.finalPayLoad = {
        "id": "",
        "name": "",
        "maxOccurance": 1,
        "configurationDTOs": []
      };
    };
    var Deferred, getMenuList = function(host, entityName, deferred) {
      var hostName = "DAY_0_" + host;
      var options = {
        throttle: false,
        url: "configurations/wizard/" + hostName,
        headers: {
          "X-Target-Unit": entityName
        },
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var getDynamicModuleMenuDeferred, getDynamicModuleMenu = function(determinantValue, deferred) {

      var options = {
        throttle: false,
        url: "configurations/variable/mandatory",
        headers: {
          "X-Target-Unit": determinantValue
        },
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var createConfigurationDeferred, createConfiguration = function(host, entityName, entityFlag, data, deferred) {
      var hostName = "DAY_0_" + host;
      var options = {
        url: "configurations/wizard/" + hostName,
        headers: {
          "X-Target-Unit": entityName
        },
        data: data,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };
      data = JSON.parse(data);
      if (entityFlag) {
        baseService.add(options);
      } else {
        baseService.update(options);
      }
    };
    var createEntityDeferred, createEntity = function(data, deferred) {
      var options = {
        url: "entities",
        headers: {
          "X-Target-Unit": data.businessUnitCode
        },
        data: data,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.add(options);
    };
    var createEntityConfigurationDeferred, createEntityConfiguration = function(payload, deferred) {
      var options = {
        url: "configurations/base/BaseConfig/properties",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.update(options);
    };
    var fetchSystemConfigurationDetailsDeferred, fetchSystemConfigurationDetails = function(entity, deferred) {
      var options = {
        url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
        headers: {
          "X-Target-Unit": entity
        },
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      logOut: function() {
        logOut();
      },
      getNewModel: function() {
        return new Model();
      },
      getMenuList: function(host, entityName) {
        Deferred = $.Deferred();
        getMenuList(host, entityName, Deferred);
        return Deferred;
      },
      getDynamicModuleMenu: function(host) {
        getDynamicModuleMenuDeferred = $.Deferred();
        getDynamicModuleMenu(host, getDynamicModuleMenuDeferred);
        return getDynamicModuleMenuDeferred;
      },
      createConfiguration: function(host, entityName, entityFlag, payload) {
        createConfigurationDeferred = $.Deferred();
        createConfiguration(host, entityName, entityFlag, payload, createConfigurationDeferred);
        return createConfigurationDeferred;
      },
      createEntityConfiguration: function(payload) {
        createEntityConfigurationDeferred = $.Deferred();
        createEntityConfiguration(payload, createEntityConfigurationDeferred);
        return createEntityConfigurationDeferred;
      },
      createEntity: function(payload) {
        createEntityDeferred = $.Deferred();
        createEntity(payload, createEntityDeferred);
        return createEntityDeferred;
      },
      fetchSystemConfigurationDetails: function(entity) {
        fetchSystemConfigurationDetailsDeferred = $.Deferred();
        fetchSystemConfigurationDetails(entity, fetchSystemConfigurationDetailsDeferred);
        return fetchSystemConfigurationDetailsDeferred;
      }
    };
  };
  return new SystemConfigurationMenu();
});
