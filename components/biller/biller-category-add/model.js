define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function billerCategoryAddModel() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    var Model = function() {
        this.billercategorymodel = {
          billerId: null,
          billerDescription: null,
          categoryType: null

        };
      },
      baseService = BaseService.getInstance(),

      mapBillerDeferred, mapBiller = function(payload, deferred) {
        var options = {
          url: "payments/billers",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      mapBiller: function(payload) {
        mapBillerDeferred = $.Deferred();
        mapBiller(payload, mapBillerDeferred);
        return mapBillerDeferred;
      },
      fetchBiller: function() {
        return baseService.fetch({
          url: "payments/billers"
        });
      },
      fetchBillerCategoryList: function() {
        return baseService.fetch({
          url: "payments/billerCategories"
        });
      },
      fetchBillerCategoryMapping: function() {
        return baseService.fetch({
          url: "payments/billers?categoryType=ALL"
        });
      }
    };
  };
});