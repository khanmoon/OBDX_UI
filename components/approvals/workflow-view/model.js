define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var WorkflowViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    var Model = function() {
        return {
          UserGroup: {
            "name": null,
            "type": null,
            "partyId": null,
            "unary": false,
            "users": []
          },
          workflowPayload: {
            "name": null,
            "description": null,
            "workFlowId": null,
            "partyId": null,
            "version": null,
            "steps": [{
              "sequenceNo": "1",
              "userGroup": {
                "id": null,
                "name": null,
                "partyId": null,
                "unary": false,
                "users": [{
                  "userId": null,
                  "firstName": null,
                  "lastName": null
                }]
              }
            }]
          }
        };
      },
      UserModel = function() {
        return {
          userID: null,
          userName: null
        };
      },
      fetchUserListDeferred, fetchUserList = function(partyId, deferred) {
        var options = {
          url: "users?partyId={partyId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          "partyId": partyId
        });
      },
      saveModelDeferred, saveModel = function(model, userGroupId, deferred) {
        var params = {
          "userGroupId": userGroupId,
          "model": model
        };
        var options = {
          url: "userGroups/{userGroupId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      createWorkflowDeferred, createWorkflow = function(workflowCreatePayload, deferred) {
        var options = {
          url: "approvalWorkflows",
          data: workflowCreatePayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateWorkflowDeferred, updateWorkflow = function(workflowUpdatePayload, workflowId, deferred) {
        var options = {
          url: "approvalWorkflows/" + workflowId,
          data: workflowUpdatePayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      readWorkflowDeferred, readWorkflow = function(workflowId, deferred) {
        var options = {
          url: "approvalWorkflows/" + workflowId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      readWorkflow: function(workflowId) {
        readWorkflowDeferred = $.Deferred();
        readWorkflow(workflowId, readWorkflowDeferred);
        return readWorkflowDeferred;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchUserList: function(partyId) {
        fetchUserListDeferred = $.Deferred();
        fetchUserList(partyId, fetchUserListDeferred);
        return fetchUserListDeferred;
      },
      getUserModel: function() {
        return new UserModel();
      },
      updateWorkflow: function(workflowUpdatePayload, workflowId) {
        updateWorkflowDeferred = $.Deferred();
        updateWorkflow(workflowUpdatePayload, workflowId, updateWorkflowDeferred);
        return updateWorkflowDeferred;
      },
      saveModel: function(userGroupModel, userGroupId) {
        saveModelDeferred = $.Deferred();
        saveModel(userGroupModel, userGroupId, saveModelDeferred);
        return saveModelDeferred;
      },
      createWorkflow: function(workflowCreatePayload) {
        createWorkflowDeferred = $.Deferred();
        createWorkflow(workflowCreatePayload, createWorkflowDeferred);
        return createWorkflowDeferred;
      }
    };
  };
  return new WorkflowViewModel();
});
