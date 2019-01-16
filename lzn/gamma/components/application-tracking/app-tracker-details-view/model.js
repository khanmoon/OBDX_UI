define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for application details view section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDetailsViewModel~Model
   * @class ApplicationDetailsViewModel
   */
  var ApplicationDetailsViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),

      applicationFormDeferred, fetchDocumentsByteArrayDeffered, fetchApplicationForm = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/applicationform",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readPreferencesDeffered, readPreferences = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/primaryPreferences",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readMembershipDetailsDeffered, readMembershipDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/membership",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readAdditionalDetailsDeffered, readAdditionalDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/additionalDetails",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readAddOnCardHolderDetailsDeffered, readAddOnCardHolderDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/addOnCardHolders",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readBalanceTransferDetailsDeffered, readBalanceTransferDetails = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/balanceTransfer",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
        var params = {
          documentUrl: documentUrl,
          mediaType: "media",
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      },
      fetchAddressesDeferred,
      fetchAddresses = function(applicantId, deferred) {
        var params = {
          "applicantId": applicantId
        };
        var options = {
          showMessage: false,
          url: "parties/{applicantId}/addresses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchStatesDeferred,
      /**
       *Method to fetch states.
       */
      fetchStates = function(country, deferred) {
        var params = {
          "countryCode": country
        };
        var options = {
          url: "enumerations/country/{countryCode}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchBranchesDeferred,
      fetchBranches = function(submissionId, deferred) {
        var params = {
          submissionId: submissionId
        };
        var options = {
          url: "locations/branches",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      };
    return {
      fetchApplicationForm: function(submissionId, applicationId) {
        applicationFormDeferred = $.Deferred();
        fetchApplicationForm(submissionId, applicationId, applicationFormDeferred);
        return applicationFormDeferred;
      },
      readPreferences: function(ubmissionId, applicationId) {
        readPreferencesDeffered = $.Deferred();
        readPreferences(ubmissionId, applicationId, readPreferencesDeffered);
        return readPreferencesDeffered;
      },
      readMembershipDetails: function(submissionId, applicationId) {
        readMembershipDetailsDeffered = $.Deferred();
        readMembershipDetails(submissionId, applicationId, readMembershipDetailsDeffered);
        return readMembershipDetailsDeffered;
      },
      readBalanceTransferDetails: function(submissionId, applicationId) {
        readBalanceTransferDetailsDeffered = $.Deferred();
        readBalanceTransferDetails(submissionId, applicationId, readBalanceTransferDetailsDeffered);
        return readBalanceTransferDetailsDeffered;
      },
      readAdditionalDetails: function(submissionId, applicationId) {
        readAdditionalDetailsDeffered = $.Deferred();
        readAdditionalDetails(submissionId, applicationId, readAdditionalDetailsDeffered);
        return readAdditionalDetailsDeffered;
      },
      readAddOnCardHolderDetails: function(submissionId, applicationId) {
        readAddOnCardHolderDetailsDeffered = $.Deferred();
        readAddOnCardHolderDetails(submissionId, applicationId, readAddOnCardHolderDetailsDeffered);
        return readAddOnCardHolderDetailsDeffered;
      },
      fetchDocumentsByteArray: function(documentUrl, ownerId) {
        fetchDocumentsByteArrayDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, fetchDocumentsByteArrayDeffered);
        return fetchDocumentsByteArrayDeffered;
      },
      fetchAddresses: function(applicantId) {
        fetchAddressesDeferred = $.Deferred();
        fetchAddresses(applicantId, fetchAddressesDeferred);
        return fetchAddressesDeferred;
      },
      fetchBranches: function(country) {
        fetchBranchesDeferred = $.Deferred();
        fetchBranches(country, fetchBranchesDeferred);
        return fetchBranchesDeferred;
      },
      fetchStates: function(country) {
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);
        return fetchStatesDeferred;
      }
    };
  };
  return new ApplicationDetailsViewModel();
});