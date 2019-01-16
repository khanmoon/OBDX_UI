define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    var RegAccountBankModel = function () {

      var Model = function() {
        this.acctIds = [{}];
      };

      var baseService = BaseService.getInstance();

      var createAccountDeferred, createAccount = function(model, deferred) {
                  var options = {
                      url: "",
                      data: model,
                      success: function(data, status, jqXhr) {
                          deferred.resolve(data, status, jqXhr);
                      },
                      error: function(data, status, jqXhr) {
                          deferred.reject(data, status, jqXhr);
                      }
                  };
                  baseService.add(options);
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
            accountListDeferred, getAccountList = function(bankCode, userId, deferred) {
                  var options = {
                    url: "externalBankAccounts?bankCode=" + bankCode + "&userId=" + userId ,
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
              getNewModel: function() {
                return new Model();
              },
              createAccount: function(model) {
                  createAccountDeferred = $.Deferred();
                  createAccount(model, createAccountDeferred);
                  return createAccountDeferred;
              },
				fetchAccessToken: function(state,code) {
					fetchAccessTokenDeferred = $.Deferred();
					fetchAccessToken(state,code, fetchAccessTokenDeferred);
					return fetchAccessTokenDeferred;
				},
              getAccountList: function(bankCode, userId) {
              accountListDeferred = $.Deferred();
              getAccountList(bankCode,userId,accountListDeferred);
              return accountListDeferred;
             }
            };
          };
          return new RegAccountBankModel();
        });
