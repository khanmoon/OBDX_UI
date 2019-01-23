define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RulesAdminModel = function() {
    var Model = function() {
        this.approvals = {
          "description": "",
          "partyId": "",
          "initiatorUserGroup": "",
          "ruleName": "",
          "workflowId": "",
          "ruleDetailsFetched": null
        };
      },
      baseService = BaseService.getInstance();
    var fetchDetailsDeferred, fetchDetails = function(ruleParams, deferred) {
        var params = {
            "description": ruleParams.description(),
            "partyId": ruleParams.partyId(),
            "initiatorUserGroup": ruleParams.initiatorUserGroup(),
            "ruleName": ruleParams.ruleName(),
            "workflowId": ruleParams.workflowId()
          },
          options = {
            url: "approvalRules?partyId={partyId}&description={description}&initiatorUserGroup={initiatorUserGroup}&ruleName={ruleName}&workflowId={workflowId}&expand=all",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      getTransactionsDeferred, getTransactions = function(taskType, deferred) {
        var options = {
          url: "resourceTasks?taskType=" + taskType + "&aspects=approval",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getTransactions: function(taskType) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(taskType, getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      fetchDetails: function(ruleParams) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(ruleParams, fetchDetailsDeferred);
        return fetchDetailsDeferred;
      }
    };
  };
  return new RulesAdminModel();
});