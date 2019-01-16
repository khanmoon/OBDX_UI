define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var approvalsRulesModel = function() {
    var Model = function() {
      return {
        rulesSearchPayload: {
          "ruleName": "",
          "userGroupName": "",
          "name": "",
          "approvalRequired": ""
        },
        approvals: {
          "userType": "CUSTOMER",
          "partyName": null,
          "partyFirstName": "",
          "partyLastName": "",
          "partyDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": null,
          "party": {
            value: null,
            displayValue: null
          }
        }
      };
    };
    var baseService = BaseService.getInstance();
    var searchRulesDeferred, searchRules = function(searchURL, deferred) {
        var options = {
          url: searchURL,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
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
      getPartyDetailsDeferred, getPartyDetails = function(partyId, deferred) {
        var options = {
          url: "administration/parties/" + partyId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
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
      getUserGroupsListDeferred, getUserGroupsList = function(partyId, userType, deferred) {
        var options = {
          url: "userGroups?partyId=" + partyId + "&userGroupType=" + userType,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      deleteRuleDeferred, deleteRule = function(ruleId, deferred) {
        var options = {
          url: "approvalRules/" + ruleId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      },
      fetchMeDeferred, fetchMe = function(deferred) {

        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeWithPartyDeferred, fetchMeWithParty = function(deferred) {

        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      searchRules: function(searchURL) {
        searchRulesDeferred = $.Deferred();
        searchRules(searchURL, searchRulesDeferred);
        return searchRulesDeferred;
      },
      getUserGroupsList: function(partyId, userType) {
        getUserGroupsListDeferred = $.Deferred();
        getUserGroupsList(partyId, userType, getUserGroupsListDeferred);
        return getUserGroupsListDeferred;
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
      deleteRule: function(ruleId) {
        deleteRuleDeferred = $.Deferred();
        deleteRule(ruleId, deleteRuleDeferred);
        return deleteRuleDeferred;
      },
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);
        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);
        return fetchMeWithPartyDeferred;
      }
    };
  };
  return new approvalsRulesModel();
});
