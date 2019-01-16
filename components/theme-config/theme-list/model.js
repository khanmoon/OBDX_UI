define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ThemeListModel = function() {
    var Deferred, getModuleThemes = function(role, deferred) {
        var options = {
          url: "brands",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          role: role
        });
      },
      deleteMappingDeferred, deleteMapping = function(mappedType, mappedValue, deferred) {
        var options = {
          url: "brands/mapping?mappingType={mappingType}&mappingValue={mappingValue}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options, {
          mappingType: mappedType,
          mappingValue: mappedValue
        });
      },
      getTargetLinkageModel = function() {
        var themeObj = {};
        themeObj = {
          brandName: null,
          brandDescription: null,
          role: null,
          json: {
            "header-bg-color": null,
            "header-title-color": null,
            "bg-color": null,
            "form-bg-color": null
          },
          zip: null
        };
        return themeObj;
      },
      applyThemeDeferred, applyTheme = function(brandId, role, deferred) {
        var options = {
          url: "brands/{brandId}/deploy",
          contentType: "text/plain",
          data: role,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.add(options, {
          "brandId": brandId
        });
      },
      getRolesDeferred, getRoles = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      brandMappingsDeferred, brandMapping = function(mappingType, deferred) {
        var options = {
          url: "brands/mapping?mappingType=" + mappingType,
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
      };
    return {
      getModuleThemes: function(role) {
        Deferred = $.Deferred();
        getModuleThemes(role, Deferred);
        return Deferred;
      },
      getTargetLinkageModel: function() {
        return new getTargetLinkageModel();
      },
      applyTheme: function(brandId, role) {
        applyThemeDeferred = $.Deferred();
        applyTheme(brandId, role, applyThemeDeferred);
        return applyThemeDeferred;
      },
      getRoles: function() {
        getRolesDeferred = $.Deferred();
        getRoles(getRolesDeferred);
        return getRolesDeferred;
      },
      getMappings: function(mappingType) {
        brandMappingsDeferred = $.Deferred();
        brandMapping(mappingType, brandMappingsDeferred);
        return brandMappingsDeferred;
      },
      fetchEntities: function() {
        getEntitiesDeferred = $.Deferred();
        fetchEntities(getEntitiesDeferred);
        return getEntitiesDeferred;
      },
      deleteMapping: function(mappedType, mappedValue) {
        deleteMappingDeferred = $.Deferred();
        deleteMapping(mappedType, mappedValue, deleteMappingDeferred);
        return deleteMappingDeferred;
      }
    };
  };
  return new ThemeListModel();
});