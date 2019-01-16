define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SystemConfigurationMenu = function() {
    var getEntitiesListDeferred, getEntitiesList = function(deferred) {
        var options = {
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchTimezonesDeferred,
      fetchTimezones = function(deferred) {
        var options = {
          url: "timezone",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fireBatchDeferred,
      fireBatch = function(deferred, subRequestList, type) {
        var options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {type: type}, subRequestList);
      },
      saveTimeZoneDeferred,
      saveTimeZone = function(payload, entityId, deferred) {
        var options = {
          url: "configurations/variable/dayoneconfig/properties",
          headers: {
            "X-Target-Unit": entityId
          },
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.update(options);
      },

      saveEntitiesDeferred, saveEntities = function(data, entityId, deferred) {
        var params = {
            entityId: entityId
          },
          options = {
            url: "entities/{entityId}",
            headers: {
              "X-Target-Unit": entityId
            },
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        data = JSON.parse(data);
        if (data.auditSequence) {
          baseService.update(options, params);
        } else {
          options.url = "entities";
          baseService.add(options);
        }

      },
      replicateEntityDeferred, replicateEntity = function(determinantValue, deferred) {
        var options = {
          url: "configurations/multiEntity",
          headers: {
            "X-Target-Unit": determinantValue
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSystemConfigurationDetailsDeferred, fetchSystemConfigurationDetails = function(deferred) {
        var options = {
          url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      createEntityDeferred, createEntity = function(data, deferred) {
        var options = {
          url: "entities",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
      };

    return {
      getEntitiesList: function() {
        getEntitiesListDeferred = $.Deferred();
        getEntitiesList(getEntitiesListDeferred);
        return getEntitiesListDeferred;
      },
      saveEntities: function(data, entityId) {
        saveEntitiesDeferred = $.Deferred();
        saveEntities(data, entityId, saveEntitiesDeferred);
        return saveEntitiesDeferred;
      },
      saveTimeZone: function(payload, entityId) {
        saveTimeZoneDeferred = $.Deferred();
        saveTimeZone(payload, entityId, saveTimeZoneDeferred);
        return saveTimeZoneDeferred;
      },
      getTimezones: function() {
        fetchTimezonesDeferred = $.Deferred();
        fetchTimezones(fetchTimezonesDeferred);
        return fetchTimezonesDeferred;
      },
      fireBatch: function(subRequestList, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, subRequestList, type);
          return fireBatchDeferred;
      },
      replicateEntity: function(determinantValue) {
        replicateEntityDeferred = $.Deferred();
        replicateEntity(determinantValue, replicateEntityDeferred);
        return replicateEntityDeferred;
      },
      fetchSystemConfigurationDetails: function() {
        fetchSystemConfigurationDetailsDeferred = $.Deferred();
        fetchSystemConfigurationDetails(fetchSystemConfigurationDetailsDeferred);
        return fetchSystemConfigurationDetailsDeferred;
      },
      createEntity: function(payload) {
        createEntityDeferred = $.Deferred();
        createEntity(payload, createEntityDeferred);
        return createEntityDeferred;
      }
    };
  };
  return new SystemConfigurationMenu();
});
