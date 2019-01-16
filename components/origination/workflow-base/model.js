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
      fetchProductsDeferred, fetchProducts = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "workflows/products",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetch(options, params);
      },
      fetchWorkflowDeferred, fetchWorkflow = function(productClass, product, deferred) {
        var params = {
            "productClass": productClass,
            "product": product
          },
          options = {
            url: "workflows?productClass={productClass}&productSubClass={product}",

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetch(options, params);
      },
      saveWorkflowDeferred, saveWorkflow = function(payload, deferred) {
        var options = {
          url: "workflows",
          data: payload,

          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateWorkflowDeferred, updateWorkflow = function(flowId, payload, deferred) {
        var params = {
            workFlowId: flowId
          },
          options = {
            url: "workflows/" + flowId,

            data: payload,

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.update(options, params);
      },
      activateWorkflowDeferred, activateWorkflow = function(flowId, deferred) {
        var params = {
            workFlowId: flowId
          },
          options = {

            url: "workflows/" + flowId + "/activation",

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.update(options, params);
      };
    return {
      fetchProducts: function(partyId, payload) {
        fetchProductsDeferred = $.Deferred();
        fetchProducts(partyId, payload, fetchProductsDeferred);
        return fetchProductsDeferred;
      },
      fetchWorkflow: function(productClass, product) {
        fetchWorkflowDeferred = $.Deferred();
        fetchWorkflow(productClass, product, fetchWorkflowDeferred);
        return fetchWorkflowDeferred;
      },
      saveWorkflow: function(payload) {
        saveWorkflowDeferred = $.Deferred();
        saveWorkflow(payload, saveWorkflowDeferred);
        return saveWorkflowDeferred;
      },
      updateWorkflow: function(flowId, payload) {
        updateWorkflowDeferred = $.Deferred();
        updateWorkflow(flowId, payload, updateWorkflowDeferred);
        return updateWorkflowDeferred;
      },
      activateWorkflow: function(flowId) {
        activateWorkflowDeferred = $.Deferred();
        activateWorkflow(flowId, activateWorkflowDeferred);
        return activateWorkflowDeferred;
      }
    };
  };
  return new WorkflowConfigurationModel();
});