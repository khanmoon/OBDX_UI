define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var OutwardGuaranteesModel = function() {
    var Model = function() {
      this.model = {
        "beneName": "",
        "applicantName": "",
        "fromAmount": "",
        "toAmount": "",
        "currency": "",
        "bgStatus": "",
        "issueDatefrom": "",
        "issueDateto": "",
        "expiryDatefrom": "",
        "expiryDateto": "",
        "bgNumber": ""
      };
    };
    var fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
        var options = {
          url: "me/party/relations",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBankGuaranteeDeferred, getBankGuarantees = function(model, deferred) {
        var options = {
          url: "bankguarantees?partyId=" + model.applicantName + "&beneName=" + model.beneName + "&bgStatus=" + model.bgStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&bgNumber=" + model.bgNumber,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBGDetailsDeferred, getBGDetails = function(bankGuaranteeId, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId
          };
        baseService.fetch(options, params);
      },
      fetchPDFDeferred, fetchPDF = function(model) {
        var options = {
          url: "bankguarantees?media=application/pdf&partyId=" + model.applicantName + "&beneName=" + model.beneName + "&bgStatus=" + model.bgStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&bgNumber=" + model.bgNumber
        };
        baseService.downloadFile(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getBankGuarantees: function(model) {
        getBankGuaranteeDeferred = $.Deferred();
        getBankGuarantees(model, getBankGuaranteeDeferred);
        return getBankGuaranteeDeferred;
      },
      fetchPartyRelations: function() {
        fetchPartyRelationsDeferred = $.Deferred();
        fetchPartyRelations(fetchPartyRelationsDeferred);
        return fetchPartyRelationsDeferred;
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchPDF: function(model) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(model, fetchPDFDeferred);
        return fetchPDFDeferred;
      },
      getBGDetails: function(bankGuaranteeId) {
        getBGDetailsDeferred = $.Deferred();
        getBGDetails(bankGuaranteeId, getBGDetailsDeferred);
        return getBGDetailsDeferred;
      }
    };
  };
  return new OutwardGuaranteesModel();
});