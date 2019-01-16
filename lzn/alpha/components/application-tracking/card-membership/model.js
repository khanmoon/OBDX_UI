define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function CardMembershipModel() {
    var Model = function(modelData) {
        this.membershipDetails = {
          membershipNumber: modelData ? (modelData.membershipNumber ? modelData.membershipNumber : "") : "",
          membershipName: modelData ? (modelData.membershipName ? modelData.membershipName : "") : ""
        };
      },
      baseService = BaseService.getInstance(),
      readMembershipDetailsDeferred,
      readMembershipDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/membership",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      updateMembershipDetailsDeferred,
      updateMembershipDetails = function(submissionId, applicationId, payload, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/membership",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readMembershipDetails: function(submissionId, applicationId) {
        readMembershipDetailsDeferred = $.Deferred();
        readMembershipDetails(submissionId, applicationId, readMembershipDetailsDeferred);
        return readMembershipDetailsDeferred;
      },
      updateMembershipDetails: function(submissionId, applicationId, payload) {
        updateMembershipDetailsDeferred = $.Deferred();
        updateMembershipDetails(submissionId, applicationId, payload, updateMembershipDetailsDeferred);
        return updateMembershipDetailsDeferred;
      }
    };
  };
});