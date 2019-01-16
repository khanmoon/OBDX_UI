define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TemplateCycleModel = function() {
    var Model = function() {
        return {
          id: "",
          destinationType: "",
          templateBuffer: "",
          subjectBuffer: "",
          dataAttributes: [{
            dictionaryArray: null,
            refLinks: null,
            attributeMask: null,
            messageTemplateId: null,
            attributeId: null,
            dataSources: [{
              serviceAttributeId: null,
              activityId: null,
              attributeId: null,
              messageTemplateId: null
            }]
          }]
        };
      },

      MessageDataAttributeModel = function() {
        return {
          dictionaryArray: null,
          refLinks: null,
          attributeMask: null,
          messageTemplateId: null,
          attributeId: null,
          dataSources: null
        };
      },

      MessageDataSourceModel = function() {
        return {
          serviceAttributeId: null,
          activityId: null,
          attributeId: null,
          messageTemplateId: null
        };
      },
      modelInitialized = false,
      params, baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    var getDestinationTypeDeffered, getDestinationType = function(deferred) {
        var options = {
          url: "enumerations/destinationType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getRecipientCategoryDeffered, getRecipientCategory = function(deferred) {
        var options = {
          url: "enumerations/recipientCategory",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getRecipientDeffered, getRecipient = function(deferred, recipientCategory) {
        var options = {
          url: "enumerations/recipient?RecipientCategory=" + recipientCategory,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchDataAttributeListDeferred, fetchDataAttributeList = function(activityId, deferred) {

        var options = {

          url: "activities/" + activityId + "/dataAttributes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      getLocaleDeferred, getLocale = function(deferred) {
        var options = {
          url: "enumerations/locale",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid url. ";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"url\");";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewAttributeModel: function() {
        return new MessageDataAttributeModel();
      },
      getNewDataSourceModel: function() {
        return new MessageDataSourceModel();
      },
      getNewModel: function() {
        return new Model();
      },
      getDestinationType: function() {
        objectInitializedCheck();
        getDestinationTypeDeffered = $.Deferred();
        getDestinationType(getDestinationTypeDeffered);
        return getDestinationTypeDeffered;
      },
      getRecipientCategory: function() {
        objectInitializedCheck();
        getRecipientCategoryDeffered = $.Deferred();
        getRecipientCategory(getRecipientCategoryDeffered);
        return getRecipientCategoryDeffered;
      },
      getRecipient: function(recipientCategory) {
        objectInitializedCheck();
        getRecipientDeffered = $.Deferred();
        getRecipient(getRecipientDeffered, recipientCategory);
        return getRecipientDeffered;
      },
      fetchDataAttributeList: function(activityId) {
        fetchDataAttributeListDeferred = $.Deferred();
        fetchDataAttributeList(activityId, fetchDataAttributeListDeferred);
        return fetchDataAttributeListDeferred;
      },
      getLocale: function() {
        getLocaleDeferred = $.Deferred();
        getLocale(getLocaleDeferred);
        return getLocaleDeferred;
      }
    };
  };
  return new TemplateCycleModel();
});
