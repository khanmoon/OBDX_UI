define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserSegmentProductMapModel = function() {

    var Model = function() {

      this.userSegmentId = null;
      this.productType = null;
      this.productIds = [{}];

    };

    var baseService = BaseService.getInstance();

    var productListDeferred, productList = function(productType, deferred) {
        var options = {
          url: "products/deposit?productType={productType}",
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
      },
      addProductMappingDeferred, addProductMapping = function(deferred, payload, usersegment, productType) {
        var options = {
          url: "configurations/usersegment/" + usersegment + "/products/" + productType,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchMappedProductsDeferred, fetchMappedProducts = function(deferred, usersegment, productType) {
        var options = {
          url: "configurations/usersegment/" + usersegment + "/products/" + productType,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      updateProductMappingDeferred, updateProductMapping = function(deferred, payload, usersegment, productType) {
        var options = {
          url: "configurations/usersegment/" + usersegment + "/products/" + productType,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      addProductMapping: function(payload, userSegmentId, productType) {
        addProductMappingDeferred = $.Deferred();
        addProductMapping(addProductMappingDeferred, payload, userSegmentId, productType);
        return addProductMappingDeferred;
      },
      productList: function(productType) {
        productListDeferred = $.Deferred();
        productList(productType, productListDeferred);
        return productListDeferred;
      },
      fetchMappedProducts: function(userSegmentId, productType) {
        fetchMappedProductsDeferred = $.Deferred();
        fetchMappedProducts(fetchMappedProductsDeferred, userSegmentId, productType);
        return fetchMappedProductsDeferred;
      },
      updateProductMapping: function(payload, userSegmentId, productType) {
        updateProductMappingDeferred = $.Deferred();
        updateProductMapping(updateProductMappingDeferred, payload, userSegmentId, productType);
        return updateProductMappingDeferred;
      }
    };
  };
  return new UserSegmentProductMapModel();
});