define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CountryStatesModel = function() {
    var baseService = BaseService.getInstance(),
      countryDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getCountryData
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getCountryData = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      statesDeferred,
      /**
       * Private method to fetch countries.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getStatesData
       * @memberOf ErrorModel
       * @param {String} country - An object type deferred
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getStatesData = function(country, deferred) {
        var options = {
            url: "enumerations/country/{country}/state",
            success: function(status, jqXhr) {
              deferred.resolve(status, jqXhr);
            },
            error: function(status, jqXhr) {
              deferred.reject(status, jqXhr);
            }
          },
          params = {
            "country": country
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * Public method to fetch list of countries. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getCountryData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       CountryStatesModel.getCountryData().done(function(data) {
       *
       *       });
       */
      getCountryData: function() {
        countryDeferred = $.Deferred();
        getCountryData(countryDeferred);
        return countryDeferred;
      },
      /**
       * Public method to fetch list of applicable states for the selected country. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getStatesData
       * @memberOf CountryStatesModel
       * @param {String} country - Account number
       * @returns {Object} - deferredObject
       * @example
       *       CountryStatesModel.getStatesData(country).done(function(data) {
       *
       *       });
       */
      getStatesData: function(country) {
        statesDeferred = $.Deferred();
        getStatesData(country, statesDeferred);
        return statesDeferred;
      }
    };
  };
  return new CountryStatesModel();
});
