define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewGuaranteeModel = function() {
    var initiateBGDeferred, initiateBG = function(model, deferred) {
        var options = {
          url: "bankguarantees",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
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
      fetchProductDeferred, fetchProduct = function(productID, deferred) {
        var params = {
            "productId": productID
          },
          options = {
            url: "products/bankguarantees/{productId}",
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
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAccountDetailDeferred, getAccountDetail = function(accountId, deferred) {
        var params = {
            "accountId": accountId
          },
          options = {
            url: "accounts/demandDeposit/{accountId}",
            success: function(data) {
              deferred.resolve(data);
            }
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
      deleteGuaranteeDeferred, deleteGuarantee = function(guaranteeId, deferred) {
        var options = {
            url: "bankguarantees/{bgId}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            "bgId": guaranteeId
          };
        baseService.remove(options, params);
      };
    return {
      initiateBG: function(model) {
        initiateBGDeferred = $.Deferred();
        initiateBG(model, initiateBGDeferred);
        return initiateBGDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchProduct: function(productID) {
        fetchProductDeferred = $.Deferred();
        fetchProduct(productID, fetchProductDeferred);
        return fetchProductDeferred;
      },
      fetchGuranteeType: function() {
        fetchGuranteeTypeDeferred = $.Deferred();
        fetchGuranteeType(fetchGuranteeTypeDeferred);
        return fetchGuranteeTypeDeferred;
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
      getAccountDetail: function(accountId) {
        getAccountDetailDeferred = $.Deferred();
        getAccountDetail(accountId, getAccountDetailDeferred);
        return getAccountDetailDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      deleteGuarantee: function(guaranteeId) {
        deleteGuaranteeDeferred = $.Deferred();
        deleteGuarantee(guaranteeId, deleteGuaranteeDeferred);
        return deleteGuaranteeDeferred;
      }
    };
  };
  return new ReviewGuaranteeModel();
});
