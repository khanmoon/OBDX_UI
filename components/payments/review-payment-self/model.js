define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var selfPayeeModel = function() {
    var baseService = BaseService.getInstance(),
      getTransferDataDeferred, getTransferData = function(paymentId, isPaylater, deferred) {
        var url;
        if (isPaylater) {
          url = "payments/instructions/transfers/self/" + paymentId;
        } else {
          url = "payments/transfers/self/" + paymentId;
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getRepeatDeferred, getRepeateIntervals = function(deferred) {
        var options = {
          url: "enumerations/paymentFrequency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getTransferData: function(paymentId, isPaylater) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, isPaylater, getTransferDataDeferred);
        return getTransferDataDeferred;
      },
      getRepeateIntervals: function() {
        getRepeatDeferred = $.Deferred();
        getRepeateIntervals(getRepeatDeferred);
        return getRepeatDeferred;
      },
      /**
       * fetches forex deals list for the user
       *
       * @param {String} dealId contains selected currency for filter
       * @returns {Promise}  Returns the promise object
       */
      fetchForexDealList: function( dealId) {

          return baseService.fetch({
              url: "forexDeals?dealId={dealId}"
          }, {
              dealId: dealId
          });

      }
    };
  };
  return new selfPayeeModel();
});