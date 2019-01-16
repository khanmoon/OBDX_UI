define(["baseService"], function(BaseService) {
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
    return {
      getJSONData: function() {
        var options = {
          url: "accountQuickLinks"
        };
        return baseService.fetchJSON(options);
      },
      validateAccess: function(accountId, taskCode) {
        var options = {
          url: "accountAccess/" + accountId + "/validation/" + taskCode
        };
        return baseService.fetch(options);
      }
    };
  };
  return new StatementModel();
});
