define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var newBillerModel = function() {
    var
      baseService = BaseService.getInstance(),
      getBillerDetailsDeferred, getBillerDetails = function(billerId, relationshipNumber, deferred) {
        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerDescriptionDeferred, getBillerDescription = function(billerId, deferred) {
        var options = {
          url: "payments/billers/" + billerId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getBillerDetails: function(billerId, relationshipNumber) {
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, relationshipNumber, getBillerDetailsDeferred);
        return getBillerDetailsDeferred;
      },
      getBillerDescription: function(billerId) {
        getBillerDescriptionDeferred = $.Deferred();
        getBillerDescription(billerId, getBillerDescriptionDeferred);
        return getBillerDescriptionDeferred;
      }
    };
  };
  return new newBillerModel();
});