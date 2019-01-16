define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  var BankLookUpModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsDeferred, fetchDetails = function(lookUpUrl, deferred) {
        var options = {
          url: lookUpUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function uses baseService's fetch to GET the the types of National Clearing Code.
       * @function fetchNCCType
       *
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchNCCTypeDeferred, fetchNCCType = function(deferred) {
        var options = {
          url: "enumerations/nationalClearingCodeType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCountriesDeferred, fetchCountries = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchDetails: function(lookUpUrl) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(lookUpUrl, fetchDetailsDeferred);
        return fetchDetailsDeferred;
      },
      fetchNCCType: function() {
        fetchNCCTypeDeferred = $.Deferred();
        fetchNCCType(fetchNCCTypeDeferred);
        return fetchNCCTypeDeferred;
      },
      fetchCountries: function() {
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);
        return fetchCountriesDeferred;
      }
    };
  };
  return new BankLookUpModel();
});