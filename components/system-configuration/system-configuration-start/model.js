define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SystemConfigurationStart = function() {

    var Deferred, getHostSelection = function(deferred) {
        var options = {
          url: "configurations/variable/ConfigurationVariable/properties/BANK.DEFAULT.HOST?environmentId=OBDX",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchConfigurationDetailsDeferred, fetchConfigurationDetails = function(deferred) {
        var options = {
          url: "configurations/base/BaseConfig/properties/MULTI_ENTITY_CONFIGURATION",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      getHostSelection: function() {
        Deferred = $.Deferred();
        getHostSelection(Deferred);
        return Deferred;
      },
      fetchConfigurationDetails: function() {
        fetchConfigurationDetailsDeferred = $.Deferred();
        fetchConfigurationDetails(fetchConfigurationDetailsDeferred);
        return fetchConfigurationDetailsDeferred;
      }

    };
  };
  return new SystemConfigurationStart();
});