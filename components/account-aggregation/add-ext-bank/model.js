define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var AddExtBankModel = function () {
        var bankListDeferred, getBankList = function(bankName,deferred) {
              var options = {
                url: "externalbanks?bankName=" + bankName ,
                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              };
              baseService.fetch(options);
            },
            fetchBankDetailsDeferred, getBankDetails = function(bankName, deferred) {
              var options = {
                  url: "banks/{bankName}",
                  success: function(data) {
                    deferred.resolve(data);
                  },
                  error: function(data) {
                    deferred.reject(data);
                  }
                },
                params = {
                  "bankName": bankName
                };
              baseService.fetch(options, params);
            },
            retrieveImageDeffered, retrieveImage = function(id, deferred) {
              var options = {
                  url: "contents/{id}",
                  success: function(data) {
                    deferred.resolve(data);
                  },
                  error: function(data) {
                    deferred.reject(data);
                  }
                },
                params = {
                  "id": id
                };
              baseService.fetch(options, params);
            };
        return {
          getBankList: function(bankName) {
          bankListDeferred = $.Deferred();
          getBankList(bankName, bankListDeferred);
          return bankListDeferred;
        },
        getBankDetails: function(bankName) {
          fetchBankDetailsDeferred = $.Deferred();
          getBankDetails(bankName, fetchBankDetailsDeferred);
          return fetchBankDetailsDeferred;
        },
        retrieveImage: function(id) {
          retrieveImageDeffered = $.Deferred();
          retrieveImage(id, retrieveImageDeffered);
          return retrieveImageDeffered;
        }
      };
    };
    return new AddExtBankModel();
});
