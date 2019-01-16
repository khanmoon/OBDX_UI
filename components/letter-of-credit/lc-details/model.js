define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LCDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var fetchProductDetailsDeferred, fetchProductDetails = function(productId, deferred) {
        var params = {
            "productId": productId
          },
          options = {
            url: "products/letterofcredits/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
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
      fetchBeneficiaryDetailsDeferred, fetchBeneficiaryDetails = function(beneficiaryId, deferred) {
        var params = {
            "beneficiaryId": beneficiaryId
          },
          options = {
            url: "beneficiaries/{beneficiaryId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchCurrencyDeferred, fetchCurrency = function(deferred) {
        var options = {
          url: "currency",
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
      };
    return {
      fetchProductDetails: function(productId) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productId, fetchProductDetailsDeferred);
        return fetchProductDetailsDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchBeneficiaryDetails: function(beneficiaryId) {
        fetchBeneficiaryDetailsDeferred = $.Deferred();
        fetchBeneficiaryDetails(beneficiaryId, fetchBeneficiaryDetailsDeferred);
        return fetchBeneficiaryDetailsDeferred;
      },
      fetchCurrency: function() {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);
        return fetchCurrencyDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);
        return fetchBranchDateDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      }
    };
  };
  return new LCDetailsModel();
});