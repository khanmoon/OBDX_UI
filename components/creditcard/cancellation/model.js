define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CancellationModel = function() {
    var params, baseService = BaseService.getInstance(),
      getCancelReasonsDeferred, getCancelReasons = function(deferred) {
        var options = {
          url: "enumerations/cardCancelReasons",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      cancelCardDeferred, cancelCard = function(model, creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/status",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      };
    return {
      fetchCancelReasons: function() {
        getCancelReasonsDeferred = $.Deferred();
        getCancelReasons(getCancelReasonsDeferred);
        return getCancelReasonsDeferred;
      },
      cancelCard: function(model, creditCardId) {
        cancelCardDeferred = $.Deferred();
        cancelCard(model, creditCardId, cancelCardDeferred);
        return cancelCardDeferred;
      }
    };
  };
  return new CancellationModel();
});