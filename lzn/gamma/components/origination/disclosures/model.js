define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var DisclosuresModel = function() {
    var getDisclosuresDeferred, getDisclosures = function(submissionId, applicantId, deferred) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
          success: function(data) {
            deferred.resolve(data);
          }
        };
      baseService.fetch(options, params);
    };
    return {
      getDisclosures: function(submissionId, applicantId) {
        getDisclosuresDeferred = $.Deferred();
        getDisclosures(submissionId, applicantId, getDisclosuresDeferred);
        return getDisclosuresDeferred;
      }
    };
  };
  return new DisclosuresModel();
});