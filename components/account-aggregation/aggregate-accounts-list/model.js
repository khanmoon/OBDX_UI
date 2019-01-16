define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var AddExtBankModel = function () {
        var bankListDeferred, getBankList = function(deferred) {
              var options = {
                url: "externalbanks" ,
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
            fetchAccessTokenDeferred, fetchAccessToken = function(state,code, deferred) {
              var options = {
                  url: "accesstokens/{stateId}/{code}",
                  success: function(data) {
                    deferred.resolve(data);
                  },
                  error: function(data) {
                    deferred.reject(data);
                  }
                },
                params = {
                  "stateId": state,
                  "code":code
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
            },
            deleteBankDeferred, deleteBank = function(state, deferred) {
              var options = {
                  url: "accesstokens/{bankCode}",
                  success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                  },
                  error: function(data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                  }
                },
                params = {
                  "bankCode": state
                };
              baseService.remove(options, params);
            },
            createStateDeffered, createState = function(model, deferred) {
              var options = {
                url: "userstates",
                data: model,
                success: function(data, status, jqXhr) {
                  deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                  deferred.reject(data, status, jqXhr);
                }
              };
              baseService.add(options);
            };
            return {
              getBankList: function() {
                bankListDeferred = $.Deferred();
                getBankList( bankListDeferred);
                return bankListDeferred;
              },
              getBankDetails: function(bankName) {
                fetchBankDetailsDeferred = $.Deferred();
                getBankDetails(bankName, fetchBankDetailsDeferred);
                return fetchBankDetailsDeferred;
              },
              fetchAccessToken: function(state,code) {
                fetchAccessTokenDeferred = $.Deferred();
                fetchAccessToken(state,code, fetchAccessTokenDeferred);
                return fetchAccessTokenDeferred;
              },
              createState: function(model) {
                createStateDeffered = $.Deferred();
                createState(model, createStateDeffered);
                return createStateDeffered;
              },
              deleteBank: function(state) {
                deleteBankDeferred = $.Deferred();
                deleteBank(state, deleteBankDeferred);
                return deleteBankDeferred;
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
