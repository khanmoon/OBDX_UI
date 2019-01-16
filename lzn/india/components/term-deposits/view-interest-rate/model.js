define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var openTdModel = function() {

    var baseService = BaseService.getInstance();
    var readInterestRateDeferred,

      /**
       * readInterestRate - description
       *
       * @param  {type} deferred  description
       * @param  {type} productId description
       * @param  {type} moduleType description
       * @return {type}           description
       */
      readInterestRate = function(deferred, productId, moduleType) {
        var params = {
            productId: productId,
            moduleType: moduleType
          },
          options = {
            url: "products/deposit/{productId}/interestRates?accountModule={moduleType}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * readInterestRate - function to fetch interest Rates for given productId
       *
       * @param  {type} productId productId to be passed to TD
       * @param  {type} moduleType description
       * @return {type}           description
       */
      readInterestRate: function(productId, moduleType) {
        readInterestRateDeferred = $.Deferred();
        readInterestRate(readInterestRateDeferred, productId, moduleType);
        return readInterestRateDeferred;
      }
    };
  };
  return new openTdModel();
});
