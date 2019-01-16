define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var pendingApprovalList = function() {
    var baseService = BaseService.getInstance();
    var getPendingApprovalsListDeferred, getPendingApprovalsList = function(deferred) {
      var options = {
        url: "transactions/count?countFor=approval",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      getPendingApprovalsList: function() {
        getPendingApprovalsListDeferred = $.Deferred();
        getPendingApprovalsList(getPendingApprovalsListDeferred);
        return getPendingApprovalsListDeferred;
      }
    };
  };
  return new pendingApprovalList();
});