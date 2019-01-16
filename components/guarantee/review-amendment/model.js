define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewAmendmentModel = function() {
    var getOutwardBGDeferred, getOutwardBG = function(bankGuaranteeId, versionNo, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}?versionNo=" + versionNo,
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
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyID, deferred) {
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
      fetchGuranteeTypeDeferred, fetchGuranteeType = function(deferred) {
        var options = {
          url: "bankguarantees/types",
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
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDateDeferred, fetchBranchDate = function(code, deferred) {
        var options = {
            url: "branchdate/{branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "branchCode": code
          };
        baseService.fetch(options, params);
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
      initiateAmendmentDeferred, initiateAmendment = function(bankGuaranteeId, model, deferred) {
        var params = {
            "bankGuaranteeId": bankGuaranteeId
          },
          options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
        baseService.add(options, params);
      };
    return {
      getOutwardBG: function(bankGuaranteeId, versionNo) {
        getOutwardBGDeferred = $.Deferred();
        getOutwardBG(bankGuaranteeId, versionNo, getOutwardBGDeferred);
        return getOutwardBGDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      initiateAmendment: function(bankGuaranteeId, model) {
        initiateAmendmentDeferred = $.Deferred();
        initiateAmendment(bankGuaranteeId, model, initiateAmendmentDeferred);
        return initiateAmendmentDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);
        return fetchBranchDateDeferred;
      },
      fetchGuranteeType: function() {
        fetchGuranteeTypeDeferred = $.Deferred();
        fetchGuranteeType(fetchGuranteeTypeDeferred);
        return fetchGuranteeTypeDeferred;
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      }
    };
  };
  return new ReviewAmendmentModel();
});
