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
          showMessage: false,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Deferred instance for fetching selected offer.
       */
      selectedOfferDeffered, fetchSelectedOfferDetails = function(offerId, deferred) {
        var params = {
            offerId: offerId
          },
          options = {
            url: "offers/" + offerId + "?productType=CC",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
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
      fetchSelectedOfferDetails: function(offerId) {
        selectedOfferDeffered = $.Deferred();
        fetchSelectedOfferDetails(offerId, selectedOfferDeffered);
        return selectedOfferDeffered;
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
    /*
     * This function will fetch and open the document. It creates a form dynamically, with only one GET action, and fires it. Once the document is recieved, it is downloaded.
     * @function fetchDocumentsByteArray
     * @param {String} documentUrl - the url of the document to be fetched
     * @param {function} successHandler - function fired when the data is recieved
     */
    /**
     * This is the function to fetch details of the application selected. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
     *
     * @function fetchApplicationSummary
     * @memberOf ApplicationDetailsViewModel~Model
     * @param {String} submissionId- submission id for which details are to be fetched
     * @param {String} applicationId- application id for which details are to be fetched
     * @param {Function} successHandler- function to be called on success
     * @example
     * ApplicationDetailsViewService.fetchApplicationSummary(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), successHandler.successHandlerApplicationSummary);
     */
  };
  return new ApplicationDetailsViewModel();
});
