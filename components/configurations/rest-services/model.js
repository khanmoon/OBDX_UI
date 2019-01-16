define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for RestService Model. This file contains the model definition
   * for list of properties fetched from the server from table DIGX_FW_CONFIG_OUT_RS_CFG_B through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link RestServiceModel.init}</li>
   *              <li>[getPropertiesList()]{@link RestServiceModel.getPropertiesList}</li>
   *              <li>[getProperty()]{@link RestServiceModel.getProperty}</li>
   *              <li>[updateProperty()]{@link RestServiceModel.updateProperty}</li>
   *              <li>[addProperty()]{@link RestServiceModel.addProperty}</li>
   *              <li>[deleteProperty()]{@link RestServiceModel.deleteProperty}</li>
   *              <li>[getFilteredProperties()]{@link RestServiceModel.getFilteredProperties}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~RestServiceModel
   * @class RestServiceModel
   */
  var RestServiceModel = function() {
    var baseService = BaseService.getInstance(),
      getPropertiesListDeferred,
      /**
       * Private method to fetch list of Properties based on service id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getPropertiesList
       * @param {String} categoryId - category identifier of the properties to be fetched
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       *
       */
      getPropertiesList = function(categoryId, deferred) {
        var option = {
            url: "configurations/restservices/properties",
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
       * Private method to fetch Property based on service id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getProperty
       * @memberOf RestServiceModel
       * @param {String} serviceId - serviceId identifier of the property to be updated
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       *
       */
      getProperty = function(serviceId, deferred) {
        var option = {
            url: "configurations/restservices/listWithFilter/{serviceId}/properties",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "serviceId": serviceId
          };
        baseService.fetch(option, params);
      },
      updatePropertyDeferred,
      /**
       * Private method to update the property based on the service id provided. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function updateProperty
       * @memberOf RestServiceModel
       * @param {String} serviceId - serviceId identifier of the property to be updated
       * @param {Object} data - stores the details of the property to be updated
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       */
      updateProperty = function(serviceId, data, deferred) {
        var option = {
            url: "configurations/restservices/{serviceId}/properties",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "serviceId": serviceId
          };
        baseService.update(option, params);
      },
      addPropertyDeferred,
      /**
       * Private method to add the new property for the given service id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function addProperty
       * @memberOf RestServiceModel
       * @param {String} serviceId - category identifier of the property to be added
       * @param {Object} data - stores the details of the property to be added
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       */
      addProperty = function(serviceId, data, deferred) {
        var option = {
            url: "configurations/restservices/{serviceId}/properties",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "serviceId": serviceId
          };
        baseService.add(option, params);
      },
      deletePropertyDeferred,
      /**
       * Private method to delete the property for the given service id. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteProperty
       * @memberOf RestServiceModel
       * @param {String} serviceId - serviceId identifier of the property to be deleted
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       */
      deleteProperty = function(serviceId, deferred) {
        var option = {
            url: "configurations/restservices/{serviceId}/properties",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "serviceId": serviceId
          };
        baseService.remove(option, params);
      },
      getFilteredPropertiesDeferred,
      /**
       * Private method to read the property for the given service id and search text provided by the user.
       * This method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFilteredProperties
       * @memberOf RestServiceModel
       * @param {Object} filterText - service id as a search input provided by the user to read
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       *
       */
      getFilteredProperties = function(filterText, deferred) {
        var option = {
            url: "configurations/restservices/listWithFilter/{serviceId}/properties",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "serviceId": filterText
          };
        baseService.fetch(option, params);
      };
    return {
      /**
       * Method to initialize the described model
       *
       * @function init
       * @memberOf RestServiceModel
       */
      /**
       * Public method to fetch list of Properties. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getPropertiesList
       * @memberOf RestServiceModel
       * @param {String}   categoryId   - preference name selected by user and use by the services to find the
       *                                     related categoryId.
       * @returns {Object} deferredObject
       * @example
       *  RestServiceModel.getPropertiesList().then(function (data) {
       *
       *      });
       */
      getPropertiesList: function(categoryId) {
        getPropertiesListDeferred = $.Deferred();
        getPropertiesList(categoryId, getPropertiesListDeferred);
        return getPropertiesListDeferred;
      },
      /**
       * Public method to fetch the property.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getProperty
       * @memberOf RestServiceModel
       * @param {String}   serviceId   - preference name selected by user and use by the services to find the
       *                                     related categoryId.
       * @returns {Object} deferredObject
       * @example
       *      RestServiceModel.getProperty().then(function (data) {
       *
       *      });
       */
      getProperty: function(serviceId) {
        getPropertyDeferred = $.Deferred();
        getProperty(serviceId, getPropertyDeferred);
        return getPropertyDeferred;
      },

      /**
       * Public method to update the property based on the provided category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function updateProperty
       * @memberOf RestServiceModel
       * @param {String}   serviceId   - preference name selected by user and use by the services to find the
       *                                     related categoryId.
       * @param {Object} data - payload to pass
       * @returns {Object} deferredObject
       * @example
       *      RestServiceModel.updateProperty().then(function (data) {
       *
       *      });
       */
      updateProperty: function(serviceId, data) {
        updatePropertyDeferred = $.Deferred();
        updateProperty(serviceId, data, updatePropertyDeferred);
        return updatePropertyDeferred;
      },
      /**
       * Public method to add the new property for given category id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addProperty
       * @memberOf RestServiceModels
       * @param {String} serviceId - serviceId identifier of the property to be updated
       * @param {Object} data - payload to pass
       * @returns {Object} deferredObject
       * @example
       *      RestServiceModel.addProperty().then(function (data) {
       *
       *      });
       */
      addProperty: function(serviceId, data) {
        addPropertyDeferred = $.Deferred();
        addProperty(serviceId, data, addPropertyDeferred);
        return addPropertyDeferred;
      },
      /**
       * Public method to delete the property for given category id and property id.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteProperty
       * @memberOf RestServiceModel
       * @param {object} serviceId - returning object
       * @returns {Object} deferredObject
       * @example
       *      RestServiceModel.deleteProperty().then(function (data) {
       *
       *      });
       */
      deleteProperty: function(serviceId) {

        deletePropertyDeferred = $.Deferred();
        deleteProperty(serviceId, deletePropertyDeferred);
        return deletePropertyDeferred;
      },
      /**
       * Public method to fetch the property for the given category id and search text provided by the user.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFilteredProperties
       * @memberOf RestServiceModel
       * @param {Object} filterText - service id as a search input provided by the user to read
       * @returns {Object} deferredObject
       * @example
       *      RestServiceModel.getFilteredProperties().then(function (data) {
       *
       *      });
       */
      getFilteredProperties: function(filterText) {

        getFilteredPropertiesDeferred = $.Deferred();
        getFilteredProperties(filterText, getFilteredPropertiesDeferred);
        return getFilteredPropertiesDeferred;
      }

    };
  };
  return new RestServiceModel();
});