define(["baseService", "jquery","framework/js/constants/constants"], function(BaseService, $, Constants) {
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
      fetchAccounts:function(){
        var options = {
          url: "transactions/count?countFor=created",
          showMessage: false
        };
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      }
    };
  };
  return new StatementModel();
});
