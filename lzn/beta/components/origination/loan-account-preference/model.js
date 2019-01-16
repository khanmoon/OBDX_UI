define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function LoanAccountPreferenceModel() {
    var Model = function() {
        this.loanAccountPreference = {
          loanAccountAdditionalDetails: {
            statementFrequncy: "",
            isRedraw: true
          }
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),

      submissionId, applicantId,
      fetchEnumDeferred, fetchEnum = function(deferred) {
        var options = {
          url: "enumerations/frequency?for=loanStatement",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAccountPreferenceDeferred, fetchAccountPreference = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveAccountPreferenceDeferred, saveAccountPreference = function(model, deferred) {
        var params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      };
    return {
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchEnum: function() {
        fetchEnumDeferred = $.Deferred();
        fetchEnum(fetchEnumDeferred);
        return fetchEnumDeferred;
      },
      fetchAccountPreference: function() {
        fetchAccountPreferenceDeferred = $.Deferred();
        fetchAccountPreference(fetchAccountPreferenceDeferred);
        return fetchAccountPreferenceDeferred;
      },
      saveAccountPreference: function(model) {
        saveAccountPreferenceDeferred = $.Deferred();
        saveAccountPreference(model, saveAccountPreferenceDeferred);
        return saveAccountPreferenceDeferred;
      }
    };
  };
});