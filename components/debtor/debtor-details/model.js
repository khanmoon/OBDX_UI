define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var debtorDetailsModel = function() {
    var Model = function() {
        this.debtorDetailsModel = {
          nickName: null,
          groupId: null,
          domesticPayerType: "SEPA",
          sepaDomesticPayer: {
            iban: null,
            bankCode: null,
            sepaPayerType: "DIR"
          }
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      deleteDebtorDeferred, deleteDebtor = function(groupId, payerId, deferred) {

        var options = {
            url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "groupId": groupId,
            "payerId": payerId
          };
        baseService.remove(options, params);
      },
      deleteDebtorGroupDeferred, deleteDebtorGroup = function(groupId, deferred) {

        var options = {
            url: "payments/payerGroup/{groupId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "groupId": groupId
          };
        baseService.remove(options, params);
      },
      getDebtorDetailsDeferred, getDebtorDetails = function(groupId, payerId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "groupId": groupId,
            "payerId": payerId
          };
        baseService.fetch(options, params);
      };
    return {

      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      deleteDebtor: function(groupId, payerId) {
        deleteDebtorDeferred = $.Deferred();
        deleteDebtor(groupId, payerId, deleteDebtorDeferred);
        return deleteDebtorDeferred;
      },
      deleteDebtorGroup: function(groupId) {
        deleteDebtorGroupDeferred = $.Deferred();
        deleteDebtorGroup(groupId, deleteDebtorGroupDeferred);
        return deleteDebtorGroupDeferred;
      },
      getDebtorDetails: function(groupId, payerId) {
        getDebtorDetailsDeferred = $.Deferred();
        getDebtorDetails(groupId, payerId, getDebtorDetailsDeferred);
        return getDebtorDetailsDeferred;
      }
    };
  };
  return new debtorDetailsModel();
});