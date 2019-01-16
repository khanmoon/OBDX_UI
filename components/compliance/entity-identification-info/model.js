define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var EntityIdentificationModel = function() {
    var baseService = BaseService.getInstance();
    var fetchTitlesDeferred, fetchTitles = function(deferred) {
        var options = {
          url: "enumerations/salutation?for=primary",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCountryListDeferred, fetchCountryList = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchStateListDeferred, fetchStateList = function(country, deferred) {
        var params = {
            country: country
          },
          options = {
            url: "enumerations/country/{country}/state",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchIdentificationListDeferred, fetchIdentificationList = function(deferred) {
        var options = {
          url: "enumerations/fatcaIdentificationType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchTitles: function() {
        fetchTitlesDeferred = $.Deferred();
        fetchTitles(fetchTitlesDeferred);
        return fetchTitlesDeferred;
      },
      fetchCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);
        return fetchCountryListDeferred;
      },
      fetchStateList: function(country) {
        fetchStateListDeferred = $.Deferred();
        fetchStateList(country, fetchStateListDeferred);
        return fetchStateListDeferred;
      },
      fetchIdentificationList: function() {
        fetchIdentificationListDeferred = $.Deferred();
        fetchIdentificationList(fetchIdentificationListDeferred);
        return fetchIdentificationListDeferred;
      }
    };
  };
  return new EntityIdentificationModel();
});
