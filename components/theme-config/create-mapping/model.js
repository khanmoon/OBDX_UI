define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var CreateMappingModel = function () {
    var brandVariablesDeferred, getBrandVariables = function (deferred) {
        var options = {
          url: "themes",
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      getMappingModel = function (brandId, mappedValue, mappedType) {
        return {
          brandId: brandId || null,
          mappedValue: mappedValue || null,
          mappedType: mappedType || null
        };
      },
      createMappingDeferred,
      createMapping = function (payload, deferred) {
        var options = {
          url: "brands/mapping",
          data: payload,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      getEntitiesDeferred, fetchEntities = function (deferred) {
        var options = {
          url: "entities",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      getEnterpriseRolesDeferred, getEnterpriseRoles = function (deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      checkUserExists = function (userType) {
        var options = {
          url: "users/"+userType
        };
        return baseService.fetch(options);
      };
    return {
      getBrandVariables: function () {
        brandVariablesDeferred = $.Deferred();
        getBrandVariables(brandVariablesDeferred);
        return brandVariablesDeferred;
      },
      getTargetLinkageModel: function (brandId, mappedValue, mappedType) {
        return new getMappingModel(brandId, mappedValue, mappedType);
      },
      createMapping: function (payload) {
        createMappingDeferred = $.Deferred();
        createMapping(payload, createMappingDeferred);
        return createMappingDeferred;
      },
      fetchEntities: function () {
        getEntitiesDeferred = $.Deferred();
        fetchEntities(getEntitiesDeferred);
        return getEntitiesDeferred;
      },
      getEnterpriseRoles: function () {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);
        return getEnterpriseRolesDeferred;
      },
      checkUserExists:function(userName){
        return checkUserExists(userName);
      }
    };
  };
  return new CreateMappingModel();
});