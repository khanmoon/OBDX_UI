define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MultiplePaymentsModel = function() {
    var
      baseService = BaseService.getInstance(),
      getPurposeDescDeferred, getPurposeDesc = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
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
      getPurposeDesc: function() {
        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);
        return getPurposeDescDeferred;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new MultiplePaymentsModel();
});