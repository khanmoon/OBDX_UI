define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ApplicationRoleReadModel = function() {
    var baseService = BaseService.getInstance();
    this.getNewModel = function() {
      return new this.Model();
    };
    var fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
      var options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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
    var fetchAccessDeferred, fetchAccess = function(accessType, deferred) {
      var options = {
        url: "accessPoints?accessType={accessType}",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, accessType);
    };
      var fetchRoleTransactionMappingDeferred, fetchRoleTransactionMapping = function(appRoleId,deferred) {
      var options = {
        url: "applicationRolePolicies/"+appRoleId+"?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
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
    var fetchScopesDeferred, fetchScopes = function(deferred) {
     var options = {
       url: "accessPointScopes",
       success: function(data) {
         deferred.resolve(data);
       },
       error: function(data) {
         deferred.reject(data);
       }
     };
     baseService.fetch(options);
   };
   var deleteAccessDeferred,
   deleteAccess = function(appRoleId,deferred) {
     var options = {
      url: "applicationRolePolicies/"+appRoleId+"?isLocal=true",
       success: function(data, status, jqXhr) {
         deferred.resolve(data, status, jqXhr);
       }
     };
     baseService.remove(options);
   };
      return {
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
          fetchAccessPointType: function() {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);
        return fetchAccessPointTypeDeferred;
      },
      fetchAccess: function(searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);
        return fetchAccessDeferred;
      },
      fetchModuleName: function() {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);
        return fetchModuleNameDeferred;
      },
      fetchRoleTransactionMapping: function(appRoleId) {
        fetchRoleTransactionMappingDeferred = $.Deferred();
        fetchRoleTransactionMapping(appRoleId,fetchRoleTransactionMappingDeferred);
        return fetchRoleTransactionMappingDeferred;
      },
      fetchScopes: function() {
        fetchScopesDeferred = $.Deferred();
        fetchScopes(fetchScopesDeferred);
        return fetchScopesDeferred;
      },
      deleteAccess: function(appRoleId) {
        deleteAccessDeferred = $.Deferred();
        deleteAccess(appRoleId, deleteAccessDeferred);
        return deleteAccessDeferred;
      }
    };
  };
  return new ApplicationRoleReadModel();
});
