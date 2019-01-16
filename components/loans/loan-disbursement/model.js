define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var LoansDisbursementModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    var fetchDisbursementInfoDeferred, fetchDisbursementInfo = function(accountId, deferred) {
      params = {
        "accountId": accountId
      };
      var options = {
        url: "accounts/loan/{accountId}/disbursements",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    var fetchAccountReadDeferred, fetchAccountRead = function(accountId, deferred) {
      params = {
        "accountId": accountId
      };
      var options = {
        url: "accounts/loan/{accountId}",
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
      fetchDisbursementInfo: function(accountId) {
        fetchDisbursementInfoDeferred = $.Deferred();
        fetchDisbursementInfo(accountId, fetchDisbursementInfoDeferred);
        return fetchDisbursementInfoDeferred;
      },
      fetchAccountRead: function(accountId) {
        fetchAccountReadDeferred = $.Deferred();
        fetchAccountRead(accountId, fetchAccountReadDeferred);
        return fetchAccountReadDeferred;
      }
    };
  };
  return new LoansDisbursementModel();
});