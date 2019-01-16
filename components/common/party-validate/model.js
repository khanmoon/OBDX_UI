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
  var PartyValidateModel = function() {

    var baseService = BaseService.getInstance(),
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsDeferred, fetchDetails = function(partyId, targetUnit, deferred,partyName) {
        var options = {
          url: "parties?partyId=" + partyId+"&fullName="+partyName,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        if (targetUnit) {
          options.headers = {
            "X-Target-Unit": targetUnit
          };
        }
        baseService.fetch(options);
      },
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetailsWithIndirectedValue
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsWithIndirectedValueDeferred, fetchDetailsWithIndirectedValue = function(partyId, targetUnit, deferred) {
        var options = {
          url: "parties/" + partyId + "?expand=addresses,contactPoints",

          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        if (targetUnit) {
          options.headers = {
            "X-Target-Unit": targetUnit
          };
        }
        baseService.fetch(options);
      },
      /**
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsByNameDeferred, fetchDetailsByName = function(partyName, targetUnit, deferred) {
        var options = {
          url: "parties?fullName=" + partyName,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        if (targetUnit) {
          options.headers = {
            "X-Target-Unit": targetUnit
          };
        }
        baseService.fetch(options);
      };
    return {
      fetchDetails: function(partyId, targetUnit,partyName) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(partyId, targetUnit, fetchDetailsDeferred,partyName);
        return fetchDetailsDeferred;
      },
      fetchDetailsWithIndirectedValue: function(partyId, targetUnit) {
        fetchDetailsWithIndirectedValueDeferred = $.Deferred();
        fetchDetailsWithIndirectedValue(partyId, targetUnit, fetchDetailsWithIndirectedValueDeferred);
        return fetchDetailsWithIndirectedValueDeferred;
      },
      fetchDetailsByName: function(partyName, targetUnit) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, targetUnit, fetchDetailsByNameDeferred);
        return fetchDetailsByNameDeferred;
      }
    };
  };
  return new PartyValidateModel();
});