define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var internalPayeeModel = function() {
    var
      baseService = BaseService.getInstance(),
      readP2PDeferred, readP2P = function(paymentId, deferred) {
        var options = {
            url: "payments/transfers/peerToPeer/{paymentId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentId: paymentId
          };
        baseService.fetch(options, params);
      };
    return {
      readP2P: function(paymentId) {
        readP2PDeferred = $.Deferred();
        readP2P(paymentId, readP2PDeferred);
        return readP2PDeferred;
      }
    };
  };
  return new internalPayeeModel();
});