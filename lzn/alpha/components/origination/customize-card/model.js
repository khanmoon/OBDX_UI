define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function CardDetailsModel() {

    var

      baseService = BaseService.getInstance();

    var fetchAccountDetailsDeferred,
      fetchAccountDetails = function(submissionId, facilityId, deferred) {
        var params = {
            submissionId: submissionId,
            facilityId: facilityId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/account?facilityId={facilityId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      createDiliveryPreferencesDeferred,
      createDiliveryPreferences = function(submissionId, payload, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/account",
            data: JSON.stringify(payload),
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      };

    return {

      fetchAccountDetails: function(submissionId, facilityId) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(submissionId, facilityId, fetchAccountDetailsDeferred);
        return fetchAccountDetailsDeferred;
      },
      createDiliveryPreferences: function(submissionId, payload) {
        createDiliveryPreferencesDeferred = $.Deferred();
        createDiliveryPreferences(submissionId, payload, createDiliveryPreferencesDeferred);
        return createDiliveryPreferencesDeferred;
      }
    };
  };
});