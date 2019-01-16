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
          commissionAccountFlag: "DISABLED",
          checksumType: "NA",
          securityKey: "",
          checksumAlgorithm: ""
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
      updateMerchantDeferred, updateMerchant = function(model, merchantCode, version, deferred) {
        var options = {
            url: "payments/merchants/{merchantCode}",
            data: model,
            headers: {
              "If-Match": version
            },
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "merchantCode": merchantCode
          };
        baseService.update(options, params);
      },
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
      deleteMerchantDeferred, deleteMerchant = function(merchantCode, deferred) {
        var options = {
            url: "payments/merchants/{merchantCode}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "merchantCode": merchantCode
          };
        baseService.remove(options, params);
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
      createMerchant: function(model) {
        createMerchantDeferred = $.Deferred();
        createMerchant(model, createMerchantDeferred);
        return createMerchantDeferred;
      },
      updateMerchant: function(model, merchantCode, version) {
        updateMerchantDeferred = $.Deferred();
        updateMerchant(model, merchantCode, version, updateMerchantDeferred);
        return updateMerchantDeferred;
      },
      readMerchant: function(merchantCode) {
        readMerchantDeferred = $.Deferred();
        readMerchant(merchantCode, readMerchantDeferred);
        return readMerchantDeferred;
      },
      deleteMerchant: function(merchantCode) {
        deleteMerchantDeferred = $.Deferred();
        deleteMerchant(merchantCode, deleteMerchantDeferred);
        return deleteMerchantDeferred;
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