define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewCollectionModel = function() {
    var initiateCollectionDeferred, initiateCollection = function(model, deferred) {
        var options = {
          url: "bills",
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
      fetchIncotermDeferred, fetchIncoterm = function(code, deferred) {
        var options = {
          url: "letterofcredits/incoterms?code=" + code,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchProductDetailsDeferred, fetchProductDetails = function(productID, deferred) {
        var params = {
            "productId": productID
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
      initiateCollection: function(model) {
        initiateCollectionDeferred = $.Deferred();
        initiateCollection(model, initiateCollectionDeferred);
        return initiateCollectionDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      getProductsList: function(payload) {
        getProductsDeferred = $.Deferred();
        getProductsList(payload, getProductsDeferred);
        return getProductsDeferred;
      },
      fetchIncoterm: function(code) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(code, fetchIncotermDeferred);
        return fetchIncotermDeferred;
      },
      fetchProductDetails: function(productID) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productID, fetchProductDetailsDeferred);
        return fetchProductDetailsDeferred;
      },
      fetchDraweeCountry: function() {
        fetchDraweeCountryDeferred = $.Deferred();
        fetchDraweeCountry(fetchDraweeCountryDeferred);
        return fetchDraweeCountryDeferred;
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
      },
      getBaseDateDescrption: function() {
        getBaseDateDescriptionDefered = $.Deferred();
        getBaseDateDescrption(getBaseDateDescriptionDefered);
        return getBaseDateDescriptionDefered;
      }
    };
  };
  return new ReviewCollectionModel();
});
