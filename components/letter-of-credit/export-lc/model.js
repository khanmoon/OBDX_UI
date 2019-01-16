define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ExportLCModel = function() {
    var Model = function() {
      this.model = {
        "lcType": "Export",
        "beneName": [],
        "lcStatus": [],
        "fromAmount": "",
        "toAmount": "",
        "status": [],
        "issueDatefrom": "",
        "issueDateto": "",
        "expiryDatefrom": "",
        "expiryDateto": "",
        "lcNumber": "",
        "applicantName": "",
        "shipmentDateFrom": "",
        "expiryStatus": [],
        "shipmentDateTo": ""
      };
    };

    var baseService = BaseService.getInstance();
    var fetchPDFDeferred, fetchPDF = function(model) {
      var options = {
        url: "letterofcredits?media=application/pdf&lcType=" + model.lcType + "&applicantName=" + model.applicantName + "&lcNumber=" + model.lcNumber + "&partyId=" + model.beneName + "&lcStatus=" + model.lcStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&status=" + model.status + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&shipmentDatefrom=" + model.shipmentDateFrom + "&shipmentDateto=" + model.shipmentDateTo + "&expiryStatus=" + model.expiryStatus
      };
      baseService.downloadFile(options);
    };
    var Deferred,
      getExportLCs = function(model, deferred) {
        var options = {
          url: "letterofcredits?lcType=" + model.lcType + "&applicantName=" + model.applicantName + "&lcNumber=" + model.lcNumber + "&partyId=" + model.beneName + "&lcStatus=" + model.lcStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&status=" + model.status + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&shipmentDatefrom=" + model.shipmentDateFrom + "&shipmentDateto=" + model.shipmentDateTo + "&expiryStatus=" + model.expiryStatus,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
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
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getExportLC = function(lcNumber, deferred) {
        var options = {
            url: "letterofcredits/{lcNumber}",
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
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchPDF: function(model) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(model, fetchPDFDeferred);
        return fetchPDFDeferred;
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
      getExportLCs: function(model) {
        Deferred = $.Deferred();
        getExportLCs(model, Deferred);
        return Deferred;
      },
      getExportLC: function(lcNumber) {
        Deferred = $.Deferred();
        getExportLC(lcNumber, Deferred);
        return Deferred;
      }
    };
  };
  return new ExportLCModel();
});