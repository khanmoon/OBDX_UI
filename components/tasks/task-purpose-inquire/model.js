define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var purposeCodeInquireModel = function() {
    var baseService = BaseService.getInstance(),
      fetchPurposeListDeferred, fetchPurposeList = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchLinkagesDeferred, fetchLinkages = function(deferred) {
        var options = {
          url: "purposes/linkages",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      updateLinkageDeferred, updateLinkage = function(payload, deferred) {
        var options = {
          url: "purposes/linkages",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);
      };
    return {
      fetchPurposeList: function() {
        fetchPurposeListDeferred = $.Deferred();
        fetchPurposeList(fetchPurposeListDeferred);
        return fetchPurposeListDeferred;
      },
      fetchLinkages: function() {
        fetchLinkagesDeferred = $.Deferred();
        fetchLinkages(fetchLinkagesDeferred);
        return fetchLinkagesDeferred;
      },
      updateLinkage: function(payload) {
        updateLinkageDeferred = $.Deferred();
        updateLinkage(payload, updateLinkageDeferred);
        return updateLinkageDeferred;
      }
    };
  };
  return new purposeCodeInquireModel();
});