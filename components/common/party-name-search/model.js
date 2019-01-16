define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SearchPartyNameModel = function() {

    var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of SearchPartyNameModel
     *
     * @function
     * @memberOf SearchPartyNameModel
     * @returns Model
     */
    var

      /**
       * This function uses baseService's fetch to GET party details based on party id
       * @function fetchDetailsByName
       *
       * @param {String} partyId - String for which party name needs to be fetched
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsByNameDeferred, fetchDetailsByName = function(partyName, deferred) {
        var options = {
          url: "parties?fullName=" + partyName,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };

    return {

      fetchDetailsByName: function(partyName) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, fetchDetailsByNameDeferred);
        return fetchDetailsByNameDeferred;
      }
    };
  };
  return new SearchPartyNameModel();
});