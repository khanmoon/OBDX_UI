define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var InitiateGuaranteeModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.TradeFinanceDetails = {
          "issueDate": null,
          "attachedDocuments": [],
          "branchId": null,
          "productId": null,
          "partyId": {
            "displayValue": null,
            "value": null
          },
          "beneId": null,
          "beneName": null,
          "beneAddress": {
            "line1": null,
            "line2": null,
            "line3": null,
            "country": null,
            "zipCode": null
          },
          "advisingBankCode": null,
          "beneContractReferenceNo": null,
          "contractAmount": {
            "currency": null,
            "amount": null
          },
          "guaranteeAmount": {
            "currency": null,
            "amount": null
          },
          "closureDate": null,
          "effectiveDate": null,
          "expiryDate": null,
          "expiryPlace": null,
          "chargingAccountId": {
            "displayValue": null,
            "value": null
          },
          "instruction": null,
          "name": null,
          "visibility": null,
          "state": null,
          "guaranteetype": null,
          "guaranteeStatus": null,
          "bankGuaranteeContract": [],
          "userId": null
        };
      };
    var initiateGuaranteeDeferred,
      initiateGuarantee = function(model, deferred) {
        var options = {
          url: "bankguarantees",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchProductDeferred, fetchProduct = function(deferred) {
        var options = {
          url: "products/bankguarantees",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchGuranteeTypeDeferred, fetchGuranteeType = function(deferred) {
        var options = {
          url: "bankguarantees/types",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      getAccountDetailDeferred, getAccountDetail = function(deferred) {
        var options = {
          url: "accounts/demandDeposit?taskCode=TF_N_CBG",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchBeniCountryDeferred, fetchBeniCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchBeneNameDeferred, fetchBeneName = function(deferred) {
        var options = {
          url: "beneficiaries",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
        var options = {
          url: "me/party/relations",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDeferred, fetchParty = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
        var options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "BICCode": code
          };
        baseService.fetch(options, params);
      },
      updateTemplateDeferred, updateTemplate = function(guaranteeId, model, deferred) {
        var params = {
          guaranteeId: guaranteeId
        };
        var options = {
          url: "bankguarantees/{guaranteeId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      deleteGuaranteeDeferred, deleteGuarantee = function(guaranteeId, deferred) {
        var options = {
            url: "bankguarantees/{bgId}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bgId": guaranteeId
          };
        baseService.remove(options, params);
      },
      deleteDocumentDeferred,
      deleteDocument = function(documentId, deferred) {
        var params = {
          documentId: documentId
        };
        var options = {
          url: "contents/{documentId}?transactionType=LC",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.remove(options, params);
      },
      getDocumentInfoDeffered,
      getDocumentInfo = function(documentId, ownerId, deferred) {
        var params = {
          documentId: documentId,
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      initiateGuarantee: function(model) {
        initiateGuaranteeDeferred = $.Deferred();
        initiateGuarantee(model, initiateGuaranteeDeferred);
        return initiateGuaranteeDeferred;
      },
      getAccountDetail: function() {
        getAccountDetailDeferred = $.Deferred();
        getAccountDetail(getAccountDetailDeferred);
        return getAccountDetailDeferred;
      },
      fetchBeneName: function() {
        fetchBeneNameDeferred = $.Deferred();
        fetchBeneName(fetchBeneNameDeferred);
        return fetchBeneNameDeferred;
      },
      fetchPartyRelations: function() {
        fetchPartyRelationsDeferred = $.Deferred();
        fetchPartyRelations(fetchPartyRelationsDeferred);
        return fetchPartyRelationsDeferred;
      },
      fetchParty: function(partyId) {
        fetchPartyDeferred = $.Deferred();
        fetchParty(partyId, fetchPartyDeferred);
        return fetchPartyDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      fetchProduct: function() {
        fetchProductDeferred = $.Deferred();
        fetchProduct(fetchProductDeferred);
        return fetchProductDeferred;
      },
      fetchGuranteeType: function() {
        fetchGuranteeTypeDeferred = $.Deferred();
        fetchGuranteeType(fetchGuranteeTypeDeferred);
        return fetchGuranteeTypeDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      updateTemplate: function(guaranteeId, model) {
        updateTemplateDeferred = $.Deferred();
        updateTemplate(guaranteeId, model, updateTemplateDeferred);
        return updateTemplateDeferred;
      },
      deleteGuarantee: function(guaranteeId) {
        deleteGuaranteeDeferred = $.Deferred();
        deleteGuarantee(guaranteeId, deleteGuaranteeDeferred);
        return deleteGuaranteeDeferred;
      },
      getDocumentInfo: function(documentId, ownerId) {
        getDocumentInfoDeffered = $.Deferred();
        getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);
        return getDocumentInfoDeffered;
      },
      deleteDocument: function(documentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(documentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      }
    };
  };
  return new InitiateGuaranteeModel();
});
