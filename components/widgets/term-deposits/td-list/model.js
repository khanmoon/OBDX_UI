define(["baseService", "framework/js/constants/constants"], function(BaseService, Constants) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var MyDepositModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();

    return {
      fetchBankConfig: function() {
        var options = {
          url: "bankConfiguration"
        };
        return baseService.fetch(options);
      },
      fetchAccounts: function() {
        var options = {
          url: "accounts/deposit/"
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/term-deposits/td-accounts-overview";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      }
    };
  };
  return new MyDepositModel();
});
