define([
  "baseService",
  "jquery"
], function(BaseService, $) {
  "use strict";
  var MapTransactionModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.applicationRoleDTO = {
          "applicationRoleName": null,
          "applicationRoleDescription": null,
          "applicationRoleDisplayName": null,
          "enterpriseRole": null,
          "accessPointType": null,
          "accessPointScope": null
        };
        this.modules = [];
        this.accessTransactionMapDTO = [];
    };

    var fetchEntitlementsDeferred, fetchEntitlements = function(searchParams, deferred) {
      var modules;
      if(searchParams.module.length===1)
      modules = "module=" + searchParams.module[0];
      else {
        for (var i = 0; i < searchParams.module.length; i++)
        modules = "module=" + searchParams.module[i]+"&" +modules;
      }
      var options = {
        url: "entitlementGroups?" + modules,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, searchParams);
    };

    var fetchModuleNameDeferred, fetchModuleName = function(deferred) {
      var options = {
        url: "enumerations/entitlementCategory",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchAccessPointTypeDeferred, fetchAccessPointType = function(deferred) {
      var options = {
        url: "enumerations/accessPointType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var createApplicationRolePolicyDeferred, createApplicationRolePolicy = function(payload, deferred) {
      var options = {
        url: "applicationRolePolicies",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchModuleName: function() {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);
        return fetchModuleNameDeferred;
      },
      fetchEntitlements: function(searchParams) {
        fetchEntitlementsDeferred = $.Deferred();
        fetchEntitlements(searchParams, fetchEntitlementsDeferred);
        return fetchEntitlementsDeferred;
      },
      createApplicationRolePolicy: function(payload) {
        createApplicationRolePolicyDeferred = $.Deferred();
        createApplicationRolePolicy(payload, createApplicationRolePolicyDeferred);
        return createApplicationRolePolicyDeferred;
      },
      fetchAccessPointType: function() {
          fetchAccessPointTypeDeferred = $.Deferred();
          fetchAccessPointType(fetchAccessPointTypeDeferred);
          return fetchAccessPointTypeDeferred;
      }
    };
  };
  return new MapTransactionModel();
});
