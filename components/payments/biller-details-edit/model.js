define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var billerModel = function() {
    var id, currentRelNo,

      Model = function() {
        this.newEditedBillerModel = {
          relationshipNumber: null,
          consumerNumber: null,
          accountRelationshipNumber: null
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getCategoriesDeferred, getCategories = function(deferred) {
        var options = {
          url: "payments/billers?categoryType=ALL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerNamesDeferred, getBillerNames = function(category, deferred) {
        var options = {
          url: "payments/billers?categoryType=" + category,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      editBillerDeferred, editBiller = function(model, deferred) {
        var options = {
          url: "payments/registeredBillers/" + id + "/relations/" + currentRelNo,
          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);
      };
    return {
      /**
       * Method to initialize the described model
       */
      init: function(billerId, currentRelationshipNumber) {
        id = billerId;
        currentRelNo = currentRelationshipNumber;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCategories: function() {
        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);
        return getCategoriesDeferred;
      },
      getBillerNames: function(category) {
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(category, getBillerNamesDeferred);
        return getBillerNamesDeferred;
      },
      editBiller: function(model) {
        editBillerDeferred = $.Deferred();
        editBiller(model, editBillerDeferred);
        return editBillerDeferred;
      }
    };
  };
  return new billerModel();
});