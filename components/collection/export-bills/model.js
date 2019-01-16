define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ExportBillModel = function() {
    var Model = function() {
      this.model = {
        "billType": "EXPORT",
        "draweeName": "",
        "drawerName": "",
        "status": "",
        "fromAmount": "",
        "toAmount": "",
        "issueDatefrom": "",
        "issueDateto": "",
        "expiryDatefrom": "",
        "expiryDateto": "",
        "billNumber": ""
      };
    };

    var baseService = BaseService.getInstance();
    var getBillDetailsDeferred, getBillDetails = function(billNo, deferred) {
        var params = {
            "billReferenceNo": billNo
          },
          options = {
            url: "bills/{billReferenceNo}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchPDFDeferred, fetchPDF = function(model) {
        var options = {
          url: "bills?media=application/pdf&partyId=" + model.drawerName + "&billType=" + model.billType + "&billReferenceNo=" + model.billNumber + "&billAmtFrom=" + model.fromAmount + "&billAmtTo=" + model.toAmount + "&billDateFrom=" + model.issueDatefrom + "&billDateTo=" + model.issueDateto + "&status=" + model.status + "&drawee=" + model.draweeName
        };
        baseService.downloadFile(options);
      },
      getListExportBillsDeferred,
      getListExportBills = function(model, deferred) {
        var options = {
          url: "bills?partyId=" + model.drawerName + "&billType=" + model.billType + "&billReferenceNo=" + model.billNumber + "&billAmtFrom=" + model.fromAmount + "&billAmtTo=" + model.toAmount + "&billDateFrom=" + model.issueDatefrom + "&billDateTo=" + model.issueDateto + "&status=" + model.status + "&drawee=" + model.draweeName,

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
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getBillDetails: function(billNo) {
        getBillDetailsDeferred = $.Deferred();
        getBillDetails(billNo, getBillDetailsDeferred);
        return getBillDetailsDeferred;
      },
      fetchPDF: function(model) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(model);
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
      getListExportBills: function(model) {
        getListExportBillsDeferred = $.Deferred();
        getListExportBills(model, getListExportBillsDeferred);
        return getListExportBillsDeferred;
      }
    };
  };
  return new ExportBillModel();
});