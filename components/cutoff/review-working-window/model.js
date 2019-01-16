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
  var WorkingWindowModel = function() {
    var
      baseService = BaseService.getInstance();

    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    var readWWDeferred, readWW = function(workingWindowId, deferred) {

      var params = {
        workingWindowId: workingWindowId
      };

      var options = {
        url: "workingWindows/{workingWindowId}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      readWW: function(workingWindowId) {
        readWWDeferred = $.Deferred();
        readWW(workingWindowId, readWWDeferred);
        return readWWDeferred;
      }
    };
  };
  return new WorkingWindowModel();
});