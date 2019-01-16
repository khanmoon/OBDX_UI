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
          securityKey: "",
          userAccountFlag: false,
          checksumAlgorithm: ""
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      readMerchantDeferred, readMerchant = function(merchantCode, deferred) {
        var options = {
            url: "payments/merchants/{merchantCode}",
            success: function(data, textStatus, header) {
              deferred.resolve(data, header);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "merchantCode": merchantCode
          };
        baseService.fetch(options, params);
      },
      listMerchantDeferred, listMerchant = function(description, code, deferred) {
        var options = {
            url: "payments/merchants?description={description}&code={code}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "description": description,
            "code": code
          };
        baseService.fetch(options, params);
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
      readMerchant: function(merchantCode) {
        readMerchantDeferred = $.Deferred();
        readMerchant(merchantCode, readMerchantDeferred);
        return readMerchantDeferred;
      },
      listMerchant: function(description, code) {
        listMerchantDeferred = $.Deferred();
        listMerchant(description, code, listMerchantDeferred);
        return listMerchantDeferred;
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