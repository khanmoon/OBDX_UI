define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ApprovalRulesModel = function() {
    var baseService = BaseService.getInstance();
    var fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "administration/parties/" + partyId,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTransactionNameDeferred, getTransactionName = function(taskId, deferred) {
        var options = {
          url: "resourceTasks/" + taskId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getWorkflowDetailsDeferred, getWorkflowDetails = function(workFlowId, deferred) {
        var options = {
          url: "approvalWorkflows/" + workFlowId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchRuleDetailsDeferred, fetchRuleDetails = function(ruleId, deferred) {
        var options = {
          url: "approvalRules/" + ruleId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchRuleDetails: function(ruleId) {
        fetchRuleDetailsDeferred = $.Deferred();
        fetchRuleDetails(ruleId, fetchRuleDetailsDeferred);
        return fetchRuleDetailsDeferred;
      },
      getTransactionName: function(taskId) {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(taskId, getTransactionNameDeferred);
        return getTransactionNameDeferred;
      },
      getWorkflowDetails: function(workFlowId) {
        getWorkflowDetailsDeferred = $.Deferred();
        getWorkflowDetails(workFlowId, getWorkflowDetailsDeferred);
        return getWorkflowDetailsDeferred;
      }
    };
  };
  return new ApprovalRulesModel();
});
