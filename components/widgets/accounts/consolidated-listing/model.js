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
  var ListingModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    return {
      fetchAccounts: function() {
        var options = {
          url: "accounts"
        };
          return baseService.fetch(options);
      },
      fetchCardInfo: function() {
        var options = {
          url: "accounts/cards/credit?expand=ALL"
        };
        baseService.fetch(options);
      }
    };
  };
  return new ListingModel();
});
