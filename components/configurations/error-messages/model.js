define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for ErrorModel. This file contains the model definition
   * for list of properties fetched from the server from table digx_fw_config_dms_prop_v and digx_fw_config_dms_nested_v
   * through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link ErrorModel.init}</li>
   *              <li>[getPropertiesList()]{@link ErrorModel.getPropertiesList}</li>
   *              <li>[getProperty()]{@link ErrorModel.getProperty}</li>
   *              <li>[updateProperty()]{@link ErrorModel.updateProperty}</li>
   *              <li>[addProperty()]{@link ErrorModel.addProperty}</li>
   *              <li>[deleteProperty()]{@link ErrorModel.deleteProperty}</li>
   *              <li>[getFilteredProperties()]{@link ErrorModel.getFilteredProperties}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~ErrorModel
   * @class ErrorModel
   */
  var ErrorModel = function() {
    var baseService = BaseService.getInstance(),
      getUserLocaleDeferred,
      getUserLocale = function(deferred) {
        var option = {
          url: "configurations/errors/userlocale",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(option);
      },
      getPropertiesListDeferred,
      /**
       * Private method to fetch list of Properties based on category id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getPropertiesList
       * @memberOf ErrorModel
       * @private
       *
       * @property {String} categoryId - category identifier of the properties to be fetched
       */
      getPropertiesList = function(categoryId, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties",
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
       * Private method to fetch Property based on category id and property id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getProperty
       * @memberOf ErrorModel
       * @private
       * @property {String} categoryId - category identifier of the property to be updated
       * @property {String} propertyId - property identifier of the property to be updated
       */
      getProperty = function(categoryId, propertyId, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties/{propertyId}",
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
       * Private method to update the property based on the category id provided. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function updateProperty
       * @memberOf ErrorModel
       * @private
       * @property {String} categoryId - category identifier of the property to be updated
       * @property {Object} data - stores the details of the property to be updated
       *
       */
      updateProperty = function(categoryId, data, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties",
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
       * Private method to add the new property for the given category id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function addProperty
       * @memberOf ErrorModel
       * @private
       * @property {String} categoryId - category identifier of the property to be added
       * @property {Object} data - stores the details of the property to be added
       *
       */
      addProperty = function(categoryId, data, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties",
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
       * Private method to delete the property for the given category id and property id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteProperty
       * @memberOf ErrorModel
       * @private
       * @property {String} categoryId - category identifier of the property to be deleted
       * @property {Object} propertyId - property id to be deleted
       *
       */
      deleteProperty = function(categoryId, propertyId, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties/{propertyId}",
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
       * Private method to read the property for the given category id and search text provided by the user.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFilteredProperties
       * @memberOf ErrorModel
       * @private
       * @property {String} categoryId - category identifier of the property to be searched
       * @property {Object} filterText - property id as a search input provided by the user to read
       *
       */
      getFilteredProperties = function(categoryId, filterText, deferred) {
        var option = {
            url: "configurations/errors/{configurationId}/properties?propertyId={propertyId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
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
       * Public method to fetch list of Properties. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getPropertiesList
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.getPropertiesList().then(function (data) {
       *
       *      });
       */
      getPropertiesList: function(categoryId) {

        getPropertiesListDeferred = $.Deferred();
        getPropertiesList(categoryId, getPropertiesListDeferred);
        return getPropertiesListDeferred;
      },

      getUserLocale: function() {

        getUserLocaleDeferred = $.Deferred();
        getUserLocale(getUserLocaleDeferred);
        return getUserLocaleDeferred;
      },

      /**
       * Public method to fetch the property based on the provided category id and property id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getProperty
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.getProperty().then(function (data) {
       *
       *      });
       */
      getProperty: function(categoryId, propertyId) {

        getPropertyDeferred = $.Deferred();
        getProperty(categoryId, propertyId, getPropertyDeferred);
        return getPropertyDeferred;
      },
      /**
       * Public method to update the property based on the provided category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function updateProperty
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.updateProperty().then(function (data) {
       *
       *      });
       */
      updateProperty: function(categoryId, data) {

        updatePropertyDeferred = $.Deferred();
        updateProperty(categoryId, data, updatePropertyDeferred);
        return updatePropertyDeferred;
      },
      /**
       * Public method to add the new property for given category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addProperty
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.addProperty().then(function (data) {
       *
       *      });
       */
      addProperty: function(categoryId, data) {

        addPropertyDeferred = $.Deferred();
        addProperty(categoryId, data, addPropertyDeferred);
        return addPropertyDeferred;
      },
      /**
       * Public method to delete the property for given category id and property id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addProperty
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.addProperty().then(function (data) {
       *
       *      });
       */
      deleteProperty: function(categoryId, propertyId) {

        deletePropertyDeferred = $.Deferred();
        deleteProperty(categoryId, propertyId, deletePropertyDeferred);
        return deletePropertyDeferred;
      },
      /**
       * Public method to fetch the property for the given category id and search text provided by the user.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFilteredProperties
       * @memberOf ErrorModel
       * @returns deferredObject
       * @example
       *      ErrorModel.getFilteredProperties().then(function (data) {
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
  return new ErrorModel();
});