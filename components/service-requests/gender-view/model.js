define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var GenderModel = function() {
    var Model = function() {
        this.SRDefinitionDTO = {
          name: null,
          description: null,
          priorityType: null,
          moduleType: null,
          transactionType: null,
          requestType: null,
          categoryType: null,
          allowedStatuses: null,
          assignees: null,
          isActive: null,
          form: {
            header: null,
            confirmMessage: null,
            infoNote: {
              header: null,
              description: null
            },
            fields: [],
            subHeaders: [],
            sectionHeaders: []
          }
        };
      },
      baseService = BaseService.getInstance(),
      genderDeferred,
      /**
       * Private method to fetch the gender data
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getGenderData
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getGenderData = function(deferred) {
        var options = {
          url: "enumerations/gender",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        };
        baseService.fetch(options);
      };
    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getGenderData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       GenderModel.getGenderData().done(function(data) {
       *
       *       });
       */
      getGenderData: function() {
        genderDeferred = $.Deferred();
        getGenderData(genderDeferred);
        return genderDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new GenderModel();
});
