/*global define, console*/
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var userFIMapModel = function() {
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
      listAllFIDeferred, listAllFI = function(deferred, partyId) {
        var options = {
            url: "fileUploads/parties/{partyId}/fileIdentifiers",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "partyId": partyId
          };
        baseService.fetch(options, params);
      },
      fetchUserDetailsDeferred, fetchUserDetails = function(deferred, userId) {
        var options = {
            url: "users/{userId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userId": userId
          };
        baseService.fetch(options, params);
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
      listAllFI: function(partyId) {
        listAllFIDeferred = $.Deferred();
        listAllFI(listAllFIDeferred, partyId);
        return listAllFIDeferred;
      },
      fetchUserDetails: function(userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred, userId);
        return fetchUserDetailsDeferred;
      }
    };
  };
  return new userFIMapModel();
});