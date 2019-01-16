define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * var ServiceAdvisorsBaseModel - description
   *
   * @return {type}  description
   */
  var ServiceAdvisorsBaseModel = function() {
    var baseService = BaseService.getInstance(),
      fetchAdvisorsDeferred,

      /**
       * fetchAdvisors - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchAdvisors = function(deferred) {
        var options = {
          url: "me/party/serviceAdvisor",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };

    return {

      /**
       * fetchAdvisors - description
       *
       * @return {type}  description
       */
      fetchAdvisors: function() {
        fetchAdvisorsDeferred = $.Deferred();
        fetchAdvisors(fetchAdvisorsDeferred);
        return fetchAdvisorsDeferred;
      }
    };
  };
  return new ServiceAdvisorsBaseModel();
});
