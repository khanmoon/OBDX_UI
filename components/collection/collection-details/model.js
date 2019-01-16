define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var CollectionDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var fetchPartyRelationsDeferred, fetchPartyRelations = function(deferred) {
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
      fetchDraweeCountryDeferred, fetchDraweeCountry = function(deferred) {
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
      fetchProductDetailsDeferred, fetchProductDetails = function(productId, deferred) {
        var params = {
            "productId": productId
          },
          options = {
            url: "products/bills/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getProductsDeferred, getProductsList = function(payload, deferred) {
        var options = {
          url: "products/bills?paymentType=" + payload.paymentType() + "&lcLinkage=" + payload.lcLinked() + "&docAttached=" + payload.docAttached(),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBaseDateDescriptionDefered, getBaseDateDescrption = function(deferred) {
        var options = {
          url: "bills/baseDateDescriptions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
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
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchBeneficiaryDetails: function(counterpartyId) {
        fetchBeneficiaryDetailsDeferred = $.Deferred();
        fetchBeneficiaryDetails(counterpartyId, fetchBeneficiaryDetailsDeferred);
        return fetchBeneficiaryDetailsDeferred;
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
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      fetchDraweeCountry: function() {
        fetchDraweeCountryDeferred = $.Deferred();
        fetchDraweeCountry(fetchDraweeCountryDeferred);
        return fetchDraweeCountryDeferred;
      },
      getProductsList: function(payload) {
        getProductsDeferred = $.Deferred();
        getProductsList(payload, getProductsDeferred);
        return getProductsDeferred;
      },
      fetchProductDetails: function(productId) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productId, fetchProductDetailsDeferred);
        return fetchProductDetailsDeferred;
      },
      getBaseDateDescrption: function() {
        getBaseDateDescriptionDefered = $.Deferred();
        getBaseDateDescrption(getBaseDateDescriptionDefered);
        return getBaseDateDescriptionDefered;
      }
    };
  };
  return new CollectionDetailsModel();
});