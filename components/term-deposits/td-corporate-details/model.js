define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AccountDetailsModel = function() {

    var baseService = BaseService.getInstance(),
      fetchTdDetailsDeffered, fetchTdDetails = function(accNo, deffered) {
        var options = {
          url: "accounts/deposit/" + accNo,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPayoutInstructionsDeffered, fetchPayoutInstructions = function(accNo, deffered) {
        var options = {
          url: "accounts/deposit/" + accNo + "/payOutInstructions",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDetailsDeffered, fetchBranchDetails = function(branchNo, deffered) {
        var options = {
          url: "locations/branches?branchCode=" + branchNo,
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
      fetchTdDetails: function(accNo) {
        fetchTdDetailsDeffered = $.Deferred();
        fetchTdDetails(accNo, fetchTdDetailsDeffered);
        return fetchTdDetailsDeffered;
      },
      fetchPayoutInstructions: function(accNo) {
        fetchPayoutInstructionsDeffered = $.Deferred();
        fetchPayoutInstructions(accNo, fetchPayoutInstructionsDeffered);
        return fetchPayoutInstructionsDeffered;
      },
      fetchBranchDetails: function(branchNo) {
        fetchBranchDetailsDeffered = $.Deferred();
        fetchBranchDetails(branchNo, fetchBranchDetailsDeffered);
        return fetchBranchDetailsDeffered;
      }
    };
  };
  return new AccountDetailsModel();
});