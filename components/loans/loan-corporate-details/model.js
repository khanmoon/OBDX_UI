define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AccountDetailsModel = function() {

    var baseService = BaseService.getInstance(),
      fetchLoanDetailsDeffered, fetchLoanDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/loan/" + accNo,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchLoanScheduleDetailsDeffered, fetchLoanScheduleDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/loan/" + accNo + "/schedule",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchOutstandingDetailsDeffered, fetchOutstandingDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/loan/" + accNo + "/outstanding",
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
      fetchLoanDetails: function(accNo) {
        fetchLoanDetailsDeffered = $.Deferred();
        fetchLoanDetails(accNo, fetchLoanDetailsDeffered);
        return fetchLoanDetailsDeffered;
      },
      fetchLoanScheduleDetails: function(accNo) {
        fetchLoanScheduleDetailsDeffered = $.Deferred();
        fetchLoanScheduleDetails(accNo, fetchLoanScheduleDetailsDeffered);
        return fetchLoanScheduleDetailsDeffered;
      },
      fetchOutstandingDetails: function(accNo) {
        fetchOutstandingDetailsDeffered = $.Deferred();
        fetchOutstandingDetails(accNo, fetchOutstandingDetailsDeffered);
        return fetchOutstandingDetailsDeffered;
      }
    };
  };
  return new AccountDetailsModel();
});