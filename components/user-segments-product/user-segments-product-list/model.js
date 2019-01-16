define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserSegmentListModel = function() {

    var baseService = BaseService.getInstance();

    var userSegmentsListDeferred, userSegmentsList = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAllMappedProductsDeferred, fetchAllMappedProducts = function(productType, deferred) {
        var url;
        url = "configurations/usersegment/products?productType={productType}";
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
            productType: productType
          };
        baseService.fetch(options, params);
      };

    return {
      userSegmentsList: function() {
        userSegmentsListDeferred = $.Deferred();
        userSegmentsList(userSegmentsListDeferred);
        return userSegmentsListDeferred;
      },
      fetchAllMappedProducts: function(productType) {
        fetchAllMappedProductsDeferred = $.Deferred();
        fetchAllMappedProducts(productType, fetchAllMappedProductsDeferred);
        return fetchAllMappedProductsDeferred;
      }
    };
  };
  return new UserSegmentListModel();
});