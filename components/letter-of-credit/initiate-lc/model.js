define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var CreateTradeFinanceModel = function() {
    var params, baseService = BaseService.getInstance(),
      Model = function() {
        this.TradeFinanceDetails = {
          "amount": {
            "currency": null,
            "amount": null
          },
          "availableWith": null,
          "advisingBankCode": null,
          "attachedDocuments": [],
          "applicationDate": null,
          "versionNo": null,
          "counterPartyName": null,
          "counterPartyAddress": {
            "line1": null,
            "line2": null,
            "line3": null,
            "country": null,
            "zipCode": null
          },
          "chargesFromBeneficiary": null,
          "beneId": null,
          "billingDrafts": [],
          "branchId": null,
          "chargingAccountId": {
            "displayValue": null,
            "value": null
          },
          "confirmationInstruction": null,
          "confirmingBankCode": null,
          "confirmed": true,
          "customerReferenceNo": null,
          "deliveryMode": "SWIFT",
          "document": [],
          "documentPresentationDays": null,
          "draftsRequired": "false",
          "drawingStatus": null,
          "expiryDate": null,
          "expiryPlace": null,
          "exposure": {
            "currency": null,
            "amount": 0
          },
          "incoterm": {
            "code": null,
            "description": null
          },
          "instructionDescription": null,
          "irRevocable": false,
          "name": null,
          "negotiatingBankCode": null,
          "nominatedBankCode": null,
          "partyId": {
            "displayValue": null,
            "value": null
          },
          "paymentClause": null,
          "paymentType": null,

          "productId": null,
          "reimbursingBankCode": null,
          "revolving": "false",
          "revolvingDetails": {
            "frequency": null,
            "autoReinstatement": "false",
            "cumulativeFrequency": "true",
            "reinstatementDate": null,
            "type": "VALUE",
            "frequencyUnit": "DAYS"
          },
          "shipmentDetails": {
            "date": null,
            "description": null,
            "destination": null,
            "dischargePort": null,
            "goodsCode": null,
            "id": null,
            "loadingPort": null,
            "partial": "false",
            "period": null,
            "source": null,
            "transShipment": "false"
          },
          "goods":[],
          "state": "TEMPLATE",
          "status": null,
          "swiftId": null,
          "toleranceUnder": null,
          "toleranceAbove": null,
          "toleranceType": null,
          "transferable": "false",
          "transferableType": null,
          "visibility": "PRIVATE"
        };

      };
    var initiateLCDeferred, getAccountDetailDeferred,
      initiateLC = function(model, deferred) {
        var options = {
          url: "letterofcredits",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
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
      fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
        var options = {
          url: "me/party/relations",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDeferred, fetchParty = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      deleteLCDeferred, deleteLC = function(id, deferred) {
        var options = {
            url: "letterofcredits/{Id}",
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
      fetchProductDeferred, fetchProduct = function(deferred) {
        var options = {
          url: "products/letterofcredits",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchGoodsDeferred, fetchGoods = function(deferred) {
        var options = {
          url: "letterofcredits/goods",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchIncotermDeferred, fetchIncoterm = function(deferred) {
        var options = {
          url: "letterofcredits/incoterms",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBeniCountryDeferred, fetchBeniCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAccountDetail = function(deferred) {
        var options = {
          url: "accounts/demandDeposit?taskCode=TF_N_CLC",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
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
      getDocumentInfoDeffered,
      getDocumentInfo = function(documentId, ownerId, deferred) {
        var params = {
          documentId: documentId,
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      updateTemplateDeferred, updateTemplate = function(letterOfCreditId, model, deferred) {
        var params = {
          letterOfCreditId: letterOfCreditId
        };
        var options = {
          url: "letterofcredits/{letterOfCreditId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
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
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      initiateLC: function(model) {
        initiateLCDeferred = $.Deferred();
        initiateLC(model, initiateLCDeferred);
        return initiateLCDeferred;
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
      fetchIncoterm: function() {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(fetchIncotermDeferred);
        return fetchIncotermDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      deleteLC: function(id) {
        deleteLCDeferred = $.Deferred();
        deleteLC(id, deleteLCDeferred);
        return deleteLCDeferred;
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
      getDocumentInfo: function(documentId, ownerId) {
        getDocumentInfoDeffered = $.Deferred();
        getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);
        return getDocumentInfoDeffered;
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
      },
      updateTemplate: function(letterOfCreditId, model) {
        updateTemplateDeferred = $.Deferred();
        updateTemplate(letterOfCreditId, model, updateTemplateDeferred);
        return updateTemplateDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      }
    };
  };
  return new CreateTradeFinanceModel();
});
