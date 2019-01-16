/**
 * Model for fatca-compliane-declaration-status-report
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} reportGenerationModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportGenerationModel = function() {
    var baseService = BaseService.getInstance(),
      fetchEnumerationDeferred,
      /**
       * fetchEnumeration - fires the enumeration to fetch fatca compliance form status types.
       *
       * @param  {type} deferred             description
       * @return {type}                      description
       */
      fetchEnumeration = function(deferred) {
        var options = {
          url: "enumerations/fatcaFormStatus",
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
      fetchEnumeration: function() {
        fetchEnumerationDeferred = $.Deferred();
        fetchEnumeration(fetchEnumerationDeferred);
        return fetchEnumerationDeferred;
      }
    };
  };
  return new reportGenerationModel();
});
