define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var billerModel = function() {
    var baseService = BaseService.getInstance(),
      getBillerDescriptionDeferred, getBillerDescription = function(billerId, deferred) {
        var options = {
          url: "payments/billers/" + billerId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPartyBillerRelationshipDetailsDeferred, getPartyBillerRelationshipDetails = function(billerId, relationshipNumber, deferred) {
        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getBillerDescription: function(billerId) {
        getBillerDescriptionDeferred = $.Deferred();
        getBillerDescription(billerId, getBillerDescriptionDeferred);
        return getBillerDescriptionDeferred;
      },
      getPartyBillerRelationshipDetails: function(billerId, relationshipNumber) {
        getPartyBillerRelationshipDetailsDeferred = $.Deferred();
        getPartyBillerRelationshipDetails(billerId, relationshipNumber, getPartyBillerRelationshipDetailsDeferred);
        return getPartyBillerRelationshipDetailsDeferred;
      }
    };
  };
  return new billerModel();
});