define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsGlobalModel
   */
  var ServiceRequestsGlobalModel = function() {
    var Model = function() {
        this.SRDefinitionDTO = {
          name: null,
          description: null,
          priorityType: null,
          product: null,
          transactionType: "Internal",
          requestType: null,
          categoryType: null,
          allowedStatuses: null,
          isActive: null,
          form: {
            header: null,
            confirmMessage: null,
            infoNote: {
              header: null,
              description: null,
              icon:
              {
                value:null
              },
              audio:
              {
                value:null
              }
            },
            fields: [],
            subHeaders: [],
            sectionHeaders: []
          }
        };
      },
      baseService = BaseService.getInstance(),
      addServiceRequestDeferred,
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
      addServiceRequest = function(data, deferred) {
        var
          options = {
            url: "servicerequest/definitions",
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
       *      ServiceRequestGlobal.addServiceRequest().then(function (data) {
       *
       *      });
       */
      addServiceRequest: function(data) {
        addServiceRequestDeferred = $.Deferred();
        addServiceRequest(data, addServiceRequestDeferred);
        return addServiceRequestDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new ServiceRequestsGlobalModel();
});
