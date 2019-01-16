define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var adminSearchModel = function() {
    var baseService = BaseService.getInstance(),
      getApprovalTypesDeferred, getApprovalTypes = function(deferred) {
        var options = {
          url: "enumerations/approvalTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTransactionTypesDeferred, getTransactionTypes = function(deferred) {
        var options = {
          url: "enumerations/transactionTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      adminCreateDeferred, adminCreate = function(deferred) {
        var options = {
          url: "fileUploads/parties/ADMIN/fileIdentifiers",
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
      getApprovalTypes: function() {
        getApprovalTypesDeferred = $.Deferred();
        getApprovalTypes(getApprovalTypesDeferred);
        return getApprovalTypesDeferred;
      },
      getTransactionTypes: function() {
        getTransactionTypesDeferred = $.Deferred();
        getTransactionTypes(getTransactionTypesDeferred);
        return getTransactionTypesDeferred;
      },
      adminCreate: function() {
        adminCreateDeferred = $.Deferred();
        adminCreate(adminCreateDeferred);
        return adminCreateDeferred;
      }

    };

  };
  return new adminSearchModel();
});
