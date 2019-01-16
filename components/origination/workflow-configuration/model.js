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
      saveWorkflowDeferred, saveWorkflow = function(payload, deferred) {
        var params = {
            "payload": payload
          },
          options = {
            url: "workflows/saveWorkflow",

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      saveWorkflow: function(payload) {
        saveWorkflowDeferred = $.Deferred();
        saveWorkflow(payload, saveWorkflowDeferred);
        return saveWorkflowDeferred;
      }
    };
  };
  return new WorkflowConfigurationModel();
});