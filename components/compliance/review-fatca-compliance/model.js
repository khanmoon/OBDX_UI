define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReviewFatcaComplianceModel = function() {
    var baseService = BaseService.getInstance();
    var submitFatcaComplianceDeferred,
    /**
     * submitFatcaCompliance - method to post fatca compliance to server
     *
     * @param  {Object} payload  fatca compliance data
     * @param  {Object} deferred deferred object
     * @return {void}          description
     */
    submitFatcaCompliance = function(payload, deferred) {
      var options = {
        url: "me/party/FATCA",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(jqXhr);
        }
      };
      baseService.add(options);
    };
    return {
      /**
       * submitFatcaCompliance - method to post fatca compliance to server
       *
       * @param  {Object} payload fatca compliance data
       * @return {Object}         deferred object
       */
      submitFatcaCompliance: function(payload) {
        submitFatcaComplianceDeferred = $.Deferred();
        submitFatcaCompliance(payload, submitFatcaComplianceDeferred);
        return submitFatcaComplianceDeferred;
      }
    };
  };
  return new ReviewFatcaComplianceModel();
});
