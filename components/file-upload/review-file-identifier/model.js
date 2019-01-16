define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fuidViewModel = function() {
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
      getFileTypesDeferred, getFileTypes = function(deferred) {
        var options = {
          url: "enumerations/fileTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getAccountingTypesDeferred, getAccountingTypes = function(deferred) {
        var options = {
          url: "enumerations/accountingTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getFileFormatTypesDeferred, getFileFormatTypes = function(deferred) {
        var options = {
          url: "enumerations/formatTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchTemplateDetailsDeferred, fetchTemplateDetails = function(deferred, templateId) {
        var options = {
            url: "fileUploads/templates/{templateId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "templateId": templateId
          };
        baseService.fetch(options, params);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
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
      getFileFormatTypes: function() {
        getFileFormatTypesDeferred = $.Deferred();
        getFileFormatTypes(getFileFormatTypesDeferred);
        return getFileFormatTypesDeferred;
      },
      getAccountingTypes: function() {
        getAccountingTypesDeferred = $.Deferred();
        getAccountingTypes(getAccountingTypesDeferred);
        return getAccountingTypesDeferred;
      },
      getTransactionTypes: function() {
        getTransactionTypesDeferred = $.Deferred();
        getTransactionTypes(getTransactionTypesDeferred);
        return getTransactionTypesDeferred;
      },
      getFileTypes: function() {
        getFileTypesDeferred = $.Deferred();
        getFileTypes(getFileTypesDeferred);
        return getFileTypesDeferred;
      },
      fetchTemplateDetails: function(templateId) {
        fetchTemplateDetailsDeferred = $.Deferred();
        fetchTemplateDetails(fetchTemplateDetailsDeferred, templateId);
        return fetchTemplateDetailsDeferred;
      },
      fetchPartyDetails: function(url) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(url, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      }
    };
  };
  return new fuidViewModel();
});