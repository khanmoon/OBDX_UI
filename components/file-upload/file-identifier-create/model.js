define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fiRegistrationModel = function() {
    var Model = function() {
        this.partyFiRegistrationModel = {
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
      listTemplatesDeferred,
      listTemplates = function(deferred) {
        var options = {
          url: "fileUploads/templates?userType=CUSTOMER",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      listAdminTemplatesDeferred,
      listAdminTemplates = function(deferred) {
        var options = {
          url: "fileUploads/templates?userType=ADMIN",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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

      },

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
      registerFiPaymentDeferred, registerFiPayment = function(deferred, model, partyId) {
        var options = {
            url: "fileUploads/parties/{partyId}/fileIdentifiers",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "partyId": partyId
          };
        baseService.add(options, params);
      };
    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      listTemplates: function() {
        listTemplatesDeferred = $.Deferred();
        listTemplates(listTemplatesDeferred);
        return listTemplatesDeferred;
      },
      listAdminTemplates: function() {
        listAdminTemplatesDeferred = $.Deferred();
        listAdminTemplates(listAdminTemplatesDeferred);
        return listAdminTemplatesDeferred;
      },
      listDebitAccountNumbers: function(partyId) {
        listDebitAccountNumbersDeferred = $.Deferred();
        listDebitAccountNumbers(listDebitAccountNumbersDeferred, partyId);
        return listDebitAccountNumbersDeferred;
      },

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
      registerFiPayment: function(model, partyId) {
        registerFiPaymentDeferred = $.Deferred();
        registerFiPayment(registerFiPaymentDeferred, model, partyId);
        return registerFiPaymentDeferred;
      }
    };
  };
  return new fiRegistrationModel();
});
