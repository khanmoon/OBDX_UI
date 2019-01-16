define([
  "baseService", "framework/js/constants/constants"
], function(BaseService, Constants) {
  "use strict";
  /**
   * Model file for service request raised section. This file contains the model definition
   * for ServiceRequest  section and exports the ServiceRequestModel model which can be used
   * as a component in any form in which service request needs to be represented
   *
   * @namespace ServiceRequestModel~ServiceRequestModel
   * @property {Object} fetchAccountInfoDeferred -To store the deferred object
   * @property {Object} baseService -To store Baseservice object
   */
  var ServiceRequestModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Method to fetch servicerequest data for particular partyId
     * @deferred object is resolved once the accounts information list is successfully fetched
     * @partyId - partyId for which list of service request needs to fetched
     */
    return {
      fetchAccountInfo: function() {
        if (Constants.userSegment === "ADMIN") {
          return baseService.fetchJSON({
            url: "design-dashboard/data/demand-deposits/demand-deposit-service-request"
          });
        }
        return baseService.fetch({
          url: "servicerequest?locale=en"
        });
      }
    };
  };
  return new ServiceRequestModel();
});
