define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var P2PModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

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
      /**
       * Method to initialize the described model
       */
      readP2P: function(paymentId) {
        readP2PDeferred = $.Deferred();
        readP2P(paymentId, readP2PDeferred);
        return readP2PDeferred;
      }

    };
  };
  return new P2PModel();
});