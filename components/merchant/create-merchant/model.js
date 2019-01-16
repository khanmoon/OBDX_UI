define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-merchant"
], function($, BaseService) {
  "use strict";
  var merchantModel = function() {
    var Model = function() {
        this.merchantModel = {
          description: null,
          static_success_url: null,
          dynamic_success_url: null,
          static_failure_url: null,
          dynamic_failure_url: null,
          merchantAccount: null,
          code: null,
          accountType: null,
          commissionAccountType: null,
          commissionAccount: null,
          commissionAccountFlag: "DISABLED",
          checksumType: null,
          securityKey: null,
          userAccountFlag: false,
          checksumAlgorithm: null
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      createMerchantDeferred, createMerchant = function(model, deferred) {
        var options = {
          url: "payments/merchants",
          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.add(options);
      },
      updateMerchantDeferred, updateMerchant = function(model, code, deferred) {
        var options = {
          url: "payments/merchants/" + code,
          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);
      },
      fetchUserDetailsDeferred, fetchUserDetails = function(deferred) {
        var options = {
          url: "parties/me",
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
      /**
       * Method to initialize the described model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      createMerchant: function(model) {
        createMerchantDeferred = $.Deferred();
        createMerchant(model, createMerchantDeferred);
        return createMerchantDeferred;
      },
      updateMerchant: function(model, code) {
        updateMerchantDeferred = $.Deferred();
        updateMerchant(model, code, updateMerchantDeferred);
        return updateMerchantDeferred;
      },
      fetchUserDetails: function() {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred);
        return fetchUserDetailsDeferred;
      }
    };
  };
  return new merchantModel();
});