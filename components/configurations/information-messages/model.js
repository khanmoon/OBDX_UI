define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for InfoMessageModel. This file contains the model definition
   * for list of info fetched from the server from table digx_fw_info_messages through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link InfoMessageModel.init}</li>
   *              <li>[getPropertiesList()]{@link InfoMessageModel.getPropertiesList}</li>
   *              <li>[getProperty()]{@link InfoMessageModel.getProperty}</li>
   *              <li>[updateProperty()]{@link InfoMessageModel.updateProperty}</li>
   *              <li>[addProperty()]{@link InfoMessageModel.addProperty}</li>
   *              <li>[deleteProperty()]{@link InfoMessageModel.deleteProperty}</li>
   *              <li>[getFilteredProperties()]{@link InfoMessageModel.getFilteredProperties}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~InfoMessageModel
   * @class InfoMessageModel
   */
  var InfoMessageModel = function() {
    var baseService = BaseService.getInstance(),
      getPropertiesListDeferred,
      /**
       * Private method to fetch list of info properties based on category id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getPropertiesList
       * @memberOf InfoMessageModel
       * @private
       *
       * @property {String} categoryId - category identifier of the info properties to be fetched
       */
      getPropertiesList = function(categoryId, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "configurationId": categoryId
          };
        baseService.fetch(option, params);
      },
      getPropertyDeferred,
      /**
       * Private method to fetch info property based on category id and property id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getProperty
       * @memberOf InfoMessageModel
       * @private
       * @property {String} categoryId - category identifier of the info property to be updated
       * @property {String} propertyId - property identifier of the info property to be updated
       */
      getProperty = function(categoryId, propertyId, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties/{propertyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "configurationId": categoryId,
            "propertyId": propertyId
          };
        baseService.fetch(option, params);
      },
      updatePropertyDeferred,
      /**
       * Private method to update the info property based on the category id provided. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function updateProperty
       * @memberOf InfoMessageModel
       * @private
       * @property {String} categoryId - category identifier of theinfo property to be updated
       * @property {Object} data - stores the details of the info property to be updated
       *
       */
      updateProperty = function(categoryId, data, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "configurationId": categoryId
          };
        baseService.update(option, params);
      },
      addPropertyDeferred,
      /**
       * Private method to add the new info property for the given category id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function addProperty
       * @memberOf InfoMessageModel
       * @private
       * @property {String} categoryId - category identifier of the info property to be added
       * @property {Object} data - stores the details of the info property to be added
       *
       */
      addProperty = function(categoryId, data, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "configurationId": categoryId
          };
        baseService.add(option, params);
      },
      deletePropertyDeferred,
      /**
       * Private method to delete the info property for the given category id and property id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteProperty
       * @memberOf InfoMessageModel
       * @private
       * @property {String} categoryId - category identifier of the info property to be deleted
       * @property {Object} propertyId - info property id to be deleted
       *
       */
      deleteProperty = function(categoryId, propertyId, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties/{propertyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "configurationId": categoryId,
            "propertyId": propertyId
          };
        baseService.remove(option, params);
      },
      getFilteredPropertiesDeferred,
      /**
       * Private method to read the info property for the given category id and search text provided by the user.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFilteredProperties
       * @memberOf InfoMessageModel
       * @private
       * @property {String} categoryId - category identifier of the property to be searched
       * @property {Object} filterText - property id as a search input provided by the user to read
       *
       */
      getFilteredProperties = function(categoryId, filterText, deferred) {
        var option = {
            url: "configurations/info/InfoMessagesConfig_en/properties?propertyId={propertyId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(jqXHR, errData, err) {
              baseService.genericErrorHandler(jqXHR, errData, err);
              deferred.reject(jqXHR);
            }
          },
          params = {
            "configurationId": categoryId,
            "propertyId": filterText
          };
        baseService.fetch(option, params);
      };
    return {
      /**
       * Public method to fetch list of info properties. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getPropertiesList
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.getPropertiesList().then(function (data) {
       *
       *      });
       */
      getPropertiesList: function(categoryId) {

        getPropertiesListDeferred = $.Deferred();
        getPropertiesList(categoryId, getPropertiesListDeferred);
        return getPropertiesListDeferred;
      },
      /**
       * Public method to fetch the info based on the provided category id and property id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getProperty
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.getProperty().then(function (data) {
       *
       *      });
       */
      getProperty: function(categoryId, propertyId) {

        getPropertyDeferred = $.Deferred();
        getProperty(categoryId, propertyId, getPropertyDeferred);
        return getPropertyDeferred;
      },
      /**
       * Public method to update the info based on the provided category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function updateProperty
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.updateProperty().then(function (data) {
       *
       *      });
       */
      updateProperty: function(categoryId, data) {

        updatePropertyDeferred = $.Deferred();
        updateProperty(categoryId, data, updatePropertyDeferred);
        return updatePropertyDeferred;
      },
      /**
       * Public method to add the new info for given category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addProperty
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.addProperty().then(function (data) {
       *
       *      });
       */
      addProperty: function(categoryId, data) {

        addPropertyDeferred = $.Deferred();
        addProperty(categoryId, data, addPropertyDeferred);
        return addPropertyDeferred;
      },
      /**
       * Public method to delete the info for given category id and property id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addProperty
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.addProperty().then(function (data) {
       *
       *      });
       */
      deleteProperty: function(categoryId, propertyId) {

        deletePropertyDeferred = $.Deferred();
        deleteProperty(categoryId, propertyId, deletePropertyDeferred);
        return deletePropertyDeferred;
      },
      /**
       * Public method to fetch the info for the given category id and search text provided by the user.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFilteredProperties
       * @memberOf InfoMessageModel
       * @returns deferredObject
       * @example
       *      InfoMessageModel.getFilteredProperties().then(function (data) {
       *
       *      });
       */
      getFilteredProperties: function(categoryId, filterText) {

        getFilteredPropertiesDeferred = $.Deferred();
        getFilteredProperties(categoryId, filterText, getFilteredPropertiesDeferred);
        return getFilteredPropertiesDeferred;
      }
    };
  };
  return new InfoMessageModel();
});