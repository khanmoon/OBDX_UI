define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @class Model
   * @private
   * @memberOf MapModel
   */
  var MapModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();

    /**
     * This function sends a GET request to fetch the coordinates.
     * It delegates control to the success handler function once the coordinates are successfully fetched
     *
     * @function fetchCoordinates
     * @memberOf MapModel
     * @param {Function} successHandler function to be called on success
     * @example MapModel.fetchCoordinates();
     */
    var fetchCoordinatesDeffered, fetchCoordinates = function(deferred) {
      var options = {

        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      fetchCoordinates: function() {
        fetchCoordinatesDeffered = $.Deferred();
        fetchCoordinates(fetchCoordinatesDeffered);
        return fetchCoordinatesDeffered;
      }
    };
  };
  return new MapModel();
});
