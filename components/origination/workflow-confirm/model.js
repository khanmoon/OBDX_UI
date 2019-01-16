define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WorkflowConfigurationModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    var
      fetchWorkflowDeferred, fetchWorkflow = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "workflows/fetchWorkflow",

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetchJSON(options, params);
      };
    return {
      fetchWorkflow: function(partyId, payload) {
        fetchWorkflowDeferred = $.Deferred();
        fetchWorkflow(partyId, payload, fetchWorkflowDeferred);
        return fetchWorkflowDeferred;
      }
    };
  };
  return new WorkflowConfigurationModel();
});