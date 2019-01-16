define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var OfferModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();
    var getOffersDeferred, getOffers = function(deferred) {
      var options = {
        url: "offers",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      getOffers: function() {
        getOffersDeferred = $.Deferred();
        getOffers(getOffersDeferred);
        return getOffersDeferred;
      }
    };
  };
  return new OfferModel();
});