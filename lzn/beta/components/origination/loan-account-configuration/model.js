define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  return function LoanAccountConfigurationModel() {
    var Model = function() {
        this.loanAccountConfigurationInfo = {
          loanAccountConfiguration: {
            fixedTermDuration: {
              days: "",
              months: "",
              years: ""
            },
            variableTermDuration: {
              days: 0,
              months: 0,
              years: 0
            },
            loanAccountConfigStageDetails: [{
              stageCode: "",
              stageName: "",
              frequencies: "",
              tenure: {
                days: "",
                months: "",
                years: ""
              }
            }],
            fixedTermPresent: true,
            interestOnlyPresent: true,
            statementFrequncy: "",
            isRedraw: true,
            statementRequired: true
          }
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      submissionId, applicantId,
      fetchLoanApplnOfferDetailsDeferred, fetchLoanApplnOfferDetails = function(deferred, offerId) {

        var options = {
          url: "submissions/" + submissionId + "/offers/" + offerId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      saveAccountConfigurationDeferred, saveAccountConfiguration = function(model, applicantId, deferred) {

        var options = {
          url: "submissions/" + submissionId + "/applicants/" + applicantId + "/accountConfiguration/loans",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      fetchAccountConfigurationDeferred, fetchAccountConfiguration = function(applicantId, deferred) {

        var options = {
          url: "submissions/" + submissionId + "/applicants/" + applicantId + "/accountConfiguration/loans",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
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
      fetchInterestRepaymentFrequencyDeferred, fetchInterestRepaymentFrequency = function(deferred) {

        var options = {
          url: "enumerations/interestRepaymentFrequency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchInstallmentRepaymentFrequencyDeferred, fetchInstallmentRepaymentFrequency = function(deferred) {

        var options = {
          url: "enumerations/installmentRepaymentFrequency",
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
      init: function(subId, appId) {
        submissionId = subId || undefined;
        applicantId = appId || undefined;

        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchLoanApplnOfferDetails: function(offerId) {
        fetchLoanApplnOfferDetailsDeferred = $.Deferred();
        fetchLoanApplnOfferDetails(fetchLoanApplnOfferDetailsDeferred, offerId);
        return fetchLoanApplnOfferDetailsDeferred;
      },
      saveAccountConfiguration: function(model, applicantId) {
        saveAccountConfigurationDeferred = $.Deferred();
        saveAccountConfiguration(model, applicantId, saveAccountConfigurationDeferred);
        return saveAccountConfigurationDeferred;
      },
      fetchAccountConfiguration: function(applicantId) {
        fetchAccountConfigurationDeferred = $.Deferred();
        fetchAccountConfiguration(applicantId, fetchAccountConfigurationDeferred);
        return fetchAccountConfigurationDeferred;
      },
      fetchEnum: function() {
        fetchEnumDeferred = $.Deferred();
        fetchEnum(fetchEnumDeferred);
        return fetchEnumDeferred;
      },
      fetchInterestRepaymentFrequency: function() {
        fetchInterestRepaymentFrequencyDeferred = $.Deferred();
        fetchInterestRepaymentFrequency(fetchInterestRepaymentFrequencyDeferred);
        return fetchInterestRepaymentFrequencyDeferred;
      },
      fetchInstallmentRepaymentFrequency: function() {
        fetchInstallmentRepaymentFrequencyDeferred = $.Deferred();
        fetchInstallmentRepaymentFrequency(fetchInstallmentRepaymentFrequencyDeferred);
        return fetchInstallmentRepaymentFrequencyDeferred;
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
