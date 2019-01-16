define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var ReviewBillerRegistrationModel = function () {
      var fetchCategoryDeferred, fetchCategory = function(categoryId, deferred) {
        var options = {
          url: "categories/{categoryId}",
          success: function(data) {
            deferred.resolve(data);
          }
        }, params = {
          categoryId: categoryId
        };
        baseService.fetch(options, params);
      }, fetchLocationDetailsDeferred, fetchLocationDetails = function(operationalAreaId, deferred) {
          var options = {
            url: "operationalareas/{operationalAreaId}",
            success: function(data) {
              deferred.resolve(data);
            }
          }, params = {
            operationalAreaId: operationalAreaId
          };
          baseService.fetch(options, params);
      }, fetchBillerDetailsDeferred, fetchBillerDetails = function(billerId, deferred) {
          var options = {
            url: "billers/{billerId}",
            success: function(data) {
              deferred.resolve(data);
            }
          }, params = {
            billerId: billerId
          };
          baseService.fetch(options, params);
      }, registerBillerDeferred, registerBiller = function(model, deferred) {
          var options = {
            url: "registeredBillers",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
          baseService.add(options);
      },
      updateBillerDeferred, updateBiller = function(billerRegistrationId, model, deferred) {
        var options = {
          url: "registeredBillers/{billerRegistrationId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };
        baseService.update(options, params);
      };
      return {
        fetchCategory: function(categoryId) {
            fetchCategoryDeferred = $.Deferred();
            fetchCategory(categoryId, fetchCategoryDeferred);
            return fetchCategoryDeferred;
        },
        fetchLocationDetails: function(operationalAreaId) {
            fetchLocationDetailsDeferred = $.Deferred();
            fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);
            return fetchLocationDetailsDeferred;
        },
        fetchBillerDetails: function(billerId) {
            fetchBillerDetailsDeferred = $.Deferred();
            fetchBillerDetails(billerId, fetchBillerDetailsDeferred);
            return fetchBillerDetailsDeferred;
        },
        registerBiller: function(model) {
            registerBillerDeferred = $.Deferred();
            registerBiller(model, registerBillerDeferred);
            return registerBillerDeferred;
        },
        updateBiller: function(billerRegistrationId, model) {
            updateBillerDeferred = $.Deferred();
            updateBiller(billerRegistrationId, model, updateBillerDeferred);
            return updateBillerDeferred;
        }
      };
    };
    return new ReviewBillerRegistrationModel();
});
