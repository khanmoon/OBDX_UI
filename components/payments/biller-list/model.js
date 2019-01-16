define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var BillerListModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      deleteBillerDeferred, deleteBiller = function(billerId, relationshipNumber, deferred) {
        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.remove(options);
      },
      getCategoriesDeferred, getCategories = function(deferred) {
        var options = {
          url: "payments/billers?categoryType=ALL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerNamesDeferred, getBillerNames = function(deferred) {
        var options = {
          url: "payments/billers?categoryType=ALL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerListDeferred, getBillerList = function(deferred) {
        var options = {
          url: "payments/registeredBillers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getCategories: function() {

        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);
        return getCategoriesDeferred;
      },
      deleteBiller: function(billerId, relationshipNumber) {

        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);
        return deleteBillerDeferred;
      },
      getBillerList: function() {

        getBillerListDeferred = $.Deferred();
        getBillerList(getBillerListDeferred);
        return getBillerListDeferred;
      },
      getBillerNames: function() {

        getBillerNamesDeferred = $.Deferred();
        getBillerNames(getBillerNamesDeferred);
        return getBillerNamesDeferred;
      }
    };
  };
  return new BillerListModel();
});