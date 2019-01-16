define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var userFIMapModel = function() {
    var Model = function() {
        this.FIMapPaylaod = {
          userId: null,
          partyId: null,
          fileIdentifers: []
        };
      },
      baseService = BaseService.getInstance(),
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
      listMappedFIDeferred, listMappedFI = function(deferred, userId, partyId) {
        var options = {
            url: "fileUploads/parties/{partyId}/users/{userId}/userFileIdentifiersMappings",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userId": userId,
            "partyId": partyId.value
          };
        baseService.fetch(options, params);
      },
      listMappedFIAdminDeferred, listMappedFIAdmin = function(deferred, userId) {
        var options = {
            url: "fileUploads/parties/ADMIN/users/{userId}/userFileIdentifiersMappings",
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
            "partyId": partyId.value
          };
        baseService.fetch(options, params);
      },
      listAllFIAdminDeferred, listAllFIAdmin = function(deferred) {
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
      },
      updateMapAdminDeferred, updateMapAdmin = function(deferred, payload, userId) {
        var options = {
            url: "fileUploads/parties/ADMIN/users/{userId}/userFileIdentifiersMappings",
            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "userId": userId
          };
        baseService.update(options, params);
      },
      updateMapDeferred, updateMap = function(deferred, payload, userId, partyId) {
        var options = {
            url: "fileUploads/parties/{partyId}/users/{userId}/userFileIdentifiersMappings",
            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "userId": userId,
            "partyId": partyId.value
          };
        baseService.update(options, params);
      };
    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
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
      listMappedFI: function(userId, partyId) {
        listMappedFIDeferred = $.Deferred();
        listMappedFI(listMappedFIDeferred, userId, partyId);
        return listMappedFIDeferred;
      },
      listMappedFIAdmin: function(userId) {
        listMappedFIAdminDeferred = $.Deferred();
        listMappedFIAdmin(listMappedFIAdminDeferred, userId);
        return listMappedFIAdminDeferred;
      },
      listAllFI: function(partyId) {
        listAllFIDeferred = $.Deferred();
        listAllFI(listAllFIDeferred, partyId);
        return listAllFIDeferred;
      },
      listAllFIAdmin: function() {
        listAllFIAdminDeferred = $.Deferred();
        listAllFIAdmin(listAllFIAdminDeferred);
        return listAllFIAdminDeferred;
      },
      updateMap: function(model, userId, partyId) {
        updateMapDeferred = $.Deferred();
        updateMap(updateMapDeferred, model, userId, partyId);
        return updateMapDeferred;
      },
      updateMapAdmin: function(model, userId) {
        updateMapAdminDeferred = $.Deferred();
        updateMapAdmin(updateMapAdminDeferred, model, userId);
        return updateMapAdminDeferred;
      }
    };
  };
  return new userFIMapModel();
});
