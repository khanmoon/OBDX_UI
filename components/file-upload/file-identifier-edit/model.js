define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var FUIDModel = function() {
    var Model = function() {
        this.FUIDDetailsUpdateModel = {
          description: null,
          partyId: null,
          templateId: null,
          fileIdentifier: null,
          approvalType: null,
          partialProcessingTolerance: null,
          maxNoOfRecords: null,
          debitAccountNumber: null
        };
      },
      baseService = BaseService.getInstance(),
      updateFUIDDetailsDeferred, updateFUIDDetails = function(deferred, model, fileIdentifier, partyId) {
        var options = {
            url: "fileUploads/parties/{partyId}/fileIdentifiers/{fileIdentifier}",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "partyId": partyId,
            "fileIdentifier": fileIdentifier
          };
        baseService.update(options, params);
      },

      listDebitAccountNumbersDeferred, listDebitAccountNumbers = function(deferred, partyId) {
        var options = {

            url: "accountAccess?partyId={partyId}&accountType=CSA",
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

      };
    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      updateFUIDDetails: function(model, fileIdentifier, partyId) {
        updateFUIDDetailsDeferred = $.Deferred();
        updateFUIDDetails(updateFUIDDetailsDeferred, model, fileIdentifier, partyId);
        return updateFUIDDetailsDeferred;
      },

      listDebitAccountNumbers: function(partyId) {
        listDebitAccountNumbersDeferred = $.Deferred();
        listDebitAccountNumbers(listDebitAccountNumbersDeferred, partyId);
        return listDebitAccountNumbersDeferred;
      }

    };
  };
  return new FUIDModel();
});