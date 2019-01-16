define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request View Model. This file contains the model definition
   * for creating a new service request through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsViewModel
   */
  var ServiceRequestsVerifyModel = function() {
    var baseService = BaseService.getInstance(),
      addServiceRequestVerifyDeferred,
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function addServiceRequest
       * @memberOf ErrorModel
       * @param {Object} data - Data to be inserted
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      addServiceRequestVerify = function(data, deferred) {
        var
          options = {
            url: "servicerequest",
            data: data,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.add(options);
      };
    return {
      /**
       * Public method to add the new service request
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addServiceRequest
       * @memberOf RestServiceModels
       * @param {Object} data - payload to pass
       * @returns {Object} addServiceRequestDeferred
       * @example
       *      ServiceRequestView.addServiceRequest().then(function (data) {
       *
       *      });
       */
      addServiceRequestVerify: function(data) {
        addServiceRequestVerifyDeferred = $.Deferred();
        addServiceRequestVerify(data, addServiceRequestVerifyDeferred);
        return addServiceRequestVerifyDeferred;
      }
    };
  };
  return new ServiceRequestsVerifyModel();
});
