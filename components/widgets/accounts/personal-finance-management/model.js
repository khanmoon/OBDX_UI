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
  var PaymentsCardModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    var fetchPaymentsInfoDeferred, fetchPaymentsInfo = function(accountId, deferred) {
      params = {
        "accountId": accountId
      };
      var options = {
        url: "payments/instructions?status=ACTIVE&type=ALL",

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
      fetchPaymentsInfo: function(accountId) {
        fetchPaymentsInfoDeferred = $.Deferred();
        fetchPaymentsInfo(accountId, fetchPaymentsInfoDeferred);
        return fetchPaymentsInfoDeferred;
      }
    };
  };
  return new PaymentsCardModel();
});