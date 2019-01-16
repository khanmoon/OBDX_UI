define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var InitiateCollectionModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.CollectionDetails = {
          "acceptanceDate": null,
          "advices": null,
          "bankRefNo": null,
          "bankName": null,
          "bankAddress": {
            "line1": null,
            "line2": null,
            "line3": null,
            "line4": null,
            "country": null
          },
          "customerRefNo": null,
          "customerId": null,
          "counterpartyId": null,
          "draweePartyId": {
            "displayValue": null,
            "value": null
          },
          "lcCustomer": {
            "displayValue": null,
            "value": null
          },
          "purchaseAmount": {
            "amount": null,
            "currency": null
          },
          "amount": {
            "amount": null,
            "currency": null
          },
          "applicationDate": null,
          "attachedDocuments": [],
          "baseDateCode": null,
          "baseDateDescription": null,
          "billOperation": null,
          "billType": "EXPORT",
          "branchId": null,
          "chargesAccount": {
            "displayValue": null,
            "value": null
          },
          "collectingBankCharges": {
            "amount": null,
            "currency": null
          },
          "confirmingBankCode": null,
          "contractStatus": null,
          "counterPartyName": null,
          "createdBy": null,
          "counterPartyAddress": {
            "line1": null,
            "line2": null,
            "line3": null,
            "country": null,
            "zipCode": null
          },
          "daysFrom": null,
          "discrepancies": [],
          "document": [],
          "docAttached": false,
          "id": null,
          "incoterm": null,
          "instructions": [],
          "lastUpdatedDate": null,
          "lcRefNo": null,
          "lcReferenceOur": null,
          "lcReferenceTheir": null,
          "lodgementDate": null,
          "maturityDate": null,
          "name": null,
          "outstandingAmount": {
            "amount": null,
            "currency": null
          },
          "partyId": {
            "displayValue": null,
            "value": null
          },
          "productId": null,
          "productName": null,
          "remarks": null,
          "remittingBankCharges": {
            "amount": null,
            "currency": null
          },
          "remittingBankCode": null,
          "settlementDate": null,
          "shipmentDetails": {
            "description": null,
            "destination": null,
            "goodsCode": null,
            "source": null,
            "dischargePort": null,
            "loadingPort": null
          },
          "goods":[],
          "state": null,
          "swiftId": null,
          "swiftMessages": null,
          "tenor": null,
          "transactionDate": null,
          "userId": null,
          "userName": null,
          "visibility": "PRIVATE"
        };

      };
    var initiateCollectionDeferred,
      initiateCollection = function(model, deferred) {
        var options = {
          url: "bills",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      getLcDetailsDeferred, getLcDetails = function(lcNumber, deferred) {
        var options = {
            url: "letterofcredits/{lcNumber}?forBillsCreation=true",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "lcNumber": lcNumber
          };
        baseService.fetch(options, params);
      },
      fetchBeneNameDeferred, fetchBeneName = function(deferred) {
        var options = {
          url: "beneficiaries",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
        var options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "BICCode": code
          };
        baseService.fetch(options, params);
      },
      updateTemplateDeferred, updateTemplate = function(billId, model, deferred) {
        var params = {
          billId: billId
        };
        var options = {
          url: "bills/{billId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      deleteCollectionDeferred, deleteCollection = function(id, deferred) {
        var options = {
            url: "bills/{Id}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "Id": id
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
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options, params);
      },
      fetchGoodsDeferred, fetchGoods = function(deferred) {
        var options = {
          url: "letterofcredits/goods",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      getLcDetails: function(lcNumber) {
        getLcDetailsDeferred = $.Deferred();
        getLcDetails(lcNumber, getLcDetailsDeferred);
        return getLcDetailsDeferred;
      },
      fetchBeneName: function() {
        fetchBeneNameDeferred = $.Deferred();
        fetchBeneName(fetchBeneNameDeferred);
        return fetchBeneNameDeferred;
      },
      initiateCollection: function(model) {
        initiateCollectionDeferred = $.Deferred();
        initiateCollection(model, initiateCollectionDeferred);
        return initiateCollectionDeferred;
      },
      deleteCollection: function(id) {
        deleteCollectionDeferred = $.Deferred();
        deleteCollection(id, deleteCollectionDeferred);
        return deleteCollectionDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      updateTemplate: function(billId, model) {
        updateTemplateDeferred = $.Deferred();
        updateTemplate(billId, model, updateTemplateDeferred);
        return updateTemplateDeferred;
      },
      deleteDocument: function(documentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(documentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      },
      fetchGoods: function() {
        fetchGoodsDeferred = $.Deferred();
        fetchGoods(fetchGoodsDeferred);
        return fetchGoodsDeferred;
      }
    };
  };
  return new InitiateCollectionModel();
});
