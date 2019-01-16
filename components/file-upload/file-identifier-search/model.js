define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fiSearchModel = function() {
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
      listFileIdentifiersDeferred, listFileIdentifiers = function(deferred, partyId) {
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
      fetchMeDeferred, fetchMeWithPartyDeferred,
      fetchMe = function(deferred) {

        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {

        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
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
      listFileIdentifiers: function(partyId) {
        listFileIdentifiersDeferred = $.Deferred();
        listFileIdentifiers(listFileIdentifiersDeferred, partyId);
        return listFileIdentifiersDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);
        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);
        return fetchMeWithPartyDeferred;
      }
    };
  };
  return new fiSearchModel();
});