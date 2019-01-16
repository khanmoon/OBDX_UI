define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RulesAdminModel = function() {
    var Model = function() {
        this.approvals = {
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
          "partyId": ruleParams.partyId(),
          "initiatorUserGroup": ruleParams.initiatorUserGroup(),
          "ruleName": ruleParams.ruleName(),
          "workflowId": ruleParams.workflowId()
        },
        options = {
          url: "approvalRules?partyId={partyId}&description={description}&initiatorUserGroup={initiatorUserGroup}&ruleName={ruleName}&workflowId={workflowId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
      baseService.fetch(options, params);
    };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
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