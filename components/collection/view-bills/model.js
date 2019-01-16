define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ViewBillDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var fetchPartyDetailsDeferred, fetchPartyDetails = function(partyID, deferred) {
        var params = {
            "partyId": partyID
          },
          options = {
            url: "me/party/relations/{partyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
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
      getAdviceDetailsDeferred, getAdviceDetails = function(billId, adviceId, deferred) {
        var options = {
            url: "bills/{billId}/advices/{adviceId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "billId": billId,
            "adviceId": adviceId
          };
        baseService.fetch(options, params);
      },
      getSwiftDetailsDeferred, getSwiftDetails = function(billId, swiftId, deferred) {
        var options = {
            url: "bills/{billId}/swiftMessages/{swiftId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "billId": billId,
            "swiftId": swiftId
          };
        baseService.fetch(options, params);
      },
      fetchAdvicePDFDeferred, fetchAdvicePDF = function(billId, adviceId) {
        var options = {
          url: "bills/" + billId + "/advices/" + adviceId + "?media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      fetchSwiftPDFDeferred, fetchSwiftPDF = function(billId, swiftId) {
        var options = {
          url: "bills/" + billId + "/swiftMessages/" + swiftId + "?media=application/pdf"
        };
        baseService.downloadFile(options);
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
      fetchIncotermDeferred, fetchIncoterm = function(code, deferred) {
        var options = {
          url: "letterofcredits/incoterms?code=" + code,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getAdviceDetails: function(billId, adviceId) {
        getAdviceDetailsDeferred = $.Deferred();
        getAdviceDetails(billId, adviceId, getAdviceDetailsDeferred);
        return getAdviceDetailsDeferred;
      },
      getSwiftDetails: function(billId, swiftId) {
        getSwiftDetailsDeferred = $.Deferred();
        getSwiftDetails(billId, swiftId, getSwiftDetailsDeferred);
        return getSwiftDetailsDeferred;
      },
      fetchAdvicePDF: function(billId, adviceId) {
        fetchAdvicePDFDeferred = $.Deferred();
        fetchAdvicePDF(billId, adviceId, fetchAdvicePDFDeferred);
        return fetchAdvicePDFDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      fetchSwiftPDF: function(billId, swiftId) {
        fetchSwiftPDFDeferred = $.Deferred();
        fetchSwiftPDF(billId, swiftId, fetchSwiftPDFDeferred);
        return fetchSwiftPDFDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
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
      fetchIncoterm: function(code) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(code, fetchIncotermDeferred);
        return fetchIncotermDeferred;
      }
    };
  };
  return new ViewBillDetailsModel();
});