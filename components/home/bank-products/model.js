define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var bankProductsModel = function() {
    var baseService = BaseService.getInstance(),

      fetchProductTilesDeferred,
      fetchProductTiles = function(deferred) {
        var params = {
            "status": "ACTIVE"
          },
          options = {
            url: "productTypes?status={status}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      fetchProductTiles: function() {
        fetchProductTilesDeferred = $.Deferred();
        fetchProductTiles(fetchProductTilesDeferred);
        return fetchProductTilesDeferred;
      }
    };
  };
  return new bankProductsModel();
});