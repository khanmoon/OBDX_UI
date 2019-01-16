define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var StartCollectionModel = function() {
    var baseService = BaseService.getInstance();

    var getLcDetailsDeferred, getLcDetails = function(lcNumber, deferred) {
        var options = {
            url: "letterofcredits/{lcNumber}?forBillsCreation=true",
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
      fetchLCProductDetailsDeferred, fetchLCProductDetails = function(productId, deferred) {
        var params = {
            "productId": productId
          },
          options = {
            url: "products/letterofcredits/{productId}?productType=Export",
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
      };
    return {
      getLcDetails: function(lcNumber) {
        getLcDetailsDeferred = $.Deferred();
        getLcDetails(lcNumber, getLcDetailsDeferred);
        return getLcDetailsDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      fetchLCProductDetails: function(productId) {
        fetchLCProductDetailsDeferred = $.Deferred();
        fetchLCProductDetails(productId, fetchLCProductDetailsDeferred);
        return fetchLCProductDetailsDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      }
    };
  };
  return new StartCollectionModel();
});
