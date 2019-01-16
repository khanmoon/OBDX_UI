define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Auto pay
   *
   * @namespace ManageLimit~AutoPayModel
   * @class
   */
  var AutoPayModel = function() {

    var params, baseService = BaseService.getInstance();
    var fetchAutopayDeferred, fetchAutopay = function(creditCardId, deferred) {
      params = {
        "creditCardId": creditCardId
      };
      var options = {
        url: "accounts/cards/credit/{creditCardId}/repayment",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    var createAutopayDeferred, createAutopay = function(model, creditCardId, deferred) {
      params = {
        "creditCardId": creditCardId
      };
      var options = {
        url: "accounts/cards/credit/{creditCardId}/repayment",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.add(options, params);
    };
    var updateAutopayDeferred, updateAutopay = function(model, creditCardId, deferred) {
      params = {
        "creditCardId": creditCardId
      };
      var options = {
        url: "accounts/cards/credit/{creditCardId}/repayment",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.update(options, params);
    };
    var deleteAutopayDeferred, deleteAutopay = function(model, creditCardId, deferred) {
      params = {
        "creditCardId": creditCardId
      };
      var options = {
        url: "accounts/cards/credit/{creditCardId}/repayment",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.remove(options, params);
    };
    return {
      fetchAutopay: function(creditCardId) {
        fetchAutopayDeferred = $.Deferred();
        fetchAutopay(creditCardId, fetchAutopayDeferred);
        return fetchAutopayDeferred;
      },
      createAutopay: function(payload, creditCardId) {
        createAutopayDeferred = $.Deferred();
        createAutopay(payload, creditCardId, createAutopayDeferred);
        return createAutopayDeferred;
      },
      updateAutopay: function(payload, creditCardId) {
        updateAutopayDeferred = $.Deferred();
        updateAutopay(payload, creditCardId, updateAutopayDeferred);
        return updateAutopayDeferred;
      },
      deleteAutopay: function(payload, creditCardId) {
        deleteAutopayDeferred = $.Deferred();
        deleteAutopay(payload, creditCardId, deleteAutopayDeferred);
        return deleteAutopayDeferred;
      }
    };
  };
  return new AutoPayModel();
});