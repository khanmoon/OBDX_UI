define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RequestPinModel = function() {
    var params, baseService = BaseService.getInstance();
    var updatePINDeferred, updatePIN = function(model, creditCardId, deferred) {
      params = {
        "creditCardId": creditCardId
      };
      var options = {
        url: "accounts/cards/credit/{creditCardId}/credentials",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };
      baseService.update(options, params);
    };
    return {
      updatePIN: function(model, creditCardId) {
        updatePINDeferred = $.Deferred();
        updatePIN(model, creditCardId, updatePINDeferred);
        return updatePINDeferred;
      }
    };
  };
  return new RequestPinModel();
});