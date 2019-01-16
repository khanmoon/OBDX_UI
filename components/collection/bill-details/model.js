define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var BillDetailsModel = function() {
    var fetchGoodsDeferred, fetchGoods = function(deferred) {
      var options = {
        url: "letterofcredits/goods",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      fetchGoods: function() {
        fetchGoodsDeferred = $.Deferred();
        fetchGoods(fetchGoodsDeferred);
        return fetchGoodsDeferred;
      }
    };
  };
  return new BillDetailsModel();
});