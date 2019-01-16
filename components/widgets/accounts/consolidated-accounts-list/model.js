define(["baseService","jquery"], function(BaseService,$) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var StatementModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
     * @param {Function} successHandler - function to be called once the flow details are successfully fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    var getJSONDataDeferred, getJSONData = function(deferred) {
        var options = {
          url: "consolidated-listing",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      validateAccessDeffered,
      /**
       * Function executes the "GET" request to validate the transaction against the given account number
       * @function validateAccess
       * @memberOf ProductService
       * @param {accountId} - unique accountId
       * @param {taskCode} - unique taskCode
       * @param {deferred} - resolved after successful execution or rejected after failure
       **/
      validateAccess = function(accountId, taskCode, deffered) {
        var options = {
          url: "accountAccess/" + accountId + "/validation/" + taskCode,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getJSONData: function() {
        getJSONDataDeferred = $.Deferred();
        getJSONData(getJSONDataDeferred);
        return getJSONDataDeferred;
      },
      validateAccess: function(accountId, taskCode) {
        validateAccessDeffered = $.Deferred();
        validateAccess(accountId, taskCode, validateAccessDeffered);
        return validateAccessDeffered;
      }
    };
  };
  return new StatementModel();
});
