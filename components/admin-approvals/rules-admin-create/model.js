define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var approvalsRulesModel = function() {
    var Model = function() {
      return {
      approvals : {
        "partyId": "",
        "userType": "CUSTOMER",
        "partyName": null,
        "ruleDetailsFetched": false,
        "additionalDetails": "",
        "userTypeLabel": "",
        "selectedTransaction": ""
      },
rulesCreatePayload : {
        "approvalRequired": null,
        "ruleId": null,
        "ruleName": null,
        "version": null,
        "description": null,
        "initiatorUserGroup": {
          "id": null,
          "name": null,
          "partyId": null,
          "unary": false,
          "users": [{
            "userId": null
          }]
        },
        "party": null,
        "workflowDto": {
          "name": null,
          "workFlowId": null
        },
        "associatedRuleCriterias": []
      }
    };
    };
    var baseService = BaseService.getInstance();
    var createRulesDeferred, createRules = function(rulesCreatePayload, deferred) {
        var options = {
          url: "approvalRules",
          data: rulesCreatePayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchRuleDeferred, fetchRule = function(ruleId, deferred) {
        var options = {
          url: "approvalRules/" + ruleId,
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
      deleteRuleDeferred, deleteRule = function(ruleId, deferred) {
        var options = {
          url: "approvalRules/" + ruleId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.remove(options);
      },
      updateRulesDeferred, updateRules = function(rulesCreatePayload, ruleId, deferred) {
        var options = {
          url: "approvalRules/" + ruleId,
          data: rulesCreatePayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      getUserTypeDeferred, getUserType = function(deferred) {
        var options = {
          url: "approvals/userType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      getWorkflowDeferred, getWorkflow = function(partyId, deferred) {
        var options = {
          url: "approvalWorkflows?partyId=" + partyId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getPartyDetailsDeferred, getPartyDetails = function(partyId, deferred) {
        var options = {
          url: "administration/parties/" + partyId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getUserGroupsListDeferred, getUserGroupsList = function(partyId, userType, deferred) {
        var options = {
          url: "userGroups?partyId=" + partyId + "&userGroupType=" + userType,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getUserAccountsDeferred, getUserAccounts = function(partyId, deferred) {
        var options = {
          url: "accountAccess?partyId=" + partyId + "&accountType=CSA",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getTransactionsDeferred, getTransactions = function(taskType, deferred) {
        var options = {
          url: "resourceTasks?taskType=" + taskType + "&aspects=approval",
          success: function(data) {
            deferred.resolve(data);
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
      getNonFinancialTransactionRulesDeferred, getNonFinancialTransactionRules = function(taskType, deferred) {
        var options = {
          url: "ruleCriteria?taskType=" + taskType + "&userType=ADMIN",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAdminTransactionRulesDeferred, getAdminTransactionRules = function(taskType, deferred) {
        var options = {
          url: "ruleCriteria?taskType=" + taskType + "&userType=ADMIN",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getLocalCurrencyDeferred, getLocalCurrency = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
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
      };
    return {
      createRules: function(rulesCreatePayload) {
        createRulesDeferred = $.Deferred();
        createRules(rulesCreatePayload, createRulesDeferred);
        return createRulesDeferred;
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      updateRules: function(rulesCreatePayload, ruleId) {
        updateRulesDeferred = $.Deferred();
        updateRules(rulesCreatePayload, ruleId, updateRulesDeferred);
        return updateRulesDeferred;
      },
      fetchRule: function(ruleId) {
        fetchRuleDeferred = $.Deferred();
        fetchRule(ruleId, fetchRuleDeferred);
        return fetchRuleDeferred;
      },
      getWorkflowDetails: function(workFlowId) {
        getWorkflowDetailsDeferred = $.Deferred();
        getWorkflowDetails(workFlowId, getWorkflowDetailsDeferred);
        return getWorkflowDetailsDeferred;
      },
      deleteRule: function(ruleId) {
        deleteRuleDeferred = $.Deferred();
        deleteRule(ruleId, deleteRuleDeferred);
        return deleteRuleDeferred;
      },
      getUserType: function() {
        getUserTypeDeferred = $.Deferred();
        getUserType(getUserTypeDeferred);
        return getUserTypeDeferred;
      },
      getWorkflow: function(partyId) {
        getWorkflowDeferred = $.Deferred();
        getWorkflow(partyId, getWorkflowDeferred);
        return getWorkflowDeferred;
      },
      getPartyDetails: function(partyId) {
        getPartyDetailsDeferred = $.Deferred();
        getPartyDetails(partyId, getPartyDetailsDeferred);
        return getPartyDetailsDeferred;
      },
      getUserGroupsList: function(partyId, userType) {
        getUserGroupsListDeferred = $.Deferred();
        getUserGroupsList(partyId, userType, getUserGroupsListDeferred);
        return getUserGroupsListDeferred;
      },
      getUserAccounts: function(partyId) {
        getUserAccountsDeferred = $.Deferred();
        getUserAccounts(partyId, getUserAccountsDeferred);
        return getUserAccountsDeferred;
      },
      getNonFinancialTransactionRules: function(taskType) {
        getNonFinancialTransactionRulesDeferred = $.Deferred();
        getNonFinancialTransactionRules(taskType, getNonFinancialTransactionRulesDeferred);
        return getNonFinancialTransactionRulesDeferred;
      },
      getAdminTransactionRules: function(taskType) {
        getAdminTransactionRulesDeferred = $.Deferred();
        getAdminTransactionRules(taskType, getAdminTransactionRulesDeferred);
        return getAdminTransactionRulesDeferred;
      },
      getTransactions: function(taskType) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(taskType, getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      getTransactionName: function(taskId) {
        getTransactionNameDeferred = $.Deferred();
        getTransactionName(taskId, getTransactionNameDeferred);
        return getTransactionNameDeferred;
      },
      getLocalCurrency: function() {
        getLocalCurrencyDeferred = $.Deferred();
        getLocalCurrency(getLocalCurrencyDeferred);
        return getLocalCurrencyDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new approvalsRulesModel();
});
