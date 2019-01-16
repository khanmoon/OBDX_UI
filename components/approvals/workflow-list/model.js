define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WorkflowSearchModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
        this.workflowSearch = {
          "name": null,
          "description": null,
          "steps": [{
            "sequenceNo": "1",
            "paneldto": {
              "panelId": null
            }
          }]
        };
        this.approvals = {
          "partyFirstName": null,
          "partyLastName": null,
          "userType": "CUSTOMER",
          "partyName": null,
          "partyDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": "",
          "party": {
            "value": "",
            "displayValue": ""
          }
        };
      },
      searchWorkflowDeferred, searchWorkflow = function(searchURL, deferred) {
        var options = {
          url: searchURL,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeDeferred, fetchMeWithPartyDeferred, fetchMe = function(deferred) {

        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {

        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      searchWorkflow: function(searchURL) {
        searchWorkflowDeferred = $.Deferred();
        searchWorkflow(searchURL, searchWorkflowDeferred);
        return searchWorkflowDeferred;
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
  return new WorkflowSearchModel();
});
