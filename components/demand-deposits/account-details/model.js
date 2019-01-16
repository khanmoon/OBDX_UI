define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AccountDetailsModel = function() {
    var baseService = BaseService.getInstance(),
      fetchAccountDetailsDeffered, fetchAccountDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/demandDeposit/" + accNo,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchGraphDetailsDeffered, fetchGraphDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/demandDeposit/" + accNo + "/trends/closingBalance",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchAccountDetails: function(accNo) {
        fetchAccountDetailsDeffered = $.Deferred();
        fetchAccountDetails(accNo, fetchAccountDetailsDeffered);
        return fetchAccountDetailsDeffered;
      },
      fetchGraphDetails: function(accNo) {
        fetchGraphDetailsDeffered = $.Deferred();
        fetchGraphDetails(accNo, fetchGraphDetailsDeffered);
        return fetchGraphDetailsDeffered;
      }
    };
  };
  return new AccountDetailsModel();
});