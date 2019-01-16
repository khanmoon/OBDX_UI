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
          "partyId": null,
          "userType": "ADMIN",
          "partyName": null,
          "workflowDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": "",
          "workflowCode": null,
          "workflowDescription": ""
        };
      },
      searchWorkflowDeferred, searchWorkflow = function(workflowName, description, deferred) {
        var options = {
          url: "approvalWorkflows?workflowName={workflowName}&description={description}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          workflowName: workflowName,
          description: description
        });
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      searchWorkflow: function(workflowName, description) {
        searchWorkflowDeferred = $.Deferred();
        searchWorkflow(workflowName, description, searchWorkflowDeferred);
        return searchWorkflowDeferred;
      }
    };
  };
  return new WorkflowSearchModel();
});