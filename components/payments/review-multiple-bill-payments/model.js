define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MultipleBillPaymentsModel = function() {
    var
      baseService = BaseService.getInstance(),

      fireBatchDeferred, fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      };
    return {
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new MultipleBillPaymentsModel();
});