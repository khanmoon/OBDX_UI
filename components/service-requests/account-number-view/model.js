define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var AccountNumberModel = function() {
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
      accountNumberDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getAccountNumberData
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getAccountNumberData = function(deferred) {
        var options = {
          url: "accounts/demandDeposit",
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
       * @function getAccountNumberData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       AccountNumberModel.getAccountNumberData().done(function(data) {
       *
       *       });
       */
      getAccountNumberData: function() {
        accountNumberDeferred = $.Deferred();
        getAccountNumberData(accountNumberDeferred);
        return accountNumberDeferred;
      },
      getNewModel: function() {
        return new Model();
      }

    };
  };
  return new AccountNumberModel();
});
