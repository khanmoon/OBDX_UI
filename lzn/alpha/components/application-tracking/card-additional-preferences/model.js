define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Additional Information Model. This file contains the model definition
   * for additional information section and exports the AdditionalInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Additional
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchComponents()]{@link AdditionalInfoModel.fetchComponents}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AdditionalInfo~AdditionalInfoModel
   * @class AdditionalInfoModel
   */
  var AdditionalInfoModel = function() {
    var baseService = BaseService.getInstance(),

      componentsListDeferred,

      submissionId,

      productGroupSerialNumber,

      applicationId,

      /**
       * Private method to fetch list of Components. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @private
       */
      fetchComponents = function(deferred) {
        var options = {
          url: "app-tracker/cardpreferences",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
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
      readPreferencesDeffered, readPreferences = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/primaryPreferences",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      readMembershipDetailsDeffered, readMembershipDetails = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/membership",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      readAdditionalDetailsDeffered, readAdditionalDetails = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/additionalDetails",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      readAddOnCardHolderDetailsDeffered, readAddOnCardHolderDetails = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/addOnCardHolders",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      readBalanceTransferDetailsDeffered, readBalanceTransferDetails = function(deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/balanceTransfer",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";
          return message;
        }(),
        InvalidPGSerialNumber: function() {
          var message = "";
          message += "\nNo ProductGroupSerialNumber found, please make sure ProductGroupSerialNumber is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";
          return message;
        }(),
        InvalidApplicationId: function() {
          var message = "";
          message += "\nNo ApplicationId found, please make sure ApplicationId is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";
          return message;
        }()
      };
    return {
      /**
       * Public method to fetch list of Components. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .done(handler) to handle the data.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @returns deferredObject
       * @example
       *      AdditionalInfoModel.fetchComponents().done(function (data) {
       *
       *      });
       */
      fetchComponents: function() {
        componentsListDeferred = $.Deferred();
        fetchComponents(componentsListDeferred);
        return componentsListDeferred;
      },
      fetchSelectedOfferDetails: function(offerId) {
        selectedOfferDeffered = $.Deferred();
        fetchSelectedOfferDetails(offerId, selectedOfferDeffered);
        return selectedOfferDeffered;
      },
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf AssetsInfoModel
       */
      init: function(subId, pgSerialNo, appId) {
        submissionId = subId || undefined;
        productGroupSerialNumber = pgSerialNo || undefined;
        applicationId = appId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        if (!productGroupSerialNumber) {
          throw new Error(errors.InvalidPGSerialNumber);
        }
        if (!applicationId) {
          throw new Error(errors.InvalidApplicationId);
        }
      },
      readPreferences: function() {
        readPreferencesDeffered = $.Deferred();
        readPreferences(readPreferencesDeffered);
        return readPreferencesDeffered;
      },
      readMembershipDetails: function() {
        readMembershipDetailsDeffered = $.Deferred();
        readMembershipDetails(readMembershipDetailsDeffered);
        return readMembershipDetailsDeffered;
      },
      readBalanceTransferDetails: function() {
        readBalanceTransferDetailsDeffered = $.Deferred();
        readBalanceTransferDetails(readBalanceTransferDetailsDeffered);
        return readBalanceTransferDetailsDeffered;
      },
      readAdditionalDetails: function() {
        readAdditionalDetailsDeffered = $.Deferred();
        readAdditionalDetails(readAdditionalDetailsDeffered);
        return readAdditionalDetailsDeffered;
      },
      readAddOnCardHolderDetails: function() {
        readAddOnCardHolderDetailsDeffered = $.Deferred();
        readAddOnCardHolderDetails(readAddOnCardHolderDetailsDeffered);
        return readAddOnCardHolderDetailsDeffered;
      }
    };
  };
  return new AdditionalInfoModel();
});