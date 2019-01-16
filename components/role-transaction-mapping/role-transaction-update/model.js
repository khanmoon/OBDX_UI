define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RoleTransactionUpdateModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.applicationRoleDTO = {
        "applicationRoleId" : null,
        "applicationRoleName": null,
        "applicationRoleDescription": null,
        "applicationRoleDisplayName": null,
        "enterpriseRole": null,
        "accessPointType": null,
        "accessPointScope": null,
        "version":null
      };
      this.modules = [];
      this.accessTransactionMapDTO = [];
    };

    var fetchEntitlementsDeferred, fetchEntitlements = function(searchParams, deferred) {
      var modules;
      if (searchParams.module.length === 1)
        modules = "module=" + searchParams.module[0];
      else {
        for (var i = 0; i < searchParams.module.length; i++)
          modules = "module=" + searchParams.module[i] + "&" + modules;
      }
      var options = {
        url: "entitlementGroups?" + modules,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, searchParams);
    };

    var updateRoleTransactionDeferred, updateRoleTransaction = function(payload, deferred) {
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
      baseService.update(options);
    };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchEntitlements: function(searchParams) {
        fetchEntitlementsDeferred = $.Deferred();
        fetchEntitlements(searchParams, fetchEntitlementsDeferred);
        return fetchEntitlementsDeferred;
      },
      updateRoleTransaction: function(payload) {
        updateRoleTransactionDeferred = $.Deferred();
        updateRoleTransaction(payload,updateRoleTransactionDeferred);
        return updateRoleTransactionDeferred;
      }
    };
  };
  return new RoleTransactionUpdateModel();
});
