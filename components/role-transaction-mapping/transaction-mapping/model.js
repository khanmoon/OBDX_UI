define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var RoleTransactionMappingModel = function() {
    var baseService = BaseService.getInstance();


    var Model = function() {
      this.applicationRoleDTO = {
          "applicationRoleName": null,
          "applicationRoleDescription": null,
          "applicationRoleDisplayName": null,
          "enterpriseRole": null,
          "accessPointType": null
        };
        this.modules = [];
        this.accessTransactionMapDTO = [{

        }];
    };

    var fetchEntitlementsDeferred, fetchEntitlements = function(searchParams, deferred) {
      var options = {
        url: "entitlementGroups?module={module}&category={categoryName}&entitlement={entitlementName}",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, searchParams);
    };


    var createApplicationRolePolicyDeferred, createApplicationRolePolicy = function(payload, deferred) {
      var options = {
        url: "applicationRolePolicies",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.add(options);
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
      createApplicationRolePolicy: function(payload) {
        createApplicationRolePolicyDeferred = $.Deferred();
        createApplicationRolePolicy(payload, createApplicationRolePolicyDeferred);
        return createApplicationRolePolicyDeferred;
      }
    };
  };
  return new RoleTransactionMappingModel();
});
