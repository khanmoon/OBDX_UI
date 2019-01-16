define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var TDRatesModel = function() {
    var getTDRatesDeferred, getTDRates = function(deferred) {
      var options = {
        url: "tdRates",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      getTDRates: function() {
        getTDRatesDeferred = $.Deferred();
        getTDRates(getTDRatesDeferred);
        return getTDRatesDeferred;
      }
    };
  };
  return new TDRatesModel();
});