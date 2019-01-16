define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var AccountDetailsModel = function() {
    var Model = function() {
      this.accountDetailsPayload = {
        accountNumber: "",
        routingNumber: "",
        bankName: "",
        accountType: "",
        temp_maskAccountNumber: "",
        temp_reAccountNumber: "",
        temp_maskReAccountNumber: "",
        temp_selectedAccountType: ""
      };
    };
    var getAccountDetailsDeferred, getAccountDetails = function(submissionId, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/settlementDetails",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getAccountTypeListDeferred, getAccountTypeList = function(submissionId, deferred) {
        var options = {
          url: "enumerations/settlementAccountTypes",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      submitAccountDetailsDeferred, submitAccountDetails = function(submissionId, payload, deferred, isToBeUpdated) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/settlementDetails",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        if (isToBeUpdated) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }

      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getAccountDetails: function(submissionId) {
        getAccountDetailsDeferred = $.Deferred();
        getAccountDetails(submissionId, getAccountDetailsDeferred);
        return getAccountDetailsDeferred;
      },
      getAccountTypeList: function(submissionId) {
        getAccountTypeListDeferred = $.Deferred();
        getAccountTypeList(submissionId, getAccountTypeListDeferred);
        return getAccountTypeListDeferred;
      },
      submitAccountDetails: function(submissionId, payload, isToBeUpdated) {
        submitAccountDetailsDeferred = $.Deferred();
        submitAccountDetails(submissionId, payload, submitAccountDetailsDeferred, isToBeUpdated);
        return submitAccountDetailsDeferred;
      }
    };
  };
  return new AccountDetailsModel();
});